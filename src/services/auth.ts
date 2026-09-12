/**
 * REHVO Auth Service
 * Centralized authentication operations wrapping Supabase Auth.
 * All functions return typed results with user-friendly error messages.
 * Never creates fake users or exposes raw Supabase/Postgres errors.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AuthError } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { makeRedirectUri } from 'expo-auth-session';

// Tell WebBrowser to handle redirect triggers cleanly on native & web
WebBrowser.maybeCompleteAuthSession();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'renter' | 'owner' | 'broker';
  city?: string;
  agencyName?: string;
  reraNumber?: string;
  officeAddress?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

export function getUserFriendlyError(error: AuthError | Error | unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = (error as AuthError)?.message || (error as Error)?.message || '';
  const status = (error as AuthError)?.status;
  const code = (error as any)?.code || (error as any)?.error_code || '';

  // Safe development logging — never logs secrets, passwords or tokens


  // Network / configuration errors
  if (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('ENOTFOUND') ||
    message.includes('Failed to fetch')
  ) {
    return 'Unable to connect. Check your internet connection and try again.';
  }
  if (message.includes('placeholder') || !isSupabaseConfigured()) {
    return 'The app is not yet connected to the server. Please contact support.';
  }

  // Google / OAuth specific errors
  if (message.includes('Unsupported provider') || message.includes('provider is not enabled')) {
    return 'Google sign-in is not yet configured in Supabase. Please use email and password or contact support.';
  }
  if (message.includes('cancelled') || message.includes('dismissed')) {
    return 'Google sign-in was cancelled.';
  }
  if (message.includes('OAuth') || message.includes('oauth') || message.includes('access_denied')) {
    return 'Unable to complete Google sign-in. Please try again.';
  }

  // Email Confirmation (Check BEFORE generic status 400)
  if (
    code === 'email_not_confirmed' ||
    message.includes('Email not confirmed') ||
    message.includes('email_not_confirmed')
  ) {
    return 'Please confirm your email before logging in. Check your inbox for a confirmation link.';
  }

  // User Already Registered
  if (
    code === 'user_already_exists' ||
    message.includes('User already registered') ||
    message.includes('already been registered') ||
    message.includes('user_already_exists')
  ) {
    return 'An account with this email already exists. Please sign in instead.';
  }

  // Password Requirements
  if (
    code === 'weak_password' ||
    (message.includes('Password') &&
      (message.includes('short') || message.includes('least') || message.includes('weak')))
  ) {
    return 'Password must be at least 6 characters long.';
  }

  // Rate Limiting
  if (
    code === 'over_request_rate_limit' ||
    message.includes('rate limit') ||
    message.includes('Too many requests')
  ) {
    return 'Too many attempts. Please wait a few moments before trying again.';
  }

  // Invalid Credentials
  if (
    code === 'invalid_credentials' ||
    message.includes('Invalid login credentials') ||
    message.includes('invalid_grant')
  ) {
    return 'Incorrect email or password. Please try again.';
  }

  // OTP Expired
  if (
    code === 'otp_expired' ||
    message.includes('Token has expired') ||
    message.includes('expired')
  ) {
    return 'The verification code has expired. Please request a new one.';
  }

  // Invalid OTP
  if (
    code === 'bad_code' ||
    message.includes('Token is invalid') ||
    message.includes('invalid token')
  ) {
    return 'Incorrect verification code. Please check and try again.';
  }

  // Phone SMS Provider error
  if (
    message.includes('sms') ||
    message.includes('SMS') ||
    message.includes('Twilio') ||
    message.includes('phone')
  ) {
    return 'SMS service is temporarily unavailable. Please try signing in with email or contact support.';
  }

  // Generic fallback — never expose raw Postgres/JWT error
  return message || 'Unable to complete sign in. Please try again.';
}

// ---------------------------------------------------------------------------
// Auth Operations
// ---------------------------------------------------------------------------

/** Sign up a new user with email and password */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult<{ userId: string; email: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const formattedPhone = data.phone.startsWith('+91') ? data.phone : `+91 ${data.phone.replace(/\D/g, '')}`;
    const userRole = (data.role || 'renter').toLowerCase();

    const { data: resData, error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          full_name: data.name.trim(),
          phone: formattedPhone,
          role: userRole,
          account_type: userRole,
          city: data.city || 'Mumbai',
          company_name: data.agencyName || undefined,
          rera_number: data.reraNumber || undefined,
          office_address: data.officeAddress || undefined,
          onboarding_completed: false,
        },
      },
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!resData.user) {
      return { success: false, error: 'Account creation failed. Please try again.' };
    }

    // Check if email confirmation is required
    // When email confirmation is enabled, session will be null until confirmed
    const needsConfirmation = !resData.session;

    return {
      success: true,
      data: { userId: resData.user.id, email: resData.user.email || data.email },
      requiresEmailConfirmation: needsConfirmation,
    };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Sign in with email and password */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult<{ userId: string; email: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed. Please try again.' };
    }

    return {
      success: true,
      data: { userId: data.user.id, email: data.user.email || email },
    };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Sign in with Google OAuth via Supabase and Expo WebBrowser */
export async function signInWithGoogle(): Promise<AuthResult<{ userId: string; email: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    // Standardized redirect URI for REHVO scheme
    const redirectUrl = makeRedirectUri({
      scheme: 'rehvo',
      path: 'auth/callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!data?.url) {
      return { success: false, error: 'Unable to start Google sign-in. Please try again.' };
    }

    // Launch in-app browser session
    const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
      return { success: false, error: 'Google sign-in was cancelled.' };
    }

    if (browserResult.type === 'success' && browserResult.url) {
      // Check for error in callback URL
      if (browserResult.url.includes('error=')) {
        const parsed = QueryParams.getQueryParams(browserResult.url);
        const errorDesc =
          parsed.params?.error_description ||
          parsed.params?.error ||
          'Google sign-in failed.';
        return { success: false, error: getUserFriendlyError(new Error(errorDesc)) };
      }

      // Check for Implicit Grant (fragment tokens)
      if (browserResult.url.includes('#access_token=') || browserResult.url.includes('&access_token=')) {
        const fragment = browserResult.url.split('#')[1] || '';
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionErr) {
            return { success: false, error: getUserFriendlyError(sessionErr) };
          }

          if (sessionData.user) {
            return {
              success: true,
              data: {
                userId: sessionData.user.id,
                email: sessionData.user.email || '',
              },
            };
          }
        }
      }

      // Check for PKCE Authorization Code
      const parsed = QueryParams.getQueryParams(browserResult.url);
      const code = parsed.params?.code;
      if (code) {
        const { data: sessionData, error: sessionErr } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionErr) {
          return { success: false, error: getUserFriendlyError(sessionErr) };
        }
        if (sessionData.user) {
          return {
            success: true,
            data: {
              userId: sessionData.user.id,
              email: sessionData.user.email || '',
            },
          };
        }
      }

      // Check if session was updated in background listener
      const session = await getSession();
      if (session?.user) {
        return {
          success: true,
          data: {
            userId: session.user.id,
            email: session.user.email || '',
          },
        };
      }
    }

    return { success: false, error: 'Google sign-in could not be completed. Please try again.' };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Sign in with Apple OAuth via Supabase and Expo WebBrowser */
export async function signInWithApple(): Promise<AuthResult<{ userId: string; email: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const redirectUrl = makeRedirectUri({
      scheme: 'rehvo',
      path: 'auth/callback',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!data?.url) {
      return { success: false, error: 'Unable to start Apple sign-in. Please try again.' };
    }

    const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
      return { success: false, error: 'Apple sign-in was cancelled.' };
    }

    if (browserResult.type === 'success' && browserResult.url) {
      if (browserResult.url.includes('error=')) {
        const parsed = QueryParams.getQueryParams(browserResult.url);
        const errorDesc =
          parsed.params?.error_description ||
          parsed.params?.error ||
          'Apple sign-in failed.';
        return { success: false, error: getUserFriendlyError(new Error(errorDesc)) };
      }

      if (browserResult.url.includes('#access_token=') || browserResult.url.includes('&access_token=')) {
        const fragment = browserResult.url.split('#')[1] || '';
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionErr) {
            return { success: false, error: getUserFriendlyError(sessionErr) };
          }

          if (sessionData.user) {
            return {
              success: true,
              data: {
                userId: sessionData.user.id,
                email: sessionData.user.email || '',
              },
            };
          }
        }
      }

      const parsed = QueryParams.getQueryParams(browserResult.url);
      const code = parsed.params?.code;
      if (code) {
        const { data: sessionData, error: sessionErr } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionErr) {
          return { success: false, error: getUserFriendlyError(sessionErr) };
        }
        if (sessionData.user) {
          return {
            success: true,
            data: {
              userId: sessionData.user.id,
              email: sessionData.user.email || '',
            },
          };
        }
      }

      const session = await getSession();
      if (session?.user) {
        return {
          success: true,
          data: {
            userId: session.user.id,
            email: session.user.email || '',
          },
        };
      }
    }

    return { success: false, error: 'Apple sign-in could not be completed. Please try again.' };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Request phone OTP for sign in */
export async function signInWithPhone(phone: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;

    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Verify phone OTP code */
export async function verifyPhoneOtp(phone: string, code: string): Promise<AuthResult<{ userId: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: 'sms',
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!data.user) {
      return { success: false, error: 'Verification failed. Please try again.' };
    }

    return { success: true, data: { userId: data.user.id } };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Sign out current user from Supabase */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Request password reset email */
export async function resetPassword(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Get current session from Supabase client (for session restore) */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Request account deletion.
 * Cleans up user profile row in public.profiles and signs out.
 * (Full Supabase Auth user deletion from auth.users requires server-side Admin API / service role).
 */
export async function deleteAccount(userId: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    // 1. Mark profile as deleted/blocked
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Deleted User',
        phone: null,
        profile_photo: null,
        bio: null,
        city: null,
        locality: null,
        is_blocked: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      return { success: false, error: 'Failed to delete account. Please contact support.' };
    }

    // 2. Sign out from Supabase
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Ensure active Supabase user session with a valid public.profiles record */
export async function ensureUserSession(): Promise<{ userId: string; name: string } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;

    if (!currentUserId) return null;

    // Check if public.profiles exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', currentUserId)
      .maybeSingle();

    return {
      userId: currentUserId,
      name: existingProfile?.full_name || authData.user.user_metadata?.full_name || 'REHVO User',
    };
  } catch {
    return null;
  }
}

