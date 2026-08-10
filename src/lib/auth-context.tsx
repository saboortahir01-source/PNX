import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, fetchProfile, upsertProfile, type UserProfile } from "./supabase";

export type AuthModalView =
  | "login"
  | "signup"
  | "forgot_password"
  | "verify_email"
  | "onboarding";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  authModalView: AuthModalView;
  pendingPrompt: string | null;
  verificationEmail: string | null;
  openAuthModal: (view?: AuthModalView, pendingPrompt?: string) => void;
  closeAuthModal: () => void;
  setPendingPrompt: (prompt: string | null) => void;
  clearPendingPrompt: () => string | null;
  setVerificationEmail: (email: string | null) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeOnboarding: (role: string, useCase: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PENDING_PROMPT_KEY = "pnx_pending_prompt";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>("login");
  const [pendingPrompt, setPendingPromptState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(PENDING_PROMPT_KEY);
    }
    return null;
  });
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const modalOpenRef = useRef(authModalOpen);
  modalOpenRef.current = authModalOpen;

  const setPendingPrompt = useCallback((prompt: string | null) => {
    setPendingPromptState(prompt);
    if (typeof window !== "undefined") {
      if (prompt) {
        sessionStorage.setItem(PENDING_PROMPT_KEY, prompt);
      } else {
        sessionStorage.removeItem(PENDING_PROMPT_KEY);
      }
    }
  }, []);

  const clearPendingPrompt = useCallback(() => {
    const current = pendingPrompt;
    setPendingPrompt(null);
    return current;
  }, [pendingPrompt, setPendingPrompt]);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(user.id);
    if (p) {
      setProfile(p);
    } else {
      const initial = await upsertProfile({
        id: user.id,
        email: user.email ?? null,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        onboarding_completed: false,
      });
      setProfile(initial);
    }
  }, [user]);

  useEffect(() => {
    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        if (p) {
          setProfile(p);
          if (!p.onboarding_completed) {
            setAuthModalView("onboarding");
            setAuthModalOpen(true);
          } else if (modalOpenRef.current) {
            setAuthModalOpen(false);
          }
        } else {
          const initial = await upsertProfile({
            id: currentUser.id,
            email: currentUser.email ?? null,
            full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || null,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            onboarding_completed: false,
          });
          setProfile(initial);
          setAuthModalView("onboarding");
          setAuthModalOpen(true);
        }

        // Clean OAuth hash fragment from URL if present
        if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = useCallback((view: AuthModalView = "login", promptToPreserve?: string) => {
    if (promptToPreserve) {
      setPendingPrompt(promptToPreserve);
    }
    setAuthModalView(view);
    setAuthModalOpen(true);
  }, [setPendingPrompt]);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setAuthModalOpen(false);
  }, []);

  const completeOnboarding = useCallback(
    async (role: string, useCase: string) => {
      if (!user) return;
      const updated = await upsertProfile({
        id: user.id,
        email: user.email ?? null,
        role,
        use_case: useCase,
        onboarding_completed: true,
      });
      if (updated) setProfile(updated);
      setAuthModalOpen(false);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        authModalOpen,
        authModalView,
        pendingPrompt,
        verificationEmail,
        openAuthModal,
        closeAuthModal,
        setPendingPrompt,
        clearPendingPrompt,
        setVerificationEmail,
        signOut,
        refreshProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};