import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OtpInput } from '../../src/components/common/OtpInput';
import { useAppStore } from '../../src/store/useAppStore';
import * as authService from '../../src/services/auth';
import * as profileService from '../../src/services/profile';

export default function OtpRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { currentRole, login, showToast } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const rawPhone = params.phone || '9876543210';
  const displayPhone = `+91 ${rawPhone.replace(/(\d{5})(\d{5})/, '$1 $2')}`;

  const handleComplete = async (code: string) => {
    setError(null);
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);

    const result = await authService.verifyPhoneOtp(rawPhone, code);

    setIsLoading(false);

    if (result.success && result.data) {
      setIsSuccess(true);

      // Fetch full profile from Supabase
      const profileResult = await profileService.ensureProfileExists(result.data.userId);

      if (profileResult.success && profileResult.data) {
        login(profileResult.data);
      } else {
        // Auth succeeded but profile not ready — use minimal data
        login({
          id: result.data.userId,
          phone: `+91 ${rawPhone}`,
          role: currentRole || 'RENTER',
          onboarding_completed: true,
        });
      }

      showToast('Phone number verified successfully', 'success');

      setTimeout(() => {
        const userRole = useAppStore.getState().user?.role || currentRole || 'RENTER';
        if (userRole === 'OWNER') {
          router.replace('/(owner)/dashboard');
        } else {
          router.replace('/(renter)/home');
        }
      }, 300);
    } else {
      setError(result.error || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    setError(null);
    const result = await authService.signInWithPhone(rawPhone);
    if (result.success) {
      showToast('New 6-digit code sent via SMS', 'info');
    } else {
      showToast(result.error || 'Failed to resend code', 'error');
    }
  };

  const handleChangeNumber = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OtpInput
            phoneNumber={displayPhone}
            onComplete={handleComplete}
            onResend={handleResend}
            onChangeNumber={handleChangeNumber}
            onBack={() => router.back()}
            error={error}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexGrow: 1,
  },
});
