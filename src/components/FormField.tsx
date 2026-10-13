import React from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import { shared } from '../styles/shared';

export function FormField({
  label, value, onChangeText, placeholder, multiline, keyboardType, maxLength, error, required,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: string;
  required?: boolean;
}) {
  return (
    <View>
      <Text style={shared.fieldLabel}>{label}{required ? ' *' : ''}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[shared.input, multiline && shared.notesInput, !!error && shared.inputError]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {!!error && <Text style={shared.fieldError}>{error}</Text>}
    </View>
  );
}
