import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

/**
 * Lazily create a single browser Supabase client. Throws a clear error when the
 * public env vars are missing instead of failing later inside a query.
 */
export function getSupabase(): SupabaseClient {
  if (cached) {
    return cached;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }

  cached = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  return cached;
}
