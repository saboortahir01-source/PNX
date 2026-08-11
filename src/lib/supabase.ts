import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lubmuvmwvkaxbgqrfljb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Ym11dm13dmtheGJncXJmbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzE5ODMsImV4cCI6MjEwMTk0Nzk4M30.jhaybuteM4du7mFMrxY346jTEJEZ8yIYEG7JXYqRa8s";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL).replace(/\/+$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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