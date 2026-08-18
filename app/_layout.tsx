import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { supabase } from '../src/lib/supabase';
import { UserRole } from '../src/types';
import * as profileService from '../src/services/profile';

export default function RootLayout() {
  const { login, logout, initializeFromStorage, initialized } = useAppStore();

  useEffect(() => {
    const initAll = async () => {
      try {
        await initializeFromStorage();
      } catch (e) {
        console.warn('Storage init failed:', e);
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const sUser = data.session.user;

          // Fetch full profile from Supabase profiles table
          const profileResult = await profileService.getProfile(sUser.id);

          if (profileResult.success && profileResult.data) {
            const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;
            login({
              ...profileResult.data,
              onboarding_completed: onboardingDone,
            });
          } else {
            // Profile fetch failed — use basic auth data
            const state = useAppStore.getState();
            const userRole = (sUser.user_metadata?.role as UserRole) || state.currentRole || 'RENTER';
            const onboardingDone = sUser.user_metadata?.onboarding_completed ?? state.isOnboarded;

            login({
              id: sUser.id,
              email: sUser.email || '',
              name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
              phone: sUser.phone || sUser.user_metadata?.phone || '',
              role: userRole,
              onboarding_completed: onboardingDone,
            });
          }
        }
      } catch (err) {
        console.warn('Session init warning:', err);
      }
    };

    initAll();

    // Single canonical auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const sUser = session.user;

        // Fetch full profile from Supabase profiles table
        const profileResult = await profileService.getProfile(sUser.id);

        if (profileResult.success && profileResult.data) {
          const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;
          login({
            ...profileResult.data,
            onboarding_completed: onboardingDone,
          });
        } else {
          // Fallback to basic auth metadata
          const userRole = (sUser.user_metadata?.role as UserRole) || useAppStore.getState().currentRole || 'RENTER';
          const onboardingDone = sUser.user_metadata?.onboarding_completed ?? useAppStore.getState().isOnboarded;

          login({
            id: sUser.id,
            email: sUser.email || '',
            name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
            phone: sUser.phone || sUser.user_metadata?.phone || '',
            role: userRole,
            onboarding_completed: onboardingDone,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(renter)" options={{ headerShown: false }} />
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
