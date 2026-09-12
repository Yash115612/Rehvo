import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  AppState,
  AppStateStatus,
  Animated,
  Platform,
} from 'react-native';
import { ShieldCheck, Fingerprint, Delete, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  getUserSecuritySettings,
  verifyPin,
  authenticateBiometrics,
} from '../../../services/securityEngine';
import { UserSecuritySettings } from '../../../types';

interface V4AppLockGateProps {
  children: React.ReactNode;
}

const PIN_LENGTH = 4;

export const V4AppLockGateComponent: React.FC<V4AppLockGateProps> = ({ children }) => {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  const insets = useSafeAreaInsets();
  const { user } = useAppStore();

  const [settings, setSettings] = useState<UserSecuritySettings | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const lastBackgroundTime = useRef<number | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const attemptBiometrics = useCallback(async () => {
    try {
      const res = await authenticateBiometrics('Unlock REHVO to access your properties & wallet');
      if (res.success) {
        setIsLocked(false);
        setPin('');
        setErrorMessage('');
      }
    } catch {
      // Biometric failure silently falls back to PIN
    }
  }, []);

  // Fetch security settings on user or mount
  const refreshSettings = useCallback(async () => {
    try {
      const sec = await getUserSecuritySettings(user?.id);
      setSettings(sec);
      if (sec.app_lock_enabled) {
        setIsLocked(true);
        if (sec.biometric_enabled) {
          attemptBiometrics();
        }
      }
    } catch {
      // Keep state safe
    }
  }, [user?.id, attemptBiometrics]);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // AppState listener for auto-lock timeout
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        lastBackgroundTime.current = Date.now();
      } else if (nextState === 'active') {
        if (lastBackgroundTime.current && settings?.app_lock_enabled) {
          const elapsedSec = (Date.now() - lastBackgroundTime.current) / 1000;
          const lockThreshold = settings.auto_lock_duration ?? 30;
          if (elapsedSec >= lockThreshold) {
            setIsLocked(true);
            setPin('');
            setErrorMessage('');
            if (settings.biometric_enabled) {
              attemptBiometrics();
            }
          }
        }
        lastBackgroundTime.current = null;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [settings, attemptBiometrics]);

  // Keypad press handler
  const handleDigitPress = useCallback(
    async (digit: string) => {
      if (pin.length >= PIN_LENGTH || isVerifying) return;
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage('');

      if (nextPin.length === PIN_LENGTH) {
        setIsVerifying(true);
        if (!settings?.pin_hash) {
          // If no PIN hash set yet, allow unlock
          setIsLocked(false);
          setPin('');
          setIsVerifying(false);
          return;
        }

        const isValid = await verifyPin(nextPin, settings.pin_hash);
        if (isValid) {
          setIsLocked(false);
          setPin('');
          setErrorMessage('');
        } else {
          triggerShake();
          setErrorMessage('Incorrect PIN. Please try again.');
          setPin('');
        }
        setIsVerifying(false);
      }
    },
    [pin, isVerifying, settings, triggerShake]
  );

  const handleDelete = useCallback(() => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
      setErrorMessage('');
    }
  }, [pin]);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      {/* Header / Brand Badge */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={36} color={V4_COLORS.emeraldLight} />
        </View>
        <Text style={styles.brandTitle}>REHVO SECURITY</Text>
        <Text style={styles.subTitle}>
          {settings?.pin_hash
            ? 'Enter your 4-digit PIN to access your account'
            : 'Biometric lock active. Authenticate to proceed'}
        </Text>
      </View>

      {/* PIN Dots Indicator */}
      <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {[0, 1, 2, 3].map((index) => {
          const filled = pin.length > index;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                filled && styles.dotFilled,
                errorMessage ? styles.dotError : null,
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <View style={styles.errorPlaceholder} />
      )}

      {/* Numeric Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          {['1', '2', '3'].map((val) => (
            <Pressable
              key={val}
              style={styles.keyButton}
              onPress={() => handleDigitPress(val)}
              accessibilityRole="button"
              accessibilityLabel={`Digit ${val}`}
            >
              <Text style={styles.keyNumber}>{val}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.keypadRow}>
          {['4', '5', '6'].map((val) => (
            <Pressable
              key={val}
              style={styles.keyButton}
              onPress={() => handleDigitPress(val)}
              accessibilityRole="button"
              accessibilityLabel={`Digit ${val}`}
            >
              <Text style={styles.keyNumber}>{val}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.keypadRow}>
          {['7', '8', '9'].map((val) => (
            <Pressable
              key={val}
              style={styles.keyButton}
              onPress={() => handleDigitPress(val)}
              accessibilityRole="button"
              accessibilityLabel={`Digit ${val}`}
            >
              <Text style={styles.keyNumber}>{val}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.keypadRow}>
          {/* Biometrics Action Button */}
          <Pressable
            style={styles.keyAction}
            onPress={attemptBiometrics}
            accessibilityRole="button"
            accessibilityLabel="Biometric Authentication"
          >
            <Fingerprint size={28} color={V4_COLORS.accent} />
          </Pressable>

          {/* Zero */}
          <Pressable
            style={styles.keyButton}
            onPress={() => handleDigitPress('0')}
            accessibilityRole="button"
            accessibilityLabel="Digit 0"
          >
            <Text style={styles.keyNumber}>0</Text>
          </Pressable>

          {/* Backspace Button */}
          <Pressable
            style={styles.keyAction}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete digit"
          >
            <Delete size={26} color={V4_COLORS.textWhite} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export const V4AppLockGate = React.memo(V4AppLockGateComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#031B2A', // Deep Obsidian Emerald Night
    zIndex: 99999,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(15, 118, 110, 0.25)',
    borderWidth: 1.5,
    borderColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...V4_SHADOWS.md,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: V4_COLORS.textWhite,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 24,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: V4_COLORS.accent,
    borderColor: V4_COLORS.accent,
    transform: [{ scale: 1.15 }],
  },
  dotError: {
    borderColor: V4_COLORS.danger,
    backgroundColor: V4_COLORS.danger,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    minHeight: 20,
  },
  errorPlaceholder: {
    minHeight: 20,
  },
  keypadContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
    marginBottom: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  keyAction: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default V4AppLockGate;
