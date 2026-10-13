import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { db as firestore } from '../firebase/config';
import {
  ALL_ENTITY_SYNC_CONFIGS, pullEntity, pullProfile, pushEntity, pushProfile,
} from '../firebase/sync';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

const FOREGROUND_SYNC_INTERVAL_MS = 2 * 60 * 1000;

// One-shot push-then-pull pass across every entity, triggered on sign-in,
// on a conservative foreground interval, and manually via syncNow(). Not a
// realtime listener — see Phase 3 plan for why that scope was deliberately
// kept out.
export function useSync(db: SQLite.SQLiteDatabase | null, ownerId: string | null, onSynced: () => Promise<void>) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const syncingRef = useRef(false);

  const syncNow = useCallback(async () => {
    if (!db || !ownerId || !firestore) return;
    if (syncingRef.current) return;
    syncingRef.current = true;
    setStatus('syncing');
    try {
      for (const config of ALL_ENTITY_SYNC_CONFIGS) {
        await pushEntity(db, firestore, ownerId, config);
      }
      await pushProfile(db, firestore, ownerId);
      for (const config of ALL_ENTITY_SYNC_CONFIGS) {
        await pullEntity(db, firestore, ownerId, config);
      }
      await pullProfile(db, firestore, ownerId);
      await onSynced();
      setStatus('success');
      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      syncingRef.current = false;
    }
    // onSynced is a stable callback from the caller (wrapped in useCallback there)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId]);

  // Sync once when a user becomes signed in (covers both "just signed in"
  // and "app started with a restored session").
  useEffect(() => {
    (async () => {
      if (db && ownerId) await syncNow();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId]);

  // Conservative periodic retry while the app is open and signed in — not
  // tied to connectivity detection (no NetInfo dependency); a sync attempt
  // while offline just fails fast and the status reflects that.
  useEffect(() => {
    if (!ownerId) return;
    const interval = setInterval(() => { void syncNow(); }, FOREGROUND_SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [ownerId, syncNow]);

  return { status, lastSyncedAt, errorMessage, syncNow };
}
