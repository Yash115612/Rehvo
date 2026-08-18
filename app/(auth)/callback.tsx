import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAppStore } from '../../src/store/useAppStore';
import * as profileService from '../../src/services/profile';

export default function AuthCallbackRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    code?: string;
    error_description?: string;
    error?: string;
  }>();
  const { login, showToast } = useAppStore();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        if (params.error || params.error_description) {
          showToast(params.error_description || params.error || 'Authentication failed', 'error');
          router.replace('/(auth)/login');
          return;
        }

        if (params.access_token && params.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) throw error;
          if (data.user && isMounted) {
            const profileResult = await profileService.ensureProfileExists(data.user.id, {
              email: data.user.email,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
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
              router.replace('/(renter)/home');
            }
            return;
          }
        }

        if (params.code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
          if (error) throw error;
          if (data.user && isMounted) {
            const profileResult = await profileService.ensureProfileExists(data.user.id, {
              email: data.user.email,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
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
              router.replace('/(renter)/home');
            }
            return;
          }
        }

        // Fallback: check if session is already active
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user && isMounted) {
          router.replace('/(renter)/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (err: any) {
        showToast(err?.message || 'Authentication failed', 'error');
        router.replace('/(auth)/login');
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6C4DFF" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
  },
});
