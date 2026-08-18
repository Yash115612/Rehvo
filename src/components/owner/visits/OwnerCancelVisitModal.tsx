import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { Visit } from '../../../types';

interface OwnerCancelVisitModalProps {
  visit: Visit | null;
  visible: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}

const CANCEL_REASONS = [
  'Schedule conflict / unavailable',
  'Property already rented out',
  'Renter requested cancellation',
  'Other reason',
];

export const OwnerCancelVisitModal: React.FC<OwnerCancelVisitModalProps> = ({
  visit,
  visible,
  onClose,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  if (!visit) return null;

  const handleSubmit = () => {
    onConfirmCancel(selectedReason);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <AlertTriangle size={18} color="#E5484D" strokeWidth={2.2} />
              <Text style={styles.title}>Cancel Visit</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={18} color="#777482" />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Are you sure you want to cancel the scheduled visit with {visit.renter_name} on {visit.date} at {visit.time}?
          </Text>

          <Text style={styles.label}>Select Reason</Text>
          <View style={styles.reasonList}>
            {CANCEL_REASONS.map((r) => {
              const isSelected = selectedReason === r;
              return (
                <Pressable
                  key={r}
                  style={[
                    styles.reasonChip,
                    isSelected && styles.reasonChipSelected,
                  ]}
                  onPress={() => setSelectedReason(r)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      isSelected && styles.reasonTextSelected,
                    ]}
                  >
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.btnRow}>
            <Pressable style={styles.keepBtn} onPress={onClose}>
              <Text style={styles.keepBtnText}>Keep Visit</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={handleSubmit}>
              <Text style={styles.cancelBtnText}>Cancel Visit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  reasonList: {
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  reasonChipSelected: {
    backgroundColor: '#FEEFEF',
    borderColor: '#E5484D',
  },
  reasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  reasonTextSelected: {
    color: '#E5484D',
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  keepBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E5484D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
