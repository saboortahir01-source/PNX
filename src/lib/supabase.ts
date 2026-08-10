import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://placeholder-project.supabase.co";

const supabaseAnonKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  use_case: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[PNX Auth] Error fetching user profile:", error.message);
      return null;
    }
    return data as UserProfile | null;
  } catch (err) {
    console.warn("[PNX Auth] Profile fetch exception:", err);
    return null;
  }
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: profile.id,
          full_name: profile.full_name ?? null,
          email: profile.email ?? null,
          avatar_url: profile.avatar_url ?? null,
          role: profile.role ?? null,
          use_case: profile.use_case ?? null,
          onboarding_completed: profile.onboarding_completed ?? false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select("*")
      .maybeSingle();

    if (error) {
      console.warn("[PNX Auth] Profile upsert error:", error.message);
      return null;
    }
    return data as UserProfile | null;
  } catch (err) {
    console.warn("[PNX Auth] Profile upsert exception:", err);
    return null;
  }
}