import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DangerButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { deleteAccountFailureIsPartial, useAccountDeletion } from '../hooks/useAccountDeletion';
import { Copy } from '../i18n/copy';
import { shared } from '../styles/shared';
import { shareBackupText } from '../utils/share';

const BUSY_STATUSES = new Set([
  'awaiting-sync', 'reauthenticating', 'locking-account', 'deleting-cloud', 'purging-local', 'deleting-auth',
]);

const STEP_LABEL_KEYS: Record<string, keyof Copy> = {
  'awaiting-sync': 'deleteAccountStepWaitingSync',
  reauthenticating: 'deleteAccountStepReauth',
  'locking-account': 'deleteAccountStepLock',
  'deleting-cloud': 'deleteAccountStepCloud',
  'purging-local': 'deleteAccountStepLocal',
  'deleting-auth': 'deleteAccountStepAuth',
};

export function DeleteAccountModal({
  visible, isMobile, t, isPasswordAccount, deletion, backup, onClose,
}: {
  visible: boolean;
  isMobile: boolean;
  t: Copy;
  isPasswordAccount: boolean;
  deletion: ReturnType<typeof useAccountDeletion>;
  backup: { exportBackup: () => Promise<string> };
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState('');

  const busy = BUSY_STATUSES.has(deletion.status);
  const isError = deletion.status.startsWith('error');

  const close = () => {
    setPassword('');
    setExported(false);
    setExportError('');
    deletion.reset();
    onClose();
  };

  const handleExport = async () => {
    setExportError('');
    try {
      const json = await backup.exportBackup();
      const filename = `bhoomishakti-backup-${new Date().toISOString().slice(0, 10)}.json`;
      await shareBackupText(filename, json);
      setExported(true);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <FormModal visible={visible} title={t.deleteAccount} isMobile={isMobile} onClose={busy ? () => {} : close}>
      {deletion.status === 'success' ? (
        <>
          <Text style={shared.tipText}>{t.deleteAccountSuccess}</Text>
          <PrimaryButton label={t.deleteAccountDone} onPress={close} />
        </>
      ) : busy ? (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <ActivityIndicator size="large" />
          <Text style={[shared.tipText, { marginTop: 14, textAlign: 'center' }]}>
            {t[STEP_LABEL_KEYS[deletion.status] ?? 'deleteAccountStepReauth']}
          </Text>
        </View>
      ) : (
        <>
          <Text style={shared.tipText}>{t.deleteAccountIntro}</Text>
          <Text style={[shared.tipText, { marginTop: 10 }]}>{t.deleteAccountWarning}</Text>

          <SecondaryButton label={t.deleteAccountExportButton} onPress={handleExport} />
          {exported && <Text style={shared.statNote}>{t.deleteAccountExported}</Text>}
          {!!exportError && <Text style={shared.fieldError}>{exportError}</Text>}

          {isError && (
            <>
              <Text style={[shared.fieldError, { marginTop: 14 }]}>{t[deletion.errorKey ?? 'authErrorGeneric']}</Text>
              {deleteAccountFailureIsPartial(deletion.status) && (
                <Text style={[shared.statNote, { marginTop: 6 }]}>{t.deleteAccountPartialFailure}</Text>
              )}
            </>
          )}

          {isPasswordAccount && (
            <View style={{ marginTop: 14 }}>
              <Text style={shared.fieldLabel}>{t.deleteAccountPasswordPrompt}</Text>
              <FormField
                label={t.deleteAccountConfirmField}
                value={password}
                onChangeText={setPassword}
                placeholder=""
                required
              />
            </View>
          )}

          <DangerButton
            label={t.deleteAccountConfirmButton}
            onPress={() => { void deletion.deleteAccount(isPasswordAccount ? password : undefined); }}
          />
          <SecondaryButton label={t.deleteAccountCancel} onPress={close} />
        </>
      )}
    </FormModal>
  );
}
