import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { AlertState } from '../hooks/useCrossPlatformAlert';
import { shared } from '../styles/shared';

export function AlertModal({ alert, onClose }: { alert: AlertState | null; onClose: () => void }) {
  return (
    <Modal visible={!!alert} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[shared.modalBackdrop, shared.modalBackdropCentered]}>
        <View style={[shared.modalSheet, shared.modalSheetCentered, shared.alertSheet]}>
          <Text style={shared.modalTitle}>{alert?.title}</Text>
          <Text style={shared.alertMessage}>{alert?.message}</Text>
          <View style={shared.alertActions}>
            {alert?.buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[shared.alertButton, button.style === 'cancel' && shared.alertButtonCancel]}
                onPress={() => { onClose(); button.onPress?.(); }}
              >
                <Text style={[
                  shared.alertButtonText,
                  button.style === 'cancel' && shared.alertButtonTextCancel,
                  button.style === 'destructive' && shared.alertButtonTextDestructive,
                ]}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
