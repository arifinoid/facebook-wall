import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase now issues publishable keys (`sb_publishable_…`); the legacy anon
// key (`eyJ…`) is still accepted as a fallback.
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

/**
 * Lazily create a single browser Supabase client. Throws a clear error when the
 * public env vars are missing instead of failing later inside a query.
 */
export function getSupabase(): SupabaseClient {
  if (cached) {
    return cached;
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    );
  }

  cached = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return cached;
}
