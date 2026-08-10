import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Remove trailing slash from URL if present
const cleanedSupabaseUrl = supabaseUrl?.replace(/\/+$/, "");

// Fallback to empty string if undefined to avoid passing undefined to createClient
const url = cleanedSupabaseUrl ?? "";
const key = supabaseAnonKey ?? "";

if (!url || !key) {
  // Log a warning but still create the client to avoid breaking the app
  // The client will throw an error when used, which is better than a silent failure.
  console.warn("Supabase URL or anon key is not defined");
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});