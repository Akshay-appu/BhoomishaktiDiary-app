import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The `firebase` wrapper package's exports map for "./auth" doesn't forward
// the "react-native" condition (checked in node_modules: only
// node/browser/default), so getReactNativePersistence is unreachable via
// `firebase/auth` even though the underlying @firebase/auth package (same
// version, installed alongside firebase) supports it via its own "."
// export's "react-native" condition. Metro resolves that condition
// correctly for the native bundle; `tsc` resolves this particular package
// under Node's implicit "node" condition instead (that condition is listed
// first in @firebase/auth's exports map and wins under plain Node
// resolution), which is a types-only gap, not a runtime one.
// @ts-expect-error — see comment above: present in the react-native build Metro resolves, absent from the node types tsc resolves here.
import { getReactNativePersistence } from '@firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Cloud features (auth + sync) are entirely optional: the app must keep
// working fully offline with zero Firebase setup. Everything in this module
// is guarded behind this flag instead of throwing at import time.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

const useEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === '1';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  // Firebase Auth needs an explicit RN persistence layer (AsyncStorage) on
  // native, or session restore silently fails; web uses its own default.
  auth = Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

  // React Native's fetch/XHR doesn't support the streaming transport
  // Firestore's web SDK defaults to, so native needs long-polling.
  db = Platform.OS === 'web'
    ? getFirestore(app)
    : initializeFirestore(app, { experimentalForceLongPolling: true });

  if (useEmulator) {
    // 10.0.2.2 is the Android emulator's alias for the host machine's
    // localhost; iOS simulator and web can both reach localhost directly.
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
  }
}

export { app, auth, db };
