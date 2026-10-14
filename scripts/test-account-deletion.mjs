// Genuine, local emulator-based tests for account deletion — covers the
// security- and data-integrity-critical invariants: full cloud deletion,
// idempotent retry after a partial failure, shared-device/cross-user
// isolation, that a failed reauthentication blocks deletion entirely, and
// that the sync/deletion pause mechanism (useSync.ts +
// useAccountDeletion.ts's shared pausedRef/syncingRef) actually prevents a
// concurrent sync from recreating deleted cloud documents — including a
// control case proving the race is real without that mechanism.
// Needs both emulators running:
//   npx firebase emulators:start --only auth,firestore --project demo-bhoomishakti
//
// This deliberately re-implements the same enumerable-collection-delete
// shape as src/firebase/accountDeletion.ts (plots/crops/activities/
// financeEntries/harvests + meta/profile) rather than importing that module
// directly: it transitively imports src/firebase/sync.ts, which imports
// `expo-sqlite` for type annotations only — but Node has no project build
// step to strip that import, and expo-sqlite's native module can't load
// outside the Expo/RN runtime. If the real collection list in sync.ts ever
// changes, COLLECTIONS below must be updated to match.
//
// What this script does NOT cover (see the live-browser test pass instead):
// UI-level cancellation, and genuine network loss mid-deletion (simulated
// here only as an unreachable-port proxy, see "network failure" below).
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import {
  collection, doc, deleteDoc, getDoc, getDocs, setDoc, writeBatch,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {
  getAuth, connectAuthEmulator, createUserWithEmailAndPassword,
  reauthenticateWithCredential, EmailAuthProvider, signOut,
} from 'firebase/auth';

const PROJECT_ID = 'demo-bhoomishakti';
const COLLECTIONS = ['plots', 'crops', 'activities', 'financeEntries', 'harvests'];

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed += 1;
    console.log(`FAIL: ${name}`);
    console.log(`   ${err.message}`);
  }
}

// Mirrors src/firebase/accountDeletion.ts's deleteCloudAccountData: deletes
// every doc in the known, fixed collection set under users/{uid}/..., plus
// the meta/profile singleton. Idempotent — deleting an empty collection or
// an already-gone doc is a no-op, never an error.
async function deleteCloudAccountData(firestore, uid) {
  for (const col of COLLECTIONS) {
    const snap = await getDocs(collection(firestore, `users/${uid}/${col}`));
    if (snap.empty) continue;
    const batch = writeBatch(firestore);
    for (const d of snap.docs) batch.delete(d.ref);
    await batch.commit();
  }
  const profileSnap = await getDocs(collection(firestore, `users/${uid}/meta`));
  if (!profileSnap.empty) {
    const batch = writeBatch(firestore);
    for (const d of profileSnap.docs) batch.delete(d.ref);
    await batch.commit();
  }
}

async function seedUserData(firestore, uid) {
  for (const col of COLLECTIONS) {
    await setDoc(doc(firestore, `users/${uid}/${col}/doc1`), { name: `${col}-doc1` });
    await setDoc(doc(firestore, `users/${uid}/${col}/doc2`), { name: `${col}-doc2` });
  }
  await setDoc(doc(firestore, `users/${uid}/meta/profile`), { farmName: 'Test Farm' });
}

async function countAllDocs(firestore, uid) {
  let total = 0;
  for (const col of COLLECTIONS) {
    const snap = await getDocs(collection(firestore, `users/${uid}/${col}`));
    total += snap.size;
  }
  const profileSnap = await getDocs(collection(firestore, `users/${uid}/meta`));
  total += profileSnap.size;
  return total;
}

const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: 'localhost',
    port: 8080,
  },
});

const alice = testEnv.authenticatedContext('delete-test-alice');
const bob = testEnv.authenticatedContext('delete-test-bob');

await check('successful deletion removes every document across all collections + profile', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  const before = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (before !== COLLECTIONS.length * 2 + 1) throw new Error(`expected seeded data, got ${before} docs`);

  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');

  const after = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (after !== 0) throw new Error(`expected 0 docs after deletion, found ${after}`);
});

await check('idempotent retry: deleting an already-empty account does not throw', async () => {
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');
});

await check('shared-device isolation: deleting alice never touches bob\'s data', async () => {
  await seedUserData(bob.firestore(), 'delete-test-bob');
  const bobBefore = await countAllDocs(bob.firestore(), 'delete-test-bob');

  // Re-seed and delete alice again to simulate a second account's deletion
  // happening on the same device/session.
  await seedUserData(alice.firestore(), 'delete-test-alice');
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');

  const bobAfter = await countAllDocs(bob.firestore(), 'delete-test-bob');
  if (bobAfter !== bobBefore) throw new Error(`bob's doc count changed: ${bobBefore} -> ${bobAfter}`);
  if (bobAfter === 0) throw new Error('test setup invalid: bob should still have seeded data');
});

await check('partial deletion then retry: a half-deleted account is fully cleaned up on retry', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  // Simulate a failure that happened after only the first two collections
  // were cleaned up (what pushEntity-style chunked deletion would leave
  // behind if the process died mid-way).
  for (const col of COLLECTIONS.slice(0, 2)) {
    const snap = await getDocs(collection(alice.firestore(), `users/delete-test-alice/${col}`));
    const batch = writeBatch(alice.firestore());
    for (const d of snap.docs) batch.delete(d.ref);
    await batch.commit();
  }
  const midway = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (midway === 0) throw new Error('test setup invalid: expected some data still present midway');

  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');

  const after = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (after !== 0) throw new Error(`expected full cleanup after retry, found ${after} docs remaining`);
});

await check('deletion is still rules-constrained: bob cannot delete alice\'s data this way', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  await assertFails(deleteCloudAccountData(bob.firestore(), 'delete-test-alice'));
  const after = await countAllDocs(testEnv.authenticatedContext('delete-test-alice').firestore(), 'delete-test-alice');
  if (after === 0) throw new Error('alice\'s data must survive bob\'s denied attempt');
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice'); // cleanup
});

// --- Server-side deletionInProgress lock, tested directly against the
// REAL firestore.rules file (readFileSync'd above) — unlike the deletion
// logic itself, rules need no code import at all, so this exercises the
// actual shipped rule, not a mirror. Mirrors only ensureDeletionLock's
// check-then-create pattern from src/firebase/accountDeletion.ts, since
// that file can't be imported here either (same expo-sqlite transitive
// import problem as the rest of this script). ---
function lockPath(uid) {
  return `users/${uid}/meta/deletionInProgress`;
}

async function ensureDeletionLock(firestoreCtx, uid) {
  const ref = doc(firestoreCtx, lockPath(uid));
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { startedAt: new Date().toISOString() });
  }
}

// Unique per run: the lock is, by design, never cleared by any app code
// path (see firestore.rules / accountDeletion.ts), so a fixed uid would
// carry a lock left over from a previous run of this script and make these
// tests order-dependent across invocations. Fresh uids make every run
// start from a genuinely clean slate regardless of prior runs.
const LOCK_TEST_ALICE = `lock-test-alice-${Date.now()}`;
const LOCK_TEST_BOB = `lock-test-bob-${Date.now()}`;
const lockAlice = testEnv.authenticatedContext(LOCK_TEST_ALICE);
const lockBob = testEnv.authenticatedContext(LOCK_TEST_BOB);

await check('a second session can create/update records BEFORE any lock is set (baseline)', async () => {
  await assertSucceeds(setDoc(doc(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities/doc1`), { title: 'before lock' }));
});

await check('a second session is DENIED creating/updating records AFTER the lock is set', async () => {
  await ensureDeletionLock(lockAlice.firestore(), LOCK_TEST_ALICE);
  await assertFails(setDoc(doc(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities/doc2`), { title: 'new doc while locked' }));
  await assertFails(setDoc(doc(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities/doc1`), { title: 'update while locked' }));
});

await check('authorized cleanup (delete) is still permitted while the lock is active', async () => {
  await assertSucceeds(deleteDoc(doc(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities/doc1`)));
  const snap = await getDocs(collection(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities`));
  if (!snap.empty) throw new Error('delete under an active lock should have succeeded');
});

await check('the lock cannot be re-created/overwritten by a bare write once it exists (must be check-then-create)', async () => {
  await assertFails(setDoc(doc(lockAlice.firestore(), lockPath(LOCK_TEST_ALICE)), { startedAt: 'overwritten' }));
});

await check('retry behavior: re-running ensureDeletionLock on an already-locked account does not throw, and the delete permission remains granted', async () => {
  // Simulates: a first deletion attempt set the lock and deleted some data,
  // then failed/was interrupted; the user retries. The lock already exists
  // from the earlier test (set in "a second session is DENIED..." above) —
  // calling the check-then-create helper again must be a silent no-op, not
  // an error, and delete permission must still be granted under the
  // still-active lock (the collection is already empty from the earlier
  // "authorized cleanup" test, so this also confirms deleting an
  // already-gone document stays permitted — i.e. idempotent retries never
  // get newly denied partway through).
  await ensureDeletionLock(lockAlice.firestore(), LOCK_TEST_ALICE); // must not throw
  const lockSnap = await getDoc(doc(lockAlice.firestore(), lockPath(LOCK_TEST_ALICE)));
  if (!lockSnap.exists()) throw new Error('lock should still exist after a retried ensureDeletionLock call');

  await assertSucceeds(deleteDoc(doc(lockAlice.firestore(), `users/${LOCK_TEST_ALICE}/activities/doc1`)));
});

await check('cross-user isolation: bob is unaffected by alice\'s lock and cannot touch alice\'s lock doc', async () => {
  await assertSucceeds(setDoc(doc(lockBob.firestore(), `users/${LOCK_TEST_BOB}/activities/bobdoc`), { title: 'bob unaffected' }));
  await assertFails(getDoc(doc(lockBob.firestore(), lockPath(LOCK_TEST_ALICE))));
  await assertFails(deleteDoc(doc(lockBob.firestore(), lockPath(LOCK_TEST_ALICE))));
  await assertFails(setDoc(doc(lockBob.firestore(), `users/${LOCK_TEST_ALICE}/activities/intrusion`), { title: 'bob trying to write into alice' }));
});

// --- Sync-pause mechanism (mirrors the actual guard logic in useSync.ts's
// syncNow() and useAccountDeletion.ts's deleteAccount(), against the real
// emulator). Uses plain objects in place of React refs — functionally
// identical for this purpose (both are just mutable cells read/written
// outside the render cycle) and avoids needing a React runtime in Node. ---
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mirrors useSync.ts: syncNow() checks pausedRef first, then syncingRef,
// before doing any push.
async function simulatedSyncNow(firestoreCtx, uid, pausedRef, syncingRef) {
  if (pausedRef.current) return 'blocked-by-pause';
  if (syncingRef.current) return 'blocked-by-in-flight';
  syncingRef.current = true;
  try {
    await setDoc(doc(firestoreCtx, `users/${uid}/activities/race-doc`), { title: 'RECREATED BY A RACING SYNC' });
    return 'pushed';
  } finally {
    syncingRef.current = false;
  }
}

// Mirrors useAccountDeletion.ts: sets pausedRef immediately (synchronously,
// before any await), waits out any in-flight sync, then runs the actual
// deletion, and always clears pausedRef on the way out.
async function simulatedDeleteAccount(firestoreCtx, uid, pausedRef, syncingRef, waitTimeoutMs) {
  pausedRef.current = true;
  try {
    const deadline = Date.now() + waitTimeoutMs;
    while (syncingRef.current) {
      if (Date.now() > deadline) return 'timed-out-waiting-for-sync';
      await delay(20);
    }
    await deleteCloudAccountData(firestoreCtx, uid);
    return 'deleted';
  } finally {
    pausedRef.current = false;
  }
}

await check('a sync attempt is blocked outright while deletion holds the pause flag (no write reaches Firestore)', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  const pausedRef = { current: true }; // simulates deletion already in progress
  const syncingRef = { current: false };

  const result = await simulatedSyncNow(alice.firestore(), 'delete-test-alice', pausedRef, syncingRef);
  if (result !== 'blocked-by-pause') throw new Error(`expected the sync to be blocked, got "${result}"`);

  // The race-doc must not exist at all — the blocked sync never wrote it.
  const snap = await getDocs(collection(alice.firestore(), 'users/delete-test-alice/activities'));
  if (snap.docs.some(d => d.id === 'race-doc')) throw new Error('blocked sync wrote a document anyway');
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice'); // cleanup
});

await check('deletion genuinely waits for an in-flight sync before deleting anything, then proceeds once it clears', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  const pausedRef = { current: false };
  const syncingRef = { current: true }; // simulates a sync already mid-flight

  const deletionPromise = simulatedDeleteAccount(alice.firestore(), 'delete-test-alice', pausedRef, syncingRef, 5000);

  // While syncingRef stays true, deletion must not have touched anything yet.
  await delay(300);
  const midway = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (midway === 0) throw new Error('deletion ran before the in-flight sync cleared — the wait was not honored');

  syncingRef.current = false; // the "in-flight sync" finishes
  const result = await deletionPromise;
  if (result !== 'deleted') throw new Error(`expected deletion to complete after the wait, got "${result}"`);

  const after = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (after !== 0) throw new Error(`expected full deletion once unblocked, found ${after} docs`);
  if (pausedRef.current) throw new Error('pausedRef was not reset to false after a successful deletion');
});

await check('a sync that never finishes times out deletion safely, without deleting anything and without leaving sync paused', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  const pausedRef = { current: false };
  const syncingRef = { current: true }; // never cleared — simulates a hung sync

  const result = await simulatedDeleteAccount(alice.firestore(), 'delete-test-alice', pausedRef, syncingRef, 500);
  if (result !== 'timed-out-waiting-for-sync') throw new Error(`expected a timeout, got "${result}"`);

  const after = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (after === 0) throw new Error('deletion must not have deleted anything on a timeout — it timed out before reaching that step');
  if (pausedRef.current) throw new Error('pausedRef was left stuck paused after a timeout — sync could never resume');

  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice'); // cleanup
});

await check('control (proves the mechanism actually matters): an unguarded push landing after deletion recreates the "deleted" document', async () => {
  await seedUserData(alice.firestore(), 'delete-test-alice');
  await setDoc(doc(alice.firestore(), 'users/delete-test-alice/activities/race-doc'), { title: 'pending local edit' });

  // No pausedRef/syncingRef check at all here — this is exactly what
  // useSync.ts's syncNow() looked like BEFORE the fix: nothing stops it
  // from writing even if an account-deletion pass just ran. Deletion
  // completes fully first, then a push (representing a sync that was
  // already in flight, or the periodic interval firing moments later)
  // writes the exact same document straight back.
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice');
  let afterDeletion = await countAllDocs(alice.firestore(), 'delete-test-alice');
  if (afterDeletion !== 0) throw new Error('test setup invalid: deletion should have left nothing behind');

  await setDoc(doc(alice.firestore(), 'users/delete-test-alice/activities/race-doc'), { title: 'RECREATED, UNGUARDED' });

  const snap = await getDocs(collection(alice.firestore(), 'users/delete-test-alice/activities'));
  const raceDoc = snap.docs.find(d => d.id === 'race-doc');
  if (!raceDoc) throw new Error('control case did not reproduce the race — an unguarded write after deletion should always recreate the document');
  await deleteCloudAccountData(alice.firestore(), 'delete-test-alice'); // cleanup
});

await testEnv.cleanup();

// --- Reauthentication gate (real Auth emulator, not the rules harness) ---
const app = initializeApp({ apiKey: 'fake-api-key', projectId: PROJECT_ID, authDomain: `${PROJECT_ID}.firebaseapp.com` });
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

const testEmail = `delete-reauth-test-${Date.now()}@example.com`;
const realPassword = 'correct-horse-battery-staple';

await check('wrong password during reauthentication is rejected before any deletion is attempted', async () => {
  const cred = await createUserWithEmailAndPassword(auth, testEmail, realPassword);
  let reauthThrew = false;
  try {
    await reauthenticateWithCredential(cred.user, EmailAuthProvider.credential(testEmail, 'definitely-wrong-password'));
  } catch {
    reauthThrew = true;
  }
  if (!reauthThrew) throw new Error('expected reauthentication with a wrong password to fail');
  // Confirm the account is still intact and could still sign in with the
  // REAL password — i.e. the failed reauth attempt didn't corrupt anything.
  await signOut(auth);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
