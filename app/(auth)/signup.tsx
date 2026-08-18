import React from 'react';
import { useRouter } from 'expo-router';
import { SignUpScreen } from '../../src/components/auth/SignUpScreen';
import { useAppStore } from '../../src/store/useAppStore';
import * as authService from '../../src/services/auth';

export default function SignUpRoute() {
  const router = useRouter();
  const { login, showToast } = useAppStore();

  const handleSignUpSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const result = await authService.signUpWithEmail(data);

    if (result.success && result.data) {
      if (result.requiresEmailConfirmation) {
        showToast('Please check your email to verify your account', 'info');
        // Still log in locally to proceed to onboarding
        login({
          id: result.data.userId,
          name: data.name,
          email: data.email,
          phone: `+91 ${data.phone}`,
          onboarding_completed: false,
        });
      } else {
        login({
          id: result.data.userId,
          name: data.name,
          email: data.email,
          phone: `+91 ${data.phone}`,
          onboarding_completed: false,
        });
        showToast('Account created successfully!', 'success');
      }

      router.replace({
        pathname: '/(auth)/onboarding',
        params: { startStep: 'ROLE' },
      });
      return { success: true, requiresVerification: result.requiresEmailConfirmation || false };
    } else {
      showToast(result.error || 'Signup failed', 'error');
      return { success: false, requiresVerification: false };
    }
  };

  const handleSocialSignUp = (_provider: 'google' | 'apple') => {
    showToast('Social signup coming soon', 'info');
  };

  return (
    <SignUpScreen
      onSuccessSignUp={() =>
        router.replace({
          pathname: '/(auth)/onboarding',
          params: { startStep: 'ROLE' },
        })
      }
      onNavigateLogin={() => router.push('/(auth)/login')}
      onSocialSignUp={handleSocialSignUp}
      onSignUpSubmit={handleSignUpSubmit}
    />
  );
}
