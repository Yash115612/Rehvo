/**
 * REHVO Auth Service
 * Centralized authentication operations wrapping Supabase Auth.
 * All functions return typed results with user-friendly error messages.
 * Never creates fake users or exposes raw Supabase/Postgres errors.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyError(error: AuthError | Error | unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = (error as AuthError)?.message || (error as Error)?.message || '';
  const status = (error as AuthError)?.status;

  // Network / configuration errors
  if (message.includes('fetch') || message.includes('network') || message.includes('ENOTFOUND')) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  if (message.includes('placeholder') || !isSupabaseConfigured()) {
    return 'The app is not yet connected to the server. Please contact support.';
  }

  // Auth-specific errors
  if (status === 400 || message.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please check your credentials and try again.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in. Check your inbox for a confirmation link.';
  }
  if (message.includes('User already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (message.includes('Password') && message.includes('characters')) {
    return 'Password must be at least 6 characters long.';
  }
  if (message.includes('rate limit') || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (message.includes('invalid') && message.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('Phone') || message.includes('phone')) {
    if (message.includes('not enabled') || message.includes('not supported')) {
      return 'Phone login is not currently available. Please use email and password.';
    }
    return 'Invalid phone number. Please check and try again.';
  }
  if (message.includes('OTP') || message.includes('otp') || message.includes('token')) {
    return 'Invalid verification code. Please check the code and try again.';
  }
  if (message.includes('session') || message.includes('refresh_token')) {
    return 'Your session has expired. Please sign in again.';
  }

  // Generic fallback — never expose raw error
  return 'Something went wrong. Please try again.';
}

// ---------------------------------------------------------------------------
// Auth Operations
// ---------------------------------------------------------------------------

/** Sign up a new user with email and password */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult<{ userId: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const { data: resData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          phone: data.phone,
          role: 'renter',
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
      data: { userId: resData.user.id },
      requiresEmailConfirmation: needsConfirmation,
    };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Sign in with email and password */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult<{ userId: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: getUserFriendlyError(null) };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }

    if (!data.user) {
      return { success: false, error: 'Login failed. Please try again.' };
    }

    return { success: true, data: { userId: data.user.id } };
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
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\s/g, '')}`;

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
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\s/g, '')}`;

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

/** Sign out current user */
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
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: getUserFriendlyError(error) };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyError(err) };
  }
}

/** Get current session (for session restore) */
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
