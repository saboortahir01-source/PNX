import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import pnxLogo from "@/assets/pnx-logo.png";

// Google Logo SVG
const GoogleIcon = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

// Official GitHub Logo SVG
const GithubIcon = () => (
  <svg className="size-4 shrink-0 fill-current text-zinc-900 dark:text-zinc-100" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const ROLES = [
  "SEO Professional",
  "Founder",
  "Agency",
  "Marketer",
  "Content Creator",
  "Other",
];

const USE_CASES = [
  "Website Audits",
  "Keyword Research",
  "Competitor Research",
  "Content & SEO",
  "General SEO",
];

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
    verificationEmail,
    setVerificationEmail,
    completeOnboarding,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Onboarding state
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedUseCase, setSelectedUseCase] = useState(USE_CASES[0]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error("Google sign-in failed", { description: err.message || "Please try again." });
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      });
      if (error) {
        toast.error("GitHub sign-in failed", { description: error.message });
      }
    } catch (err: any) {
      toast.error("GitHub sign-in failed", { description: err.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = "Invalid email or password";
        if (error.message.includes("Email not confirmed")) {
          msg = "Please verify your email before signing in.";
          setVerificationEmail(email.trim());
          openAuthModal("verify_email");
        } else if (error.message.includes("Invalid login credentials")) {
          msg = "Incorrect email or password. Please try again.";
        }
        toast.error("Sign in failed", { description: msg });
      } else {
        toast.success("Welcome back to PNX!");
        closeAuthModal();
      }
    } catch (err: any) {
      toast.error("Sign in failed", { description: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password too short", { description: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes("already registered")) {
          msg = "This email is already registered. Please sign in instead.";
        }
        toast.error("Account creation failed", { description: msg });
      } else {
        if (data.session) {
          toast.success("Account created successfully!");
          closeAuthModal();
        } else {
          setVerificationEmail(email.trim());
          openAuthModal("verify_email");
        }
      }
    } catch (err: any) {
      toast.error("Account creation failed", { description: err.message || "An error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        toast.error("Password reset failed", { description: error.message });
      } else {
        setResetSent(true);
      }
    } catch (err: any) {
      toast.error("Error sending reset email", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: verificationEmail,
      });
      if (error) {
        toast.error("Failed to resend email", { description: error.message });
      } else {
        toast.success("Verification link resent! Check your inbox.");
      }
    } catch {
      toast.error("Resend failed. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeOnboarding(selectedRole, selectedUseCase);
      toast.success("Workspace ready! Welcome to PNX.");
    } catch {
      toast.error("Could not save preferences, but you can continue.");
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[410px] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-2xl max-h-[88dvh] overflow-y-auto overflow-x-hidden outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Top Brand Pill Header */}
        <div className="flex flex-col items-center text-center pt-1 mb-3">
          <div className="size-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-2 shadow-xs flex items-center justify-center mb-2.5">
            <img src={pnxLogo} alt="PNX Logo" className="size-full object-contain" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {authModalView === "signup"
              ? "Create your PNX account"
              : authModalView === "forgot_password"
              ? "Reset your password"
              : authModalView === "verify_email"
              ? "Verify your email"
              : authModalView === "onboarding"
              ? "Welcome to PNX"
              : "Welcome back to PNX"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[300px] leading-relaxed">
            {authModalView === "signup"
              ? "Your AI SEO workspace for research, audits and smarter decisions."
              : authModalView === "login"
              ? "Pick up where you left off in your PNX workspace."
              : authModalView === "onboarding"
              ? "Personalize your AI co-pilot in 10 seconds."
              : authModalView === "forgot_password"
              ? "Enter your email address and we'll send a password reset link."
              : "We sent a link to confirm your account."}
          </p>
        </div>

        {/* Views Router */}
        {authModalView === "verify_email" && (
          <div className="mt-2 space-y-4">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
              <Mail className="mx-auto size-7 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                Sent to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{verificationEmail || "your email"}</span>. Click the link in your email to active your account.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Resend Verification Email"}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("signup")}
              className="w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Change email or Back to Sign Up
            </button>
          </div>
        )}

        {authModalView === "forgot_password" && (
          <div className="mt-2 space-y-3">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-1"
            >
              <ArrowLeft className="size-3.5" /> Back to Sign In
            </button>

            {resetSent ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                <CheckCircle2 className="mx-auto size-6 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  Password reset link sent! Check your email inbox.
                </p>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="mt-3 w-full h-10 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-purple-600/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10.5 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        )}

        {authModalView === "onboarding" && (
          <form onSubmit={handleOnboardingSubmit} className="mt-2 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                What best describes your role?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`h-9 px-3 rounded-xl border text-xs font-medium transition-all text-left truncate flex items-center justify-between cursor-pointer ${
                      selectedRole === r
                        ? "border-purple-600 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold ring-1 ring-purple-600/30"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Primary SEO Goal
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => setSelectedUseCase(uc)}
                    className={`h-9 px-3 rounded-xl border text-xs font-medium transition-all text-left truncate flex items-center justify-between cursor-pointer ${
                      selectedUseCase === uc
                        ? "border-purple-600 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold ring-1 ring-purple-600/30"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{uc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10.5 mt-2 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Complete Setup & Launch PNX →"}
            </button>
          </form>
        )}

        {(authModalView === "login" || authModalView === "signup") && (
          <div className="mt-1 space-y-3.5">
            {/* Tab Toggle Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 mb-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authModalView === "login"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authModalView === "signup"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="h-10 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="h-10 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <GithubIcon />
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative my-2.5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400 dark:text-zinc-500 font-medium">
                  or with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form
              id="pnx-auth-form"
              onSubmit={authModalView === "signup" ? handleEmailSignUp : handleEmailSignIn}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-purple-600/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Password
                  </label>
                  {authModalView === "login" && (
                    <button
                      type="button"
                      onClick={() => openAuthModal("forgot_password")}
                      className="text-[11px] font-medium text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-purple-600/20 transition-all"
                />
              </div>

              {/* Main Submit Action inside Form */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10.5 mt-2 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-xs transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer relative z-10"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : authModalView === "signup" ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[10.5px] leading-relaxed text-zinc-400 dark:text-zinc-500">
              By continuing, you agree to PNX&apos;s{" "}
              <Link to="/terms" onClick={closeAuthModal} className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" onClick={closeAuthModal} className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};