import { createServerClient as createSsrServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseJsClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://xoskechmxzgfajkfpssv.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2tlY2hteHpnZmFqa2Zwc3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzg3ODksImV4cCI6MjEwMjU1NDc4OX0.sJA39oV-GycfrcNUlLOFiZa5dWcnkmAYh2Acu0tchGg';

/**
 * Public client for server components, SEO queries and SSG without cookie dependency
 */
export function createPublicClient(): SupabaseClient {
  return createSupabaseJsClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Server client with cookie session handling for Server Actions & Route Handlers
 */
export function createServerSupabaseClient(): SupabaseClient {
  try {
    const cookieStore = cookies();
    return createSsrServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Can be ignored if called from a Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Can be ignored if called from a Server Component
          }
        },
      },
    });
  } catch {
    // Fallback if cookies() is called outside request scope (e.g. static build)
    return createPublicClient();
  }
}

export const createClient = createServerSupabaseClient;

export const createServerClient = createServerSupabaseClient;

export default createServerSupabaseClient;
