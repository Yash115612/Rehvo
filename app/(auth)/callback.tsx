import React, { useEffect, useRef } from 'react';
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
    token_hash?: string;
    type?: string;
    error_description?: string;
    error?: string;
  }>();
  const { login, showToast } = useAppStore();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      // Guard against duplicate execution (e.g. fast re-renders or StrictMode)
      if (hasProcessedRef.current) return;
      hasProcessedRef.current = true;

      try {
        // 1. Explicit error returned by Supabase
        if (params.error || params.error_description) {
          const errMsg = params.error_description || params.error || 'Authentication verification failed';
          showToast(errMsg, 'error');
          router.replace('/(auth)/login');
          return;
        }

        let authenticatedUser = null;

        // 2. Token-Hash OTP Verification Flow (Email Confirmation / Magic Link)
        if (params.token_hash) {
          const verificationType = (params.type as any) || 'signup';
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: params.token_hash,
            type: verificationType,
          });

          if (error) throw error;
          authenticatedUser = data.user || data.session?.user;
        }
        // 3. PKCE Code Exchange Flow
        else if (params.code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
          if (error) throw error;
          authenticatedUser = data.user || data.session?.user;
        }
        // 4. Implicit Grant Flow (#access_token=...&refresh_token=...)
        else if (params.access_token && params.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (error) throw error;
          authenticatedUser = data.user || data.session?.user;
        }

        // 5. Fallback: check if session is already active
        if (!authenticatedUser) {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            authenticatedUser = sessionData.session.user;
          }
        }

        if (!authenticatedUser) {
          throw new Error('Unable to establish verified session. Please sign in with your email.');
        }

        if (isMounted) {
          // Reconcile user profile in database
          const profileResult = await profileService.ensureProfileExists(authenticatedUser.id, {
            email: authenticatedUser.email,
            name:
              authenticatedUser.user_metadata?.full_name ||
              authenticatedUser.user_metadata?.name ||
              authenticatedUser.email?.split('@')[0] ||
              'User',
            role: (authenticatedUser.user_metadata?.role as any) || 'renter',
            phone: authenticatedUser.phone || authenticatedUser.user_metadata?.phone || '',
          });

          const isDone =
            profileResult.success && profileResult.data
              ? (profileResult.data.onboarding_completed ?? false)
              : (authenticatedUser.user_metadata?.onboarding_completed ?? false);

          login({
            ...(profileResult.data || {
              id: authenticatedUser.id,
              email: authenticatedUser.email || '',
              name: authenticatedUser.user_metadata?.full_name || 'User',
              role: authenticatedUser.user_metadata?.role || 'RENTER',
            }),
            onboarding_completed: isDone,
          });

          showToast('Email verified successfully! Welcome to REHVO.', 'success');

          if (isDone) {
            router.replace('/(renter)/home');
          } else {
            router.replace({
              pathname: '/(auth)/onboarding',
              params: { startStep: 'ROLE' },
            });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          const message = err?.message || 'Authentication failed. Please sign in.';
          showToast(message, 'error');
          router.replace('/(auth)/login');
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0F766E" />
      <Text style={styles.text}>Verifying your REHVO account...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#031B2A',
  },
});
