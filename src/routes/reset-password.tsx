import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — PNX SEO Agent" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error("Could not update password", { description: error.message });
      } else {
        setSuccess(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          navigate({ to: "/chat" });
        }, 2000);
      }
    } catch (err: any) {
      toast.error("Password update error", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-md w-full px-4 py-16 flex-1 flex flex-col justify-center">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-border/80 shadow-[var(--shadow-elegant)]">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-2xl bg-[color:var(--brand)]/15 text-[color:var(--brand)]">
            <KeyRound className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center">Set new password</h1>
          <p className="mt-1 text-xs text-muted-foreground text-center">
            Choose a secure password for your PNX account.
          </p>

          {success ? (
            <div className="mt-6 text-center space-y-3">
              <CheckCircle2 className="mx-auto size-8 text-emerald-500" />
              <p className="text-sm font-semibold text-foreground">Password updated!</p>
              <p className="text-xs text-muted-foreground">Redirecting to workspace…</p>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="mt-6 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--brand)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--brand)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 inline-flex items-center justify-center rounded-xl bg-foreground font-semibold text-xs text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}