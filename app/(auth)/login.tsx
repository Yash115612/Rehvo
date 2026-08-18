import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '../../src/components/auth/LoginScreen';
import { useAppStore } from '../../src/store/useAppStore';
import { UserRole } from '../../src/types';
import * as authService from '../../src/services/auth';
import * as profileService from '../../src/services/profile';

export default function LoginRoute() {
  const router = useRouter();
  const { login, showToast } = useAppStore();

  const handleSuccessLogin = (targetRole?: UserRole, onboardingDone: boolean = true) => {
    const state = useAppStore.getState();
    const role = targetRole || state.user?.role || state.currentRole || 'RENTER';

    if (!onboardingDone) {
      router.replace({
        pathname: '/(auth)/onboarding',
        params: { startStep: 'ROLE' },
      });
      return;
    }

    if (role === 'OWNER') {
      router.replace('/(owner)/dashboard');
    } else {
      router.replace('/(renter)/home');
    }
  };

  const handlePhoneSendOtp = async (phoneNum: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.signInWithPhone(phoneNum);
    if (result.success) {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: phoneNum },
      });
      return { success: true };
    } else {
      const errorMsg = result.error || 'Failed to send OTP';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const handleEmailLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.signInWithEmail(email, pass);

    if (result.success && result.data) {
      // Ensure full profile from Supabase
      const profileResult = await profileService.ensureProfileExists(result.data.userId, {
        email,
      });

      if (profileResult.success && profileResult.data) {
        const isDone = profileResult.data.onboarding_completed ?? true;
        login(profileResult.data);
        handleSuccessLogin(profileResult.data.role, isDone);
      } else {
        login({
          id: result.data.userId,
          email,
          onboarding_completed: true,
        });
        handleSuccessLogin();
      }
      return { success: true };
    } else {
      const errorMsg = result.error || 'Login failed';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const handleSocialLogin = async (_provider: 'google' | 'apple') => {
    showToast('Social login coming soon', 'info');
  };

  return (
    <LoginScreen
      onSuccessLogin={() => handleSuccessLogin()}
      onNavigateSignUp={() => router.push('/(auth)/signup')}
      onNavigateForgotPassword={() => router.push('/(auth)/forgot-password')}
      onSocialLogin={handleSocialLogin}
      onPhoneSendOtp={handlePhoneSendOtp}
      onEmailLogin={handleEmailLogin}
    />
  );
}
