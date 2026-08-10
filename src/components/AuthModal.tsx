import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useAuth, type AuthModalView } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
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

// Apple Logo SVG
const AppleIcon = () => (
  <svg className="size-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87 1.28 0 2.85-1.07 4.38-.91 1.29.05 2.46.52 3.28 1.45-3.01 1.77-2.48 6.13.56 7.41-.65 1.58-1.52 3.16-2.62 4.8rem-2.28-2.73 3.1-3.6 3.32-3.7-.02-.02-.68-1.02-.68-2.48 0-1.89 1.53-2.84 1.6-2.89-1.28-1.87-3.27-2.09-3.97-2.14-1.68-.13-3.28 1.02-4.14 1.02-.87 0-2.17-.99-3.57-.96-1.84.03-3.53 1.06-4.48 2.71-1.92 3.33-.49 8.26 1.38 11.08.92 1.33 1.99 2.82 3.42 2.77 1.38-.05 1.89-.88 3.56-.88 1.67 0 2.13.88 3.58.85 1.48-.03 2.41-1.35 3.32-2.67.92-1.33 1.29-2.63 1.31-2.67-.03-.01-.39-.15-1.33-.61zM15.97 5.2c.74-.9 1.24-2.15 1.1-3.4-.1.01-1.35.48-2.19 1.48-.73.87-1.37 2.14-1.2 3.36 1.23.09 2.45-.49 2.29-1.44z" />
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Onboarding local state
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

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo },
      });
      if (error) {
        if (error.message.includes("provider is not enabled") || error.message.includes("Unsupported provider")) {
          toast.error("Apple Sign-In configuration required", {
            description: "To enable Apple Sign-In, configure Apple Provider in your Supabase Auth dashboard under Authentication -> Providers.",
          });
        } else {
          toast.error("Apple sign-in failed", { description: error.message });
        }
      }
    } catch (err: any) {
      toast.error("Apple sign-in failed", { description: err.message || "Please check configuration." });
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
          data: {
            full_name: fullName.trim() || undefined,
          },
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
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 border-border/80 bg-background/95 backdrop-blur-2xl shadow-[var(--shadow-elegant)]">
        {/* Official PNX Logo at top of every auth state */}
        <div className="flex justify-center mb-4 pt-1">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/30 p-2 shadow-xs">
            <img src={pnxLogo} alt="PNX Logo" className="size-full object-contain" />
          </div>
        </div>

        {/* Verification View */}
        {authModalView === "verify_email" && (
          <div className="text-center">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">Check your email</DialogTitle>
              <DialogDescription className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                We sent a verification link to{" "}
                <span className="font-semibold text-foreground">{verificationEmail || "your email"}</span>.
                Verify your email to continue to PNX.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-xs font-semibold text-foreground transition hover:bg-secondary/80 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Resend verification email"}
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="w-full text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Change email / Back to signup
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password View */}
        {authModalView === "forgot_password" && (
          <div>
            <button
              onClick={() => openAuthModal("login")}
              className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3" /> Back to Sign In
            </button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Reset password</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Enter your registered email address and we'll send you instructions to reset your password.
              </DialogDescription>
            </DialogHeader>

            {resetSent ? (
              <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                <CheckCircle2 className="mx-auto size-7 text-emerald-500 mb-2" />
                <p className="text-xs leading-relaxed text-foreground font-medium">
                  If an account exists for this email, we've sent password reset instructions.
                </p>
                <button
                  onClick={() => openAuthModal("login")}
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-foreground px-4 text-xs font-semibold text-background"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-5 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-1 focus:ring-[color:var(--brand)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-2 inline-flex items-center justify-center rounded-xl bg-foreground font-semibold text-xs text-background transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Onboarding View */}
        {authModalView === "onboarding" && (
          <div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">Welcome to PNX!</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Customize your workspace in 10 seconds.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleOnboardingSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  1. What best describes you?
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                        selectedRole === r
                          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  2. What do you mainly want to use PNX for?
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc}
                      type="button"
                      onClick={() => setSelectedUseCase(uc)}
                      className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition ${
                        selectedUseCase === uc
                          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {uc}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 inline-flex items-center justify-center rounded-xl bg-foreground font-semibold text-xs text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Enter PNX →"}
              </button>
            </form>
          </div>
        )}

        {/* Login / Signup Primary Views */}
        {(authModalView === "login" || authModalView === "signup") && (
          <div>
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Continue with PNX</DialogTitle>
              <DialogDescription className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Sign in to start your workspace and keep your chats, projects, and SEO research saved.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-2.5">
              {/* Google Button — Primary Social */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-border/80 bg-card px-4 text-xs font-semibold text-foreground shadow-xs transition hover:bg-accent disabled:opacity-50"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-border/80 bg-card px-4 text-xs font-semibold text-foreground shadow-xs transition hover:bg-accent disabled:opacity-50"
              >
                <AppleIcon />
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <span className="relative bg-background px-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                or continue with email
              </span>
            </div>

            <form onSubmit={authModalView === "signup" ? handleEmailSignUp : handleEmailSignIn} className="space-y-3">
              {authModalView === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Saboor Tahir"
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-1 focus:ring-[color:var(--brand)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-1 focus:ring-[color:var(--brand)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  {authModalView === "login" && (
                    <button
                      type="button"
                      onClick={() => openAuthModal("forgot_password")}
                      className="text-[11px] font-medium text-[color:var(--brand)] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-1 focus:ring-[color:var(--brand)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-1 inline-flex items-center justify-center rounded-xl bg-foreground font-semibold text-xs text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : authModalView === "signup" ? (
                  "Create account"
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              {authModalView === "login" ? (
                <p className="text-xs text-muted-foreground">
                  New to PNX?{" "}
                  <button
                    type="button"
                    onClick={() => openAuthModal("signup")}
                    className="font-semibold text-foreground hover:underline"
                  >
                    Create account
                  </button>
                </p>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="font-semibold text-foreground hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                  <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground/80">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" onClick={closeAuthModal} className="underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" onClick={closeAuthModal} className="underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};