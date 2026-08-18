import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Property } from '../../../types';

interface DeletePropertyConfirmModalProps {
  visible: boolean;
  property: Property | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeletePropertyConfirmModal: React.FC<
  DeletePropertyConfirmModalProps
> = ({ visible, property, isDeleting, onCancel, onConfirm }) => {
  if (!property) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isDeleting ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={isDeleting ? undefined : onCancel}
        />

        <View style={styles.dialogCard}>
          {/* Top Warning / Trash Icon */}
          <View style={styles.iconCircle}>
            <Trash2 size={24} color="#E5484D" strokeWidth={2.2} />
          </View>

          {/* Title and message */}
          <Text style={styles.title}>Delete property?</Text>
          <Text style={styles.message}>
            This property and its associated listing information will be removed.
            This action cannot be undone.
          </Text>

          {/* Property snippet badge */}
          <View style={styles.propertySnippet}>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.propertyLocality} numberOfLines={1}>
              {property.locality}, {property.city} • ₹
              {property.rent.toLocaleString('en-IN')}/mo
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <Pressable
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
              disabled={isDeleting}
              accessibilityRole="button"
              accessibilityLabel="Cancel property deletion"
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.btn,
                styles.deleteBtn,
                isDeleting && styles.btnDisabled,
              ]}
              onPress={onConfirm}
              disabled={isDeleting}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete property"
            >
              {isDeleting ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.deleteBtnText}>Deleting...</Text>
                </View>
              ) : (
                <Text style={styles.deleteBtnText}>Delete Property</Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  propertySnippet: {
    width: '100%',
    backgroundColor: '#F8F7F4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    marginBottom: 20,
  },
  propertyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  propertyLocality: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F0EA',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  deleteBtn: {
    backgroundColor: '#E5484D',
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
