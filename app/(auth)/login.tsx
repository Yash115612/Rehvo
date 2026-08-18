import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '../../src/components/auth/LoginScreen';
import { useAppStore } from '../../src/store/useAppStore';
import { UserRole } from '../../src/types';
import * as authService from '../../src/services/auth';
import * as profileService from '../../src/services/profile';

export default function LoginRoute() {
  const router = useRouter();
  const { currentRole, login, showToast } = useAppStore();

  const handleSuccessLogin = (targetRole?: UserRole) => {
    const state = useAppStore.getState();
    const role = targetRole || state.user?.role || state.currentRole || 'RENTER';
    if (role === 'OWNER') {
      router.replace('/(owner)/dashboard');
    } else {
      router.replace('/(renter)/home');
    }
  };

  const handlePhoneSendOtp = async (phoneNum: string): Promise<boolean> => {
    const result = await authService.signInWithPhone(phoneNum);
    if (result.success) {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: phoneNum },
      });
      return true;
    } else {
      showToast(result.error || 'Failed to send OTP', 'error');
      return false;
    }
  };

  const handleEmailLogin = async (email: string, pass: string): Promise<boolean> => {
    const result = await authService.signInWithEmail(email, pass);

    if (result.success && result.data) {
      // Fetch full profile from Supabase
      const profileResult = await profileService.getProfile(result.data.userId);

      if (profileResult.success && profileResult.data) {
        login(profileResult.data);
        handleSuccessLogin(profileResult.data.role);
      } else {
        // Profile may not be loaded yet but auth succeeded — use basic data
        login({
          id: result.data.userId,
          email,
          onboarding_completed: true,
        });
        handleSuccessLogin();
      }
      return true;
    } else {
      showToast(result.error || 'Login failed', 'error');
      return false;
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
