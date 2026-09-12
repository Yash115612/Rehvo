import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROD_SUPABASE_URL = 'https://xoskechmxzgfajkfpssv.supabase.co';
const PROD_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2tlY2hteHpnZmFqa2Zwc3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzg3ODksImV4cCI6MjEwMjU1NDc4OX0.sJA39oV-GycfrcNUlLOFiZa5dWcnkmAYh2Acu0tchGg';

// Read Expo environment variables for native runtime or fallback to live production credentials
const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  envUrl && !envUrl.includes('placeholder') ? envUrl : PROD_SUPABASE_URL;
const supabaseKey =
  envKey && !envKey.includes('placeholder') && envKey !== 'your-supabase-publishable-key'
    ? envKey
    : PROD_SUPABASE_ANON_KEY;

// Runtime validation for production and preview builds
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disabled in React Native native environment
    storageKey: 'rehvo_supabase_auth_token',
  },
});

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
