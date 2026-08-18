import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react-native';

interface ListingExitModalProps {
  visible: boolean;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const ListingExitModal: React.FC<ListingExitModalProps> = ({
  visible,
  onSaveDraft,
  onDiscard,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Bookmark size={24} color="#6C4DFF" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Save listing as a draft?</Text>
          <Text style={styles.subtitle}>
            Your progress will be saved so you can easily return and publish your property anytime.
          </Text>

          <View style={styles.buttonGroup}>
            {/* Primary: Save Draft */}
            <Pressable
              style={styles.saveBtn}
              onPress={onSaveDraft}
              accessibilityRole="button"
              accessibilityLabel="Save draft and exit"
            >
              <Text style={styles.saveBtnText}>Save draft</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>

            {/* Secondary: Keep Editing */}
            <Pressable
              style={styles.cancelBtn}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Keep editing"
            >
              <Text style={styles.cancelBtnText}>Keep editing</Text>
            </Pressable>

            {/* Discard */}
            <Pressable
              style={styles.discardBtn}
              onPress={onDiscard}
              accessibilityRole="button"
              accessibilityLabel="Discard listing progress"
            >
              <Trash2 size={14} color="#E5484D" strokeWidth={2} />
              <Text style={styles.discardBtnText}>Discard progress</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
    gap: 8,
  },
  saveBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171522',
  },
  discardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 4,
  },
  discardBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5484D',
  },
});
