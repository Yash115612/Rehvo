import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '../../src/components/splash/SplashScreen';
import { useAppStore } from '../../src/store/useAppStore';

export default function SplashRoute() {
  const router = useRouter();
  const { initializeFromStorage, initialized } = useAppStore();

  useEffect(() => {
    if (!initialized) {
      initializeFromStorage();
    }
  }, [initialized, initializeFromStorage]);

  const handleFinish = useCallback(() => {
    const state = useAppStore.getState();

    if (state.isAuthenticated && state.user) {
      if (!state.isOnboarded && !state.user.onboarding_completed) {
        router.replace('/(auth)/role-selection');
      } else if (state.currentRole === 'OWNER' || state.user.role === 'OWNER') {
        router.replace('/(owner)/dashboard');
      } else {
        router.replace('/(renter)/home');
      }
    } else {
      if (!state.isOnboarded) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [router]);

  return <SplashScreen onFinish={handleFinish} isReady={initialized} />;
}
