import {
  collection, deleteDoc, doc, getDoc, getDocs, setDoc, writeBatch, type Firestore,
} from 'firebase/firestore';
import { ALL_ENTITY_SYNC_CONFIGS } from './sync';

// Firestore write batches cap at 500 operations.
const BATCH_LIMIT = 500;

function deletionLockRef(firestore: Firestore, uid: string) {
  return doc(firestore, `users/${uid}/meta/deletionInProgress`);
}

// Must run (and succeed) BEFORE deleteCloudAccountData. While this doc
// exists, firestore.rules blocks every device/session signed into this
// account from creating or updating any synced record — the server-side
// guarantee that a client-side pause flag alone can't provide across
// devices. Check-then-create, never a blind setDoc: once the lock exists,
// the rule itself blocks further create/update on it (by design — see
// firestore.rules), so re-writing it on a retry would be rejected. Reading
// first and skipping creation when it already exists makes retrying after
// a failed/incomplete deletion attempt safe.
export async function ensureDeletionLock(firestore: Firestore, uid: string): Promise<void> {
  const ref = deletionLockRef(firestore, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { startedAt: new Date().toISOString() });
  }
}

// Exposed for a possible future "abandon deletion, keep my account"
// recovery action — deliberately NEVER called by the normal deleteAccount()
// flow, on either its error or success paths. Clearing it on error would
// let other devices recreate data that might already be partially deleted
// (the one thing requirement 5 explicitly forbids); clearing it on success
// is simply unnecessary, since once the Firebase Auth user is gone no
// request can ever satisfy request.auth.uid == userId for this uid again,
// lock or no lock — it becomes permanently inert.
export async function releaseDeletionLock(firestore: Firestore, uid: string): Promise<void> {
  await deleteDoc(deletionLockRef(firestore, uid));
}

// Deletes every document under users/{uid}/... for the 5 syncable
// collections plus the meta/profile singleton. The collection set is fixed
// and enumerable (no arbitrary nesting), and firestore.rules already
// restricts all access under users/{uid}/** to request.auth.uid == uid, so
// this client-side call can only ever delete the CALLER's own subtree —
// never another user's — without needing a trusted backend or admin
// credentials. Idempotent: safe to call again after a partial failure,
// since deleting an already-gone document is a no-op (collections that no
// longer have any docs just return empty on the next getDocs).
export async function deleteCloudAccountData(firestore: Firestore, uid: string): Promise<void> {
  for (const config of ALL_ENTITY_SYNC_CONFIGS) {
    const snap = await getDocs(collection(firestore, `users/${uid}/${config.collection}`));
    const refs = snap.docs.map(d => d.ref);
    for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
      const batch = writeBatch(firestore);
      for (const ref of refs.slice(i, i + BATCH_LIMIT)) batch.delete(ref);
      await batch.commit();
    }
  }
  // Singleton doc, not part of ALL_ENTITY_SYNC_CONFIGS — deleteDoc on a
  // missing doc is also a no-op, so this stays idempotent too.
  await deleteDoc(doc(firestore, `users/${uid}/meta/profile`));
}
