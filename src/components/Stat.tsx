import React from 'react';
import { Text, View } from 'react-native';
import { shared } from '../styles/shared';

export function Stat({ value, label, note, lg }: { value: string; label: string; note?: string; lg?: boolean }) {
  return (
    <View style={[shared.stat, lg && shared.statLg]}>
      <Text style={[shared.statValue, lg && shared.statValueLg]}>{value}</Text>
      <Text style={[shared.statLabel, lg && shared.statLabelLg]}>{label}</Text>
      {!!note && <Text style={shared.statNote}>{note}</Text>}
    </View>
  );
}
