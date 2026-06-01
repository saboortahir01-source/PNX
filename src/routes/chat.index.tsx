import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ensureBootstrap } from "@/lib/threads";
import pnxLogo from "@/assets/pnx-logo.png";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { activeId } = ensureBootstrap();
    navigate({ to: "/chat/$threadId", params: { threadId: activeId }, replace: true });
  }, [navigate]);
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-background"
      style={{ backgroundImage: "var(--gradient-surface)" }}
      role="status"
      aria-label="Loading PNX SEO agent"
    >
      <div className="glass flex size-20 items-center justify-center rounded-2xl shadow-[var(--shadow-elegant)]">
        <img
          src={pnxLogo}
          alt="PNX"
          className="size-14 object-contain animate-pulse"
          loading="eager"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Starting PNX SEO Agent
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Spinning up your private workspace…
        </p>
      </div>
      <div className="flex gap-1.5">
        <span className="size-1.5 animate-bounce rounded-full bg-[color:var(--brand)] [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[color:var(--brand)] [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-[color:var(--brand)]" />
      </div>
    </div>
  );
}