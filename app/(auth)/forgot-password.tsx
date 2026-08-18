import React from 'react';
import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '../../src/components/auth/ForgotPasswordScreen';
import { useAppStore } from '../../src/store/useAppStore';
import * as authService from '../../src/services/auth';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const { showToast } = useAppStore();

  const handleSendResetLink = async (email: string): Promise<boolean> => {
    const result = await authService.resetPassword(email);
    if (result.success) {
      showToast('Password reset link sent to your email', 'success');
      return true;
    } else {
      showToast(result.error || 'Failed to send reset link', 'error');
      return false;
    }
  };

  return (
    <ForgotPasswordScreen
      onBack={() => router.back()}
      onNavigateLogin={() => router.push('/(auth)/login')}
      onSendResetLink={handleSendResetLink}
    />
  );
}
