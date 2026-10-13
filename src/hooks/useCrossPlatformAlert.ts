import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export type AlertButton = { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
export type AlertState = { title: string; message: string; buttons: AlertButton[] };

// RN Web's Alert.alert() is a no-op (see react-native-web/dist/exports/Alert),
// so on web we render our own dialog instead; native platforms keep the real Alert.
export function useCrossPlatformAlert() {
  const [webAlert, setWebAlert] = useState<AlertState | null>(null);
  const showAlert = useCallback((title: string, message: string, buttons?: AlertButton[]) => {
    if (Platform.OS === 'web') {
      setWebAlert({ title, message, buttons: buttons && buttons.length ? buttons : [{ text: 'OK' }] });
    } else {
      Alert.alert(title, message, buttons);
    }
  }, []);
  return { webAlert, setWebAlert, showAlert };
}
