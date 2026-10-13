import React, { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { DangerButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import { BackupCounts, BackupData } from '../db/backupRepo';
import { Copy } from '../i18n/copy';
import { shared } from '../styles/shared';
import { shareBackupText, copyToClipboard } from '../utils/share';

export function BackupSection({
  t, backup, onError, onConfirmRestore,
}: {
  t: Copy;
  backup: {
    exportBackup: () => Promise<string>;
    previewRestore: (text: string) => { data: BackupData; counts: BackupCounts };
  };
  onError: (message: string) => void;
  onConfirmRestore: (data: BackupData) => void;
}) {
  const [pasted, setPasted] = useState('');
  const [preview, setPreview] = useState<{ data: BackupData; counts: BackupCounts } | null>(null);
  const [copyStatus, setCopyStatus] = useState('');

  const handleExport = async () => {
    try {
      const json = await backup.exportBackup();
      const filename = `bhoomishakti-backup-${new Date().toISOString().slice(0, 10)}.json`;
      await shareBackupText(filename, json);
      if (Platform.OS === 'web') {
        const copied = await copyToClipboard(json);
        setCopyStatus(copied ? t.copied : '');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  const handlePreview = () => {
    try {
      setPreview(backup.previewRestore(pasted));
    } catch {
      onError(t.invalidBackupFile);
      setPreview(null);
    }
  };

  return (
    <View style={shared.tipCard}>
      <Text style={shared.tipTitle}>{t.backupRestore}</Text>

      <Text style={[shared.tipText, { marginTop: 10 }]}>{t.exportDescription}</Text>
      <PrimaryButton label={t.shareBackup} onPress={handleExport} />
      {!!copyStatus && <Text style={shared.statNote}>{copyStatus}</Text>}

      <Text style={[shared.tipText, { marginTop: 18 }]}>{t.restoreDescription}</Text>
      <TextInput
        value={pasted}
        onChangeText={text => { setPasted(text); setPreview(null); }}
        placeholder={t.pasteBackupPlaceholder}
        style={[shared.input, shared.notesInput, { minHeight: 100 }]}
        multiline
        textAlignVertical="top"
      />
      <SecondaryButton label={t.previewRestore} onPress={handlePreview} />

      {preview && (
        <View style={{ marginTop: 10 }}>
          <Text style={shared.fieldLabel}>{t.recordsFoundInBackup}</Text>
          <Text style={shared.tipText}>
            {t.plotsTab}: {preview.counts.plots} · {t.cropsTab}: {preview.counts.crops} · {t.activities}: {preview.counts.diaryEntries} · {t.expenses}/{t.income}: {preview.counts.financeEntries} · {t.harvestsTab}: {preview.counts.harvests}
          </Text>
          <DangerButton label={t.confirmRestore} onPress={() => onConfirmRestore(preview.data)} />
        </View>
      )}
    </View>
  );
}
