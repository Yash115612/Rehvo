import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { UserRole } from '../src/types';
import * as profileService from '../src/services/profile';
import { V4ErrorBoundary } from '../src/components/v4/ui/V4ErrorBoundary';
import { V4AppLockGate } from '../src/components/v4/security/V4AppLockGate';
import { V4OfflineNotice } from '../src/components/v4/ui/V4OfflineNotice';
import { addConnectivityListener } from '../src/services/offlineEngine';

export default function RootLayout() {
  const { login, logout, initializeFromStorage } = useAppStore();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsub = addConnectivityListener((online) => {
      setIsOffline(!online);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeFromStorage();
      } catch {
        // Silent catch for storage init
      }

      if (!isSupabaseConfigured()) {
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user && mounted) {
          const sUser = data.session.user;
          const userRole = (sUser.user_metadata?.role as UserRole) || 'RENTER';
          const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;

          const profileResult = await profileService.ensureProfileExists(sUser.id, {
            name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
            email: sUser.email || '',
            phone: sUser.phone || sUser.user_metadata?.phone || '',
            role: userRole,
          });

          if (profileResult.success && profileResult.data && mounted) {
            login({
              ...profileResult.data,
              onboarding_completed: onboardingDone,
            });
          }
        }
      } catch {
        // Silent catch for session init
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED': {
          if (session?.user) {
            const sUser = session.user;
            const userRole = (sUser.user_metadata?.role as UserRole) || 'RENTER';
            const onboardingDone = sUser.user_metadata?.onboarding_completed ?? true;

            const profileResult = await profileService.ensureProfileExists(sUser.id, {
              name: sUser.user_metadata?.full_name || sUser.email?.split('@')[0] || 'User',
              email: sUser.email || '',
              phone: sUser.phone || sUser.user_metadata?.phone || '',
              role: userRole,
            });

            if (profileResult.success && profileResult.data && mounted) {
              login({
                ...profileResult.data,
                onboarding_completed: onboardingDone,
              });
            }
          }
          break;
        }

        case 'SIGNED_OUT': {
          logout();
          break;
        }

        default:
          break;
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <V4ErrorBoundary>
        <V4AppLockGate>
          <StatusBar style="dark" />
          <V4OfflineNotice isOffline={isOffline} />
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              animation: 'default',
              freezeOnBlur: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(renter)" options={{ headerShown: false }} />
            <Stack.Screen name="(owner)" options={{ headerShown: false }} />
            <Stack.Screen name="(broker)" options={{ headerShown: false }} />
          </Stack>
        </V4AppLockGate>
      </V4ErrorBoundary>
    </SafeAreaProvider>
  );
}
