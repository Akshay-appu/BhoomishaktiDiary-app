import {
  createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithCredential, signInWithPopup, type User,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { auth, isFirebaseConfigured } from '../firebase/config';

// Firebase's own error messages are developer-facing ("Firebase: Error
// (auth/wrong-password).") — map the common ones to farmer-facing copy.
// Anything not listed here falls back to a generic message rather than
// leaking the raw Firebase string.
const ERROR_MESSAGE_KEYS: Record<string, keyof import('../i18n/copy').Copy> = {
  'auth/invalid-email': 'authErrorInvalidEmail',
  'auth/missing-password': 'authErrorInvalidEmail',
  'auth/email-already-in-use': 'authErrorEmailInUse',
  'auth/weak-password': 'authErrorWeakPassword',
  'auth/invalid-credential': 'authErrorWrongCredentials',
  'auth/wrong-password': 'authErrorWrongCredentials',
  'auth/user-not-found': 'authErrorWrongCredentials',
  'auth/too-many-requests': 'authErrorTooManyRequests',
  'auth/network-request-failed': 'authErrorNetwork',
  'auth/popup-closed-by-user': 'authErrorPopupClosed',
};

export function authErrorKey(err: unknown): keyof import('../i18n/copy').Copy {
  const code = err instanceof Error && 'code' in err ? String((err as { code: unknown }).code) : '';
  return ERROR_MESSAGE_KEYS[code] ?? 'authErrorGeneric';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    // loading's initial state already matches !isFirebaseConfigured, so
    // there's nothing to flip synchronously when auth is null here.
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const requireAuth = useCallback(() => {
    if (!auth) throw new Error('auth/not-configured');
    return auth;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(requireAuth(), email, password);
  }, [requireAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(requireAuth(), email, password);
  }, [requireAuth]);

  const signOutUser = useCallback(async () => {
    await signOut(requireAuth());
  }, [requireAuth]);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(requireAuth(), email);
  }, [requireAuth]);

  // Web only: opens a real Google OAuth popup, no extra deps needed.
  const signInWithGoogleWeb = useCallback(async () => {
    if (Platform.OS !== 'web') throw new Error('auth/wrong-platform');
    await signInWithPopup(requireAuth(), new GoogleAuthProvider());
  }, [requireAuth]);

  // Native: exchanges an ID token obtained via expo-auth-session (see
  // AuthScreen) for a Firebase credential. Requires a development build —
  // Expo Go cannot register the OAuth redirect scheme this needs.
  const signInWithGoogleIdToken = useCallback(async (idToken: string) => {
    await signInWithCredential(requireAuth(), GoogleAuthProvider.credential(idToken));
  }, [requireAuth]);

  return {
    user, loading, isFirebaseConfigured,
    signUp, signIn, signOutUser, resetPassword, signInWithGoogleWeb, signInWithGoogleIdToken,
  };
}
