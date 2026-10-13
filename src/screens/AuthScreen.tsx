import React, { useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { authErrorKey, useAuth } from '../hooks/useAuth';
import { Copy } from '../i18n/copy';
import { shared } from '../styles/shared';

type Mode = 'signIn' | 'signUp';

export function AuthScreen({
  visible, isMobile, t, auth, onClose,
}: {
  visible: boolean;
  isMobile: boolean;
  t: Copy;
  auth: ReturnType<typeof useAuth>;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const resetLocalState = () => {
    setEmail(''); setPassword(''); setError(''); setInfo(''); setBusy(false);
  };

  const close = () => { resetLocalState(); onClose(); };

  const submit = async () => {
    setError(''); setInfo('');
    if (!email.trim() || !password) {
      setError(t.authErrorInvalidEmail);
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signUp') {
        await auth.signUp(email.trim(), password);
      } else {
        await auth.signIn(email.trim(), password);
      }
      close();
    } catch (err) {
      setError(t[authErrorKey(err)]);
    } finally {
      setBusy(false);
    }
  };

  const forgotPassword = async () => {
    setError(''); setInfo('');
    if (!email.trim()) {
      setError(t.authErrorInvalidEmail);
      return;
    }
    setBusy(true);
    try {
      await auth.resetPassword(email.trim());
      setInfo(t.resetPasswordSent);
    } catch (err) {
      setError(t[authErrorKey(err)]);
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setError(''); setInfo('');
    if (Platform.OS !== 'web') {
      // Native Google sign-in needs expo-auth-session's browser redirect,
      // which Expo Go cannot register a custom scheme for — only a
      // development build can complete this flow. Documented, not simulated.
      setError(t.authErrorGoogleNeedsDevBuild);
      return;
    }
    setBusy(true);
    try {
      await auth.signInWithGoogleWeb();
      close();
    } catch (err) {
      setError(t[authErrorKey(err)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormModal visible={visible} title={mode === 'signUp' ? t.createAccount : t.signIn} isMobile={isMobile} onClose={close}>
      <FormField label={t.emailField} value={email} onChangeText={setEmail} placeholder={t.emailPlaceholder} keyboardType="email-address" required />
      <FormField label={t.passwordField} value={password} onChangeText={setPassword} placeholder={t.passwordPlaceholder} required />
      {!!error && <Text style={shared.fieldError}>{error}</Text>}
      {!!info && <Text style={shared.statNote}>{info}</Text>}

      {busy ? <ActivityIndicator style={{ marginTop: 14 }} /> : (
        <PrimaryButton label={mode === 'signUp' ? t.createAccount : t.signIn} onPress={submit} />
      )}

      {mode === 'signIn' && (
        <TouchableOpacity onPress={forgotPassword} disabled={busy} style={{ marginTop: 10 }}>
          <Text style={shared.link}>{t.forgotPassword}</Text>
        </TouchableOpacity>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#E6ECE7' }} />
        <Text style={shared.statLabel}>{t.orDivider}</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#E6ECE7' }} />
      </View>

      <SecondaryButton label={t.continueWithGoogle} onPress={googleSignIn} />

      <TouchableOpacity onPress={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setError(''); setInfo(''); }} style={{ marginTop: 16 }}>
        <Text style={[shared.link, { textAlign: 'center' }]}>{mode === 'signIn' ? t.switchToSignUp : t.switchToSignIn}</Text>
      </TouchableOpacity>
    </FormModal>
  );
}
