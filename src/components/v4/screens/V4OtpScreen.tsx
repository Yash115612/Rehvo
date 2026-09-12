import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, X } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import * as authService from '../../../services/auth';
import { useAppStore } from '../../../store/useAppStore';

export const V4OtpScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone || '';
  const { showToast } = useAppStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (val: string, idx: number) => {
    setErrorMessage(null);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    // Auto-advance
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const isComplete = otp.every((d) => d.length === 1);
  const otpCode = otp.join('');

  const handleVerify = async () => {
    if (!isComplete) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await authService.verifyPhoneOtp(phone, otpCode);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid OTP. Please check the code and try again.');
      } else {
        showToast('Phone verified successfully!', 'success');
        router.replace('/(renter)/home' as any);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setErrorMessage(null);

    try {
      const result = await authService.signInWithPhone(phone);
      if (result.success) {
        setTimer(30);
        showToast(`OTP resent to +91 ${phone}`, 'info');
      } else {
        setErrorMessage(result.error || 'Could not resend OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top, 20) + 10, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Back Button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerBlock}>
          <Text style={styles.title}>Enter 6-Digit OTP</Text>
          <Text style={styles.subtitle}>
            Sent to <Text style={styles.phoneHighlight}>+91 {phone}</Text>
          </Text>
        </View>

        {/* Error Alert Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorMessage(null)} hitSlop={8}>
              <X size={14} color="#DC2626" />
            </Pressable>
          </View>
        )}

        {/* 6 Digit Input Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => {
                inputRefs.current[idx] = ref;
              }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                inputRefs.current[idx]?.isFocused() ? styles.otpBoxActive : null,
              ]}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={idx === 0}
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.resendTimerText}>Resend code in {timer}s</Text>
          ) : (
            <Pressable onPress={handleResendOtp} disabled={resending}>
              <Text style={styles.resendActiveText}>
                {resending ? 'Sending...' : 'Resend OTP'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Verify Button */}
        <V4Button
          label="Verify & Sign In"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!isComplete}
          iconRight={<ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />}
          onPress={handleVerify}
          style={{ marginTop: 10 }}
        />

        {/* Footer Security */}
        <View style={styles.footerShield}>
          <ShieldCheck size={16} color="#059669" />
          <Text style={styles.footerShieldText}>
            Encrypted 256-Bit Verification • Auto-Login Enabled
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 18,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  headerBlock: {
    gap: 6,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13.5,
    color: V4_COLORS.textSecondary,
  },
  phoneHighlight: {
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  otpBox: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  otpBoxFilled: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  otpBoxActive: {
    borderColor: '#059669',
  },
  resendRow: {
    alignItems: 'center',
  },
  resendTimerText: {
    fontSize: 12.5,
    color: V4_COLORS.textMuted,
    fontWeight: '600',
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  footerShield: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  footerShieldText: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
});
