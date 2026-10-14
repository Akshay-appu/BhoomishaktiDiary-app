import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { DangerButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { Copy, Language } from '../i18n/copy';
import { formatLongDate } from '../utils/format';
import { shared } from '../styles/shared';

export function AccountSection({
  t, language, auth, sync, onSignIn, onSignOutConfirm, onDeleteAccount,
}: {
  t: Copy;
  language: Language;
  auth: ReturnType<typeof useAuth>;
  sync: ReturnType<typeof useSync>;
  onSignIn: () => void;
  onSignOutConfirm: () => void;
  onDeleteAccount: () => void;
}) {
  return (
    <View style={shared.tipCard}>
      <Text style={shared.tipTitle}>{t.account}</Text>
      {!auth.isFirebaseConfigured ? (
        <Text style={[shared.tipText, { marginTop: 10 }]}>{t.cloudSyncNotConfigured}</Text>
      ) : auth.loading ? (
        <ActivityIndicator style={{ marginTop: 10 }} />
      ) : auth.user ? (
        <>
          <Text style={[shared.tipText, { marginTop: 10 }]}>{t.signedInAs} {auth.user.email}</Text>
          <Text style={[shared.tipText, { marginTop: 10 }]}>{t.syncDescription}</Text>

          <View style={{ marginTop: 12 }}>
            {sync.status === 'syncing' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" />
                <Text style={shared.statNote}>{t.syncing}</Text>
              </View>
            ) : sync.status === 'error' ? (
              <Text style={[shared.fieldError, { marginTop: 0 }]}>{t.syncError}</Text>
            ) : (
              <Text style={shared.statNote}>{t.syncSuccess}</Text>
            )}
            <Text style={shared.statNote}>
              {sync.lastSyncedAt ? `${t.lastSynced}: ${formatLongDate(sync.lastSyncedAt, language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN')}` : t.neverSynced}
            </Text>
          </View>
          <SecondaryButton label={t.syncNow} onPress={() => sync.syncNow()} />
          <DangerButton label={t.signOut} onPress={onSignOutConfirm} />
          <TouchableOpacity onPress={onDeleteAccount} style={{ marginTop: 10, alignItems: 'center' }}>
            <Text style={shared.link}>{t.deleteAccount}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[shared.tipText, { marginTop: 10 }]}>{t.accountIntro}</Text>
          <PrimaryButton label={t.signIn} onPress={onSignIn} />
        </>
      )}
    </View>
  );
}
