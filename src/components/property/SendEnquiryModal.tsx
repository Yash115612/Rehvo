import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, MessageSquareText, Send, Sparkles, Building2 } from 'lucide-react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface SendEnquiryModalProps {
  property: Property;
  visible: boolean;
  onClose: () => void;
}

const PRESET_MESSAGES = [
  'Is this property still available?',
  'When is the earliest move-in date?',
  'Are maintenance and utility charges included?',
  'Can I schedule an in-person tour this week?',
];

export const SendEnquiryModal: React.FC<SendEnquiryModalProps> = ({
  property,
  visible,
  onClose,
}) => {
  const { user, submitEnquiry } = useAppStore();
  const [message, setMessage] = useState('Hi, I am interested in this rental listing and would like more details.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = user?.id === property.owner_id;

  const handleSend = async () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitEnquiry(property.id, message.trim());
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconCircle}>
                  <MessageSquareText size={20} color="#6C4DFF" strokeWidth={2.2} />
                </View>
                <View>
                  <Text style={styles.title}>Send Enquiry</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    To {property.owner_name}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <X size={20} color="#171522" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Property Summary Strip */}
            <View style={styles.propStrip}>
              <Building2 size={16} color="#6C4DFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.propTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <Text style={styles.propMeta}>
                  {property.locality}, {property.city} • ₹{property.rent.toLocaleString('en-IN')}/mo
                </Text>
              </View>
            </View>

            {/* Self Enquiry Warning */}
            {isOwner ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  You are listed as the owner of this property. You cannot send an enquiry to yourself.
                </Text>
              </View>
            ) : (
              <>
                {/* Preset Chips */}
                <View style={styles.presetSection}>
                  <Text style={styles.sectionLabel}>Quick message ideas</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetScroll}
                  >
                    {PRESET_MESSAGES.map((msg, idx) => (
                      <Pressable
                        key={idx}
                        style={styles.presetChip}
                        onPress={() => setMessage(msg)}
                      >
                        <Sparkles size={12} color="#6C4DFF" />
                        <Text style={styles.presetChipText}>{msg}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* Message Input */}
                <View style={styles.inputWrap}>
                  <Text style={styles.sectionLabel}>Your Message</Text>
                  <TextInput
                    style={styles.textArea}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write your enquiry message..."
                    placeholderTextColor="#8C8994"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit CTA */}
                <Pressable
                  style={[
                    styles.submitBtn,
                    (!message.trim() || isSubmitting) && styles.submitBtnDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={!message.trim() || isSubmitting}
                  accessibilityRole="button"
                  accessibilityLabel="Submit Enquiry"
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Send size={16} color="#FFFFFF" strokeWidth={2.2} />
                      <Text style={styles.submitBtnText}>Send Enquiry</Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.48)',
    justifyContent: 'flex-end',
  },
  keyboardWrap: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#777482',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F7F4',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  propTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  propMeta: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '500',
  },
  presetSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  presetScroll: {
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F7F5F0',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  inputWrap: {
    gap: 8,
  },
  textArea: {
    height: 100,
    backgroundColor: '#F8F7F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    fontSize: 14,
    color: '#171522',
    lineHeight: 20,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#C5B7FD',
    shadowOpacity: 0,
  },
  submitBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
