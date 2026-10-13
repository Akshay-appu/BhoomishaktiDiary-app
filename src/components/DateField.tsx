import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { shared } from '../styles/shared';
import { todayDateString } from '../utils/format';

// Plain YYYY-MM-DD text entry instead of a native date-picker dependency —
// zero new packages, identical behavior on web/Android/iOS, and the format
// is validated before save (see isValidDateString in utils/format).
export function DateField({
  label, value, onChangeText, error, required, todayLabel,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  error?: string;
  required?: boolean;
  todayLabel: string;
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={shared.fieldLabel}>{label}{required ? ' *' : ''}</Text>
        <TouchableOpacity onPress={() => onChangeText(todayDateString())} hitSlop={6}>
          <Text style={shared.link}>{todayLabel}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="YYYY-MM-DD"
        style={[shared.input, !!error && shared.inputError]}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      {!!error && <Text style={shared.fieldError}>{error}</Text>}
    </View>
  );
}
