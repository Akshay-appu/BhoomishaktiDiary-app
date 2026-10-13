import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { shared } from '../styles/shared';

export function SegmentedTabs<T extends string>({
  options, value, onChange,
}: { options: { key: T; label: string }[]; value: T; onChange: (next: T) => void }) {
  return (
    <View style={shared.segmentRow}>
      {options.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[shared.segmentItem, value === option.key && shared.segmentItemActive]}
          onPress={() => onChange(option.key)}
        >
          <Text style={[shared.segmentText, value === option.key && shared.segmentTextActive]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
