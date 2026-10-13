import React from 'react';
import { Text, View } from 'react-native';
import { shared } from '../styles/shared';

export function EmptyState({ title, detail, lg }: { title: string; detail: string; lg?: boolean }) {
  return (
    <View style={shared.empty}>
      <Text style={shared.emptyIcon}>🌱</Text>
      <Text style={[shared.emptyTitle, lg && shared.emptyTitleLg]}>{title}</Text>
      <Text style={[shared.emptyText, lg && shared.emptyTextLg]}>{detail}</Text>
    </View>
  );
}
