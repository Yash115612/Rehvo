import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { AlertCircle, ArrowLeft, CheckCircle2, Edit2 } from 'lucide-react-native';

interface OtpInputProps {
  phoneNumber?: string;
  onComplete: (otp: string) => void;
  onResend: () => void;
  onChangeNumber?: () => void;
  onBack?: () => void;
  error?: string | null;
  isLoading?: boolean;
  isSuccess?: boolean;
  style?: any;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  phoneNumber = '+91 98765 43210',
  onComplete,
  onResend,
  onChangeNumber,
  onBack,
  error,
  isLoading = false,
  isSuccess = false,
  style,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    // Focus first input on mount
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.slice(0, 6).split('');
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);

      if (pastedDigits.length === 6) {
        onComplete(pastedDigits.join(''));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    }
  };

  const handleResendClick = () => {
    if (!canResend || isLoading) return;
    setOtp(Array(6).fill(''));
    setResendTimer(30);
    setCanResend(false);
    onResend();
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <View style={[styles.container, style]}>
      {/* Top Bar with Back Button */}
      {onBack && (
        <Pressable
          onPress={onBack}
          hitSlop={10}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#171522" strokeWidth={2} />
        </Pressable>
      )}

      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{' '}
          <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
        </Text>
        {onChangeNumber && (
          <Pressable
            onPress={onChangeNumber}
            style={styles.changeBtn}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Change phone number"
          >
            <Edit2 size={12} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.changeBtnText}>Change number</Text>
          </Pressable>
        )}
      </View>

      {/* 6 OTP Input Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, index) => {
          const isFocused = focusedIndex === index;
          return (
            <RNTextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              editable={!isLoading && !isSuccess}
              selectTextOnFocus
              accessibilityLabel={`Digit ${index + 1} of 6`}
              style={[
                styles.otpBox,
                digit ? styles.otpFilled : styles.otpEmpty,
                isFocused && styles.otpFocused,
                Boolean(error) && styles.otpError,
                isSuccess && styles.otpSuccess,
              ]}
            />
          );
        })}
      </View>

      {/* Inline Error Message */}
      {error && (
        <View style={styles.errorRow}>
          <AlertCircle size={14} color="#E5484D" strokeWidth={2} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Success State Message */}
      {isSuccess && (
        <View style={styles.successRow}>
          <CheckCircle2 size={16} color="#32B768" strokeWidth={2} />
          <Text style={styles.successText}>Code verified successfully</Text>
        </View>
      )}

      {/* Primary Verify Button */}
      <Pressable
        style={({ pressed }) => [
          styles.primaryBtn,
          (!isComplete || isLoading || isSuccess) && styles.primaryBtnDisabled,
          pressed && !isLoading && !isSuccess && styles.primaryBtnPressed,
        ]}
        disabled={!isComplete || isLoading || isSuccess}
        onPress={() => onComplete(otp.join(''))}
        accessibilityRole="button"
        accessibilityLabel="Verify OTP code"
      >
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Verifying...</Text>
          </View>
        ) : (
          <Text style={styles.primaryBtnText}>Verify</Text>
        )}
      </Pressable>

      {/* Resend Countdown */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
        {canResend ? (
          <Pressable
            onPress={handleResendClick}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Resend OTP code"
          >
            <Text style={styles.resendActive}>Resend code</Text>
          </Pressable>
        ) : (
          <Text style={styles.resendTimer}>
            Resend in{' '}
            <Text style={styles.timerBold}>
              00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 22,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    marginBottom: 4,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '400',
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: '#171522',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  otpBox: {
    flex: 1,
    height: 52,
    maxWidth: 50,
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    color: '#171522',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  otpEmpty: {
    borderColor: '#E8E5EC',
  },
  otpFilled: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FFFFFF',
  },
  otpFocused: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  otpError: {
    borderColor: '#E5484D',
    backgroundColor: '#FFF5F5',
  },
  otpSuccess: {
    borderColor: '#32B768',
    backgroundColor: '#F2FBF5',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5484D',
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#32B768',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#6C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryBtnDisabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  resendPrompt: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '400',
  },
  resendActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  resendTimer: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  timerBold: {
    fontWeight: '700',
    color: '#171522',
  },
});
