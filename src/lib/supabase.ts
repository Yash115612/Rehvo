import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read Expo environment variables for native runtime
// Supports both EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY and EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Runtime validation for production and preview APK builds
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder') &&
  supabaseKey !== 'your-supabase-publishable-key'
);

if (!isConfigured) {
  console.warn(
    '[REHVO Supabase] Missing or placeholder Supabase credentials.\n' +
    'Target Project: REHVO South Asia (Mumbai / ap-south-1)\n' +
    'Please verify EAS Environment variables or .env.local configuration.'
  );
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://xoskechmxzgfajkfpssv.supabase.co',
  isConfigured ? supabaseKey : 'placeholder-anon-key-rehvo',
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

/** Check if Supabase is properly configured with a live project URL and key at runtime */
export const isSupabaseConfigured = (): boolean => {
  return isConfigured;
};

/** Get the configured project URL hostname safely without exposing keys */
export const getSupabaseHost = (): string => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) return 'xoskechmxzgfajkfpssv.supabase.co';
  try {
    const url = new URL(supabaseUrl);
    return url.host;
  } catch {
    return 'invalid-url';
  }
};

/** Safe diagnostic summary for build and connection status without exposing secret tokens */
export const getSupabaseConfigState = () => {
  return {
    configured: isConfigured,
    host: getSupabaseHost(),
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseKey && !supabaseKey.includes('placeholder')),
    keyPrefix: supabaseKey ? supabaseKey.substring(0, 8) + '...' : 'none',
  };
};
