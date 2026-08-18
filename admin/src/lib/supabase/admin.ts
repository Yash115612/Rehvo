import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Privileged Server-Only Admin Supabase Client
 * 
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
 * for administrative actions (e.g. system audits, user management, global analytics).
 * 
 * CRITICAL SECURITY RULES:
 * 1. NEVER import this file into Client Components ('use client')
 * 2. NEVER expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_* variables
 * 3. ONLY execute within Next.js Route Handlers, Server Actions, or Server Components
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY VIOLATION: createAdminClient() was called in the browser. ' +
      'Privileged service-role operations must execute exclusively on the server.'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    console.warn(
      '[REHVO Admin Server] SUPABASE_SERVICE_ROLE_KEY is not set or using placeholder.\n' +
      'Privileged server-side administrative operations will be limited.'
    );
  }

  return createSupabaseClient(
    supabaseUrl,
    serviceRoleKey || 'placeholder-service-role-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
