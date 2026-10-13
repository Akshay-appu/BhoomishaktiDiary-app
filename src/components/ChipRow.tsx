import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { shared } from '../styles/shared';

export function ChipRow({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (next: string) => void }) {
  return (
    <View style={shared.chipRow}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[shared.chip, value === option && shared.chipSelected]}
          onPress={() => onChange(option)}
        >
          <Text style={[shared.chipText, value === option && shared.chipTextSelected]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
