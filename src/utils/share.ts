import { Platform, Share } from 'react-native';

// Zero new dependencies: web uses the Blob/anchor download + Clipboard DOM
// APIs directly; native uses React Native's own Share module (core RN, not
// an Expo package) to open the OS share sheet.

export function downloadTextFile(filename: string, contents: string): void {
  const doc = (globalThis as { document?: Document }).document;
  if (!doc) return;
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = doc.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  doc.body.appendChild(anchor);
  anchor.click();
  doc.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  const nav = (globalThis as { navigator?: Navigator }).navigator;
  if (!nav?.clipboard) return false;
  await nav.clipboard.writeText(text);
  return true;
}

export async function shareBackupText(filename: string, text: string): Promise<void> {
  if (Platform.OS === 'web') {
    downloadTextFile(filename, text);
    return;
  }
  await Share.share({ message: text });
}
