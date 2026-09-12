import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://xoskechmxzgfajkfpssv.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2tlY2hteHpnZmFqa2Zwc3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzg3ODksImV4cCI6MjEwMjU1NDc4OX0.sJA39oV-GycfrcNUlLOFiZa5dWcnkmAYh2Acu0tchGg';

/**
 * Creates a browser-compatible Supabase client using @supabase/ssr
 */
export function createClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

/**
 * Shared Supabase client instance for client-side operations
 */
export const supabase: SupabaseClient =
  typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : createSupabaseClient(supabaseUrl, supabaseKey);

export default supabase;
