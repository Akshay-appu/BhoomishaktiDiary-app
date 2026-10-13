import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shared } from '../styles/shared';

export function PrimaryButton({ label, onPress, lg }: { label: string; onPress: () => void; lg?: boolean }) {
  return (
    <TouchableOpacity style={[shared.primaryButton, lg && shared.primaryButtonLg]} onPress={onPress}>
      <Text style={[shared.primaryButtonText, lg && shared.primaryButtonTextLg]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={shared.secondaryButton} onPress={onPress}>
      <Text style={shared.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function DangerButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={shared.dangerButton} onPress={onPress}>
      <Text style={shared.dangerButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}
