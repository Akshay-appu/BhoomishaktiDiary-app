// Genuine, local emulator-based tests for firestore.rules — not an assertion
// that the rules "look right," an actual pass/fail run. Needs the Firestore
// emulator running on localhost:8080 for project demo-bhoomishakti (see
// `npx firebase emulators:start --only auth,firestore --project demo-bhoomishakti`).
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-bhoomishakti';

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

const testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: 'localhost',
    port: 8080,
  },
});

const alice = testEnv.authenticatedContext('alice-uid');
const bob = testEnv.authenticatedContext('bob-uid');
const anon = testEnv.unauthenticatedContext();

await check('alice can write her own plot', async () => {
  await assertSucceeds(setDoc(doc(alice.firestore(), 'users/alice-uid/plots/plot1'), { name: 'North field' }));
});

await check('alice can read her own plot back', async () => {
  const snap = await getDoc(doc(alice.firestore(), 'users/alice-uid/plots/plot1'));
  if (!snap.exists() || snap.data().name !== 'North field') throw new Error('expected to read back what was written');
});

await check('bob CANNOT read alice\'s plot', async () => {
  await assertFails(getDoc(doc(bob.firestore(), 'users/alice-uid/plots/plot1')));
});

await check('bob CANNOT write into alice\'s plots', async () => {
  await assertFails(setDoc(doc(bob.firestore(), 'users/alice-uid/plots/plot2'), { name: 'intrusion' }));
});

await check('bob CANNOT delete alice\'s plot', async () => {
  await assertFails(deleteDoc(doc(bob.firestore(), 'users/alice-uid/plots/plot1')));
});

await check('an unauthenticated request CANNOT read alice\'s plot', async () => {
  await assertFails(getDoc(doc(anon.firestore(), 'users/alice-uid/plots/plot1')));
});

await check('an unauthenticated request CANNOT write anywhere under users/', async () => {
  await assertFails(setDoc(doc(anon.firestore(), 'users/alice-uid/plots/plot3'), { name: 'anon' }));
});

await check('bob can write his own data', async () => {
  await assertSucceeds(setDoc(doc(bob.firestore(), 'users/bob-uid/plots/plotA'), { name: "Bob's field" }));
});

await check('alice CANNOT read bob\'s data either (symmetry check)', async () => {
  await assertFails(getDoc(doc(alice.firestore(), 'users/bob-uid/plots/plotA')));
});

await testEnv.cleanup();

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
