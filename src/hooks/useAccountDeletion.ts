import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EmailAuthProvider, GoogleAuthProvider, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, type User,
} from 'firebase/auth';
import * as SQLite from 'expo-sqlite';
import {
  useCallback, useState, type MutableRefObject,
} from 'react';
import { Platform } from 'react-native';
import { authErrorKey } from './useAuth';
import { promptedKey } from './useClaimLocalData';
import { deleteCloudAccountData, ensureDeletionLock } from '../firebase/accountDeletion';
import { db as firestore } from '../firebase/config';
import * as ownershipRepo from '../db/ownershipRepo';
import type { Copy } from '../i18n/copy';

export type DeleteAccountStatus =
  | 'idle' | 'awaiting-sync' | 'reauthenticating' | 'locking-account' | 'deleting-cloud' | 'purging-local'
  | 'deleting-auth' | 'success'
  | 'error-reauth' | 'error-lock' | 'error-cloud' | 'error-local' | 'error-auth' | 'error-sync-busy';

// Whether any destructive step may already have run when a given failure
// status was reached — used to pick the right copy (plain retry vs. "some
// or all of your data may already be gone, it's safe to retry"). Only
// error-reauth and error-sync-busy are guaranteed to have touched nothing:
// cloud deletion is chunked into multiple batches, so even error-cloud can
// mean some of the user's documents were already removed before the
// failure.
export function deleteAccountFailureIsPartial(status: DeleteAccountStatus): boolean {
  return status === 'error-cloud' || status === 'error-local' || status === 'error-auth';
}

const SYNC_WAIT_POLL_MS = 250;
const SYNC_WAIT_TIMEOUT_MS = 15000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Deletion order matters for safety: cloud data and local data are both
// wiped BEFORE the Firebase Auth account itself is deleted. If the Auth
// account were deleted first and anything after it failed, the uid could
// never authenticate again — any leftover Firestore data under that uid
// would become permanently unreachable, by anyone, forever (the security
// rules require request.auth.uid == uid, and no such auth can ever exist
// again). Deleting cloud+local first means every failure up to the last
// step leaves the account in a safe, retryable state: sign back in, press
// delete again, and the already-empty steps simply no-op (see
// accountDeletion.ts / ownershipRepo.purgeAccountData for idempotency).
//
// The server-side deletionInProgress lock (ensureDeletionLock, set right
// after reauthentication, before any cloud record is deleted) is what
// actually prevents a DIFFERENT device/session signed into this account
// from recreating data mid-deletion — enforced by firestore.rules, not by
// client code. It is intentionally never cleared by this flow, on either
// error or success (see accountDeletion.ts's releaseDeletionLock comment).
//
// `syncingRef`/`pausedRef` are shared with useSync (same ref instances,
// created once in App.tsx) to prevent a push from recreating cloud
// documents this flow just deleted:
//   - pausedRef is set true for the ENTIRE duration of this function (via
//     try/finally, so it is reset on every exit path — success, any
//     error, or an early return) so neither the periodic interval nor a
//     manual "Sync Now" click can start a NEW sync while deletion runs.
//   - syncingRef is polled first, with a bounded wait, in case a sync was
//     already mid-flight the instant deletion was requested — deletion
//     only proceeds to any destructive step once no sync is running.
//   - This only protects against races within THIS app session/device; see
//     the module-level comment in useSync.ts for the cross-device gap.
export function useAccountDeletion(
  sqliteDb: SQLite.SQLiteDatabase | null, ownerId: string | null, authUser: User | null,
  syncingRef: MutableRefObject<boolean>, pausedRef: MutableRefObject<boolean>
) {
  const [status, setStatus] = useState<DeleteAccountStatus>('idle');
  const [errorKey, setErrorKey] = useState<keyof Copy | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorKey(null);
    pausedRef.current = false;
  }, [pausedRef]);

  const deleteAccount = useCallback(async (password?: string) => {
    if (!authUser || !sqliteDb || !ownerId) return;

    // Block any NEW sync from starting before doing anything else —
    // covers both the periodic interval and a manual "Sync Now" click,
    // both of which go through useSync's syncNow() and check this flag.
    pausedRef.current = true;
    try {
      if (syncingRef.current) {
        setStatus('awaiting-sync');
        setErrorKey(null);
        const deadline = Date.now() + SYNC_WAIT_TIMEOUT_MS;
        while (syncingRef.current) {
          if (Date.now() > deadline) {
            setStatus('error-sync-busy');
            setErrorKey('deleteAccountSyncBusy');
            return;
          }
          await delay(SYNC_WAIT_POLL_MS);
        }
      }

      const isPasswordProvider = authUser.providerData.some(p => p.providerId === 'password');
      const isGoogleProvider = authUser.providerData.some(p => p.providerId === 'google.com');

      setStatus('reauthenticating');
      setErrorKey(null);
      try {
        if (isPasswordProvider) {
          if (!password) {
            setStatus('error-reauth');
            setErrorKey('deleteAccountNeedsPassword');
            return;
          }
          const credential = EmailAuthProvider.credential(authUser.email ?? '', password);
          await reauthenticateWithCredential(authUser, credential);
        } else if (isGoogleProvider) {
          if (Platform.OS !== 'web') {
            setStatus('error-reauth');
            setErrorKey('deleteAccountGoogleNativeUnsupported');
            return;
          }
          await reauthenticateWithPopup(authUser, new GoogleAuthProvider());
        }
      } catch (err) {
        // Nothing irreversible has happened yet: the Auth account still
        // exists, so retrying from the top is always safe here.
        setStatus('error-reauth');
        setErrorKey(authErrorKey(err));
        return;
      }

      if (!firestore) {
        setStatus('error-reauth');
        setErrorKey('authErrorGeneric');
        return;
      }

      // Server-side lock: must be in place before any cloud record is
      // deleted. While users/{uid}/meta/deletionInProgress exists,
      // firestore.rules blocks every device/session signed into this
      // account from creating or updating synced records — the guarantee
      // pausedRef/syncingRef above cannot provide across devices. Nothing
      // destructive to user data happens here, so a failure at this step
      // is safe to simply retry from the top.
      setStatus('locking-account');
      try {
        await ensureDeletionLock(firestore, ownerId);
      } catch (err) {
        setStatus('error-lock');
        setErrorKey(authErrorKey(err));
        return;
      }

      setStatus('deleting-cloud');
      try {
        await deleteCloudAccountData(firestore, ownerId);
      } catch (err) {
        // Deletion is chunked into batches, so some of this account's cloud
        // documents may already be gone even though this call threw. Safe to
        // retry in full: already-deleted documents are simply skipped.
        setStatus('error-cloud');
        setErrorKey(authErrorKey(err));
        return;
      }

      setStatus('purging-local');
      try {
        await ownershipRepo.purgeAccountData(sqliteDb, ownerId);
        await AsyncStorage.removeItem(promptedKey(ownerId));
      } catch (err) {
        // Cloud data is already gone; local purge is cheap and idempotent,
        // so retrying the whole flow again will simply redo this step.
        setStatus('error-local');
        setErrorKey(authErrorKey(err));
        return;
      }

      setStatus('deleting-auth');
      try {
        await deleteUser(authUser);
      } catch (err) {
        // Cloud + local data are already gone; only the Auth record remains.
        // Surfaced distinctly so the user isn't told deletion fully failed
        // when their data has, in fact, already been removed.
        setStatus('error-auth');
        setErrorKey(authErrorKey(err));
        return;
      }

      setStatus('success');
    } finally {
      // Always runs, on every exit path above (success, every error return,
      // and the sync-wait timeout) — sync can never be left stuck paused.
      pausedRef.current = false;
    }
  }, [authUser, ownerId, sqliteDb, syncingRef, pausedRef]);

  return { status, errorKey, deleteAccount, reset };
}
