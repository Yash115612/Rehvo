import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read Expo environment variables for native runtime
// Supports both EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY and EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Runtime check for missing configuration
if (!supabaseUrl || !supabaseKey) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(
      '[REHVO Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY / EXPO_PUBLIC_SUPABASE_ANON_KEY.\n' +
      'Ensure your .env file is created with credentials for the REHVO South Asia (Mumbai) Supabase project.\n' +
      'Auth and database operations will be blocked until configured.'
    );
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key-rehvo',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disabled in React Native native environment
      storageKey: 'rehvo_supabase_auth_token',
    },
  }
);

/** Check if Supabase is properly configured with a live project URL at runtime */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'));
};

/** Get the configured project URL hostname safely without exposing keys */
export const getSupabaseHost = (): string => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) return 'placeholder';
  try {
    const url = new URL(supabaseUrl);
    return url.host;
  } catch {
    return 'invalid-url';
  }
};
