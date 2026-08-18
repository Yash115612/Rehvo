import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { UserRole } from '../src/types';
import * as profileService from '../src/services/profile';

export default function RootLayout() {
  const { login, logout, initializeFromStorage } = useAppStore();

  useEffect(() => {
    let isMounted = true;

    const initAll = async () => {
      try {
        await initializeFromStorage();
      } catch (e) {
        console.warn('[REHVO] Storage init failed:', e);
      }

      if (!isSupabaseConfigured()) {
        console.warn('[REHVO] Supabase is not fully configured. Auth lifecycle disabled.');
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user && isMounted) {
          const sUser = data.session.user;
          const userRole = (sUser.user_metadata?.role as UserRole) || 'RENTER';
          const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;

          // Fetch or ensure profile from Supabase profiles table
          const profileResult = await profileService.ensureProfileExists(sUser.id, {
            name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
            email: sUser.email || '',
            phone: sUser.phone || sUser.user_metadata?.phone || '',
            role: userRole,
          });

          if (profileResult.success && profileResult.data && isMounted) {
            login({
              ...profileResult.data,
              onboarding_completed: onboardingDone,
            });
          }
        }
      } catch (err) {
        console.warn('[REHVO] Session init warning:', err);
      }
    };

    initAll();

    // Single canonical auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const sUser = session.user;
        const userRole = (sUser.user_metadata?.role as UserRole) || 'RENTER';
        const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;

        // Fetch or ensure profile from Supabase profiles table
        const profileResult = await profileService.ensureProfileExists(sUser.id, {
          name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
          email: sUser.email || '',
          phone: sUser.phone || sUser.user_metadata?.phone || '',
          role: userRole,
        });

        if (profileResult.success && profileResult.data && isMounted) {
          login({
            ...profileResult.data,
            onboarding_completed: onboardingDone,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      isMounted = false;
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
