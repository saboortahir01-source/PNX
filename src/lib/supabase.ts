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
  console.warn("Supabase URL or anon key is not defined");
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  use_case?: string | null;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!url || !key) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Error fetching user profile:", error.message);
      return null;
    }
    return data as UserProfile | null;
  } catch (err) {
    console.warn("Error fetching user profile:", err);
    return null;
  }
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
  if (!url || !key) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Error upserting user profile:", error.message);
      return null;
    }
    return data as UserProfile | null;
  } catch (err) {
    console.warn("Error upserting user profile:", err);
    return null;
  }
}