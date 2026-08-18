import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Flag, X, CheckCircle2, ArrowRight } from 'lucide-react-native';

export type ReportReason =
  | 'Fake Listing'
  | 'Wrong Information'
  | 'Already Rented'
  | 'Scam / Fraud'
  | 'Inappropriate Content'
  | 'Other';

interface PropertyReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitReport: (reason: ReportReason, details: string) => void;
}

const REPORT_REASONS: ReportReason[] = [
  'Fake Listing',
  'Wrong Information',
  'Already Rented',
  'Scam / Fraud',
  'Inappropriate Content',
  'Other',
];

export const PropertyReportModal: React.FC<PropertyReportModalProps> = ({
  visible,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmitReport(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Flag size={18} color="#E5484D" strokeWidth={2.2} />
              <Text style={styles.title}>Report Listing</Text>
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
            >
              <X size={18} color="#777482" strokeWidth={2} />
            </Pressable>
          </View>

          {submitted ? (
            <View style={styles.successState}>
              <CheckCircle2 size={36} color="#32B768" strokeWidth={2.2} />
              <Text style={styles.successTitle}>Report Submitted</Text>
              <Text style={styles.successSub}>
                Thank you for helping keep REHVO safe. Our moderation team will investigate this listing immediately.
              </Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Select Reason</Text>
              <View style={styles.reasonList}>
                {REPORT_REASONS.map((r) => {
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

              <Text style={styles.label}>Additional Details (Optional)</Text>
              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Describe what went wrong..."
                placeholderTextColor="#8C8994"
                multiline
                style={styles.input}
              />

              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Report</Text>
              </Pressable>
            </View>
          )}
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
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
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
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
  input: {
    height: 70,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 12,
    fontSize: 13.5,
    color: '#171522',
  },
  submitBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E5484D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  successSub: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
});
