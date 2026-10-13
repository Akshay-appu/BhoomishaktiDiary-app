import React, { ReactNode } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { shared } from '../styles/shared';

export function FormModal({
  visible, title, isMobile, onClose, children,
}: {
  visible: boolean;
  title: string;
  isMobile: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[shared.modalBackdrop, !isMobile && shared.modalBackdropCentered]}>
        <View style={[shared.modalSheet, !isMobile && shared.modalSheetCentered, { maxHeight: '90%' }]}>
          <View style={shared.modalHandle} />
          <View style={shared.modalHeader}>
            <Text style={shared.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Text style={shared.closeButton}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
