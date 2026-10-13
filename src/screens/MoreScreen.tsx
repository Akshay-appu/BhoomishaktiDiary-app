import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BackupCounts, BackupData } from '../db/backupRepo';
import { useAuth } from '../hooks/useAuth';
import { useSync } from '../hooks/useSync';
import { Copy, Language, languages } from '../i18n/copy';
import { shared } from '../styles/shared';
import { AccountSection } from './AccountSection';
import { BackupSection } from './BackupSection';

export function MoreScreen({
  t, lg, language, onLanguageChange, auth, sync, onSignIn, onSignOutConfirm, backup, onError, onConfirmRestore,
}: {
  t: Copy;
  lg: boolean;
  language: Language;
  onLanguageChange: (next: Language) => void;
  auth: ReturnType<typeof useAuth>;
  sync: ReturnType<typeof useSync>;
  onSignIn: () => void;
  onSignOutConfirm: () => void;
  backup: {
    exportBackup: () => Promise<string>;
    previewRestore: (text: string) => { data: BackupData; counts: BackupCounts };
  };
  onError: (message: string) => void;
  onConfirmRestore: (data: BackupData) => void;
}) {
  return (
    <>
      <Text style={[shared.pageTitle, lg && shared.pageTitleLg]}>{t.more}</Text>
      <Text style={[shared.pageSubtitle, lg && shared.pageSubtitleLg]}>{t.settingsSubtitle}</Text>

      <AccountSection t={t} language={language} auth={auth} sync={sync} onSignIn={onSignIn} onSignOutConfirm={onSignOutConfirm} />

      <Text style={shared.fieldLabel}>{t.language}</Text>
      {(['en', 'kn', 'hi'] as Language[]).map(lang => (
        <TouchableOpacity
          key={lang}
          style={[shared.selectRow, language === lang && shared.selectRowSelected]}
          onPress={() => onLanguageChange(lang)}
        >
          <Text style={shared.selectRowText}>{languages[lang]}</Text>
          <Text style={shared.selectRowCheck}>{language === lang ? '✓' : ''}</Text>
        </TouchableOpacity>
      ))}
      <View style={shared.tipCard}>
        <Text style={shared.tipTitle}>{t.privacyTitle}</Text>
        <Text style={shared.tipText}>{t.privacyText}</Text>
      </View>
      <BackupSection t={t} backup={backup} onError={onError} onConfirmRestore={onConfirmRestore} />
    </>
  );
}
