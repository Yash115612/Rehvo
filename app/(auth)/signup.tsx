import React from 'react';
import { useRouter } from 'expo-router';
import { SignUpScreen } from '../../src/components/auth/SignUpScreen';
import { useAppStore } from '../../src/store/useAppStore';
import * as authService from '../../src/services/auth';
import * as profileService from '../../src/services/profile';

export default function SignUpRoute() {
  const router = useRouter();
  const { login, showToast } = useAppStore();

  const handleSignUpSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; error?: string; requiresVerification?: boolean }> => {
    const result = await authService.signUpWithEmail(data);

    if (result.success && result.data) {
      const formattedPhone = data.phone.startsWith('+91') ? data.phone : `+91 ${data.phone}`;

      // Ensure profile row exists in PostgreSQL
      const profileResult = await profileService.ensureProfileExists(result.data.userId, {
        name: data.name,
        email: data.email,
        phone: formattedPhone,
        role: 'RENTER',
      });

      if (result.requiresEmailConfirmation) {
        showToast('Please check your email to verify your account', 'info');
      } else {
        showToast('Account created successfully!', 'success');
      }

      if (profileResult.success && profileResult.data) {
        login({
          ...profileResult.data,
          onboarding_completed: false,
        });
      } else {
        login({
          id: result.data.userId,
          name: data.name,
          email: data.email,
          phone: formattedPhone,
          onboarding_completed: false,
        });
      }

      router.replace({
        pathname: '/(auth)/onboarding',
        params: { startStep: 'ROLE' },
      });
      return { success: true, requiresVerification: result.requiresEmailConfirmation || false };
    } else {
      const errorMsg = result.error || 'Signup failed';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg, requiresVerification: false };
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
      showToast('Apple sign-up coming soon', 'info');
      return;
    }

    const result = await authService.signInWithGoogle();
    if (result.success && result.data) {
      const profileResult = await profileService.ensureProfileExists(result.data.userId, {
        email: result.data.email,
        role: 'RENTER',
      });

      if (profileResult.success && profileResult.data) {
        const isDone = profileResult.data.onboarding_completed ?? false;
        login({
          ...profileResult.data,
          onboarding_completed: isDone,
        });
        if (isDone) {
          router.replace('/(renter)/home');
        } else {
          router.replace({
            pathname: '/(auth)/onboarding',
            params: { startStep: 'ROLE' },
          });
        }
      } else {
        login({
          id: result.data.userId,
          email: result.data.email,
          onboarding_completed: false,
        });
        router.replace({
          pathname: '/(auth)/onboarding',
          params: { startStep: 'ROLE' },
        });
      }
    } else if (result.error) {
      showToast(result.error, 'error');
    }
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
