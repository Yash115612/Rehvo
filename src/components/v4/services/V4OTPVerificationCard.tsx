import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { KeyRound, CheckCircle2, ShieldCheck, Copy } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHapticFeedback } from '../../../utils/haptics';

interface V4OTPVerificationCardProps {
  bookingId: string;
  startOtp?: string;
  endOtp?: string;
  currentStatus: string;
  onVerifyOtp?: (otp: string, type: 'start' | 'end') => Promise<boolean>;
}

export const V4OTPVerificationCard: React.FC<V4OTPVerificationCardProps> = ({
  bookingId,
  startOtp = '4821',
  endOtp = '7193',
  currentStatus,
  onVerifyOtp,
}) => {
  const isStarted = currentStatus === 'in_progress' || currentStatus === 'completed';
  const isCompleted = currentStatus === 'completed';

  const [inputOtp, setInputOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (type: 'start' | 'end') => {
    if (!inputOtp || inputOtp.length < 4) return;
    setIsVerifying(true);
    triggerHapticFeedback('impactMedium');
    if (onVerifyOtp) {
      await onVerifyOtp(inputOtp, type);
    }
    setIsVerifying(false);
    setInputOtp('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <KeyRound size={20} color="#0F766E" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Secure OTP Verification</Text>
          <Text style={styles.subtitle}>
            Share with technician to authenticate service milestones
          </Text>
        </View>
      </View>

      <View style={styles.otpGrid}>
        {/* START OTP */}
        <View style={[styles.otpBox, isStarted && styles.otpBoxDone]}>
          <View style={styles.otpBoxHeader}>
            <Text style={styles.otpTypeLabel}>STEP 1: START OTP</Text>
            {isStarted && <CheckCircle2 size={14} color="#15803D" />}
          </View>
          <Text style={styles.otpValue}>{startOtp}</Text>
          <Text style={styles.otpHelp}>
            {isStarted ? 'Service commenced' : 'Share when technician arrives'}
          </Text>
        </View>

        {/* END OTP */}
        <View style={[styles.otpBox, isCompleted && styles.otpBoxDone]}>
          <View style={styles.otpBoxHeader}>
            <Text style={styles.otpTypeLabel}>STEP 2: COMPLETION OTP</Text>
            {isCompleted && <CheckCircle2 size={14} color="#15803D" />}
          </View>
          <Text style={styles.otpValue}>{endOtp}</Text>
          <Text style={styles.otpHelp}>
            {isCompleted ? 'Job closed & verified' : 'Share after post-service inspection'}
          </Text>
        </View>
      </View>

      <View style={styles.guaranteeRow}>
        <ShieldCheck size={16} color="#0F766E" />
        <Text style={styles.guaranteeText}>
          Never share completion OTP before inspecting the completed work.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  otpGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  otpBox: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
    alignItems: 'center',
  },
  otpBoxDone: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  otpBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  otpTypeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  otpValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 4,
    marginVertical: 4,
  },
  otpHelp: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
    lineHeight: 14,
  },
});
