import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { shared } from '../styles/shared';

export function SectionTitle({
  title, action, onPress, lg,
}: { title: string; action?: string; onPress?: () => void; lg?: boolean }) {
  return (
    <View style={shared.sectionHeader}>
      <Text style={[shared.sectionTitle, lg && shared.sectionTitleLg]}>{title}</Text>
      {!!action && !!onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={[shared.link, lg && shared.linkLg]}>{action} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
