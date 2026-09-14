import { createClient as createSupabaseJsClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xoskechmxzgfajkfpssv.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2tlY2hteHpnZmFqa2Zwc3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzg3ODksImV4cCI6MjEwMjU1NDc4OX0.sJA39oV-GycfrcNUlLOFiZa5dWcnkmAYh2Acu0tchGg";

let clientInstance: SupabaseClient | null = null;

export function createClient(
  url: string = supabaseUrl,
  key: string = supabaseKey
): SupabaseClient {
  if (clientInstance && url === supabaseUrl && key === supabaseKey) {
    return clientInstance;
  }

  const client = createSupabaseJsClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  if (url === supabaseUrl && key === supabaseKey) {
    clientInstance = client;
  }

  return client;
}

export const getSupabaseClient = createClient;
export const createBrowserClient = createClient;
export const supabase: SupabaseClient = createClient();
export default supabase;
