import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ensureBootstrap } from "@/lib/threads";

export const Route = createFileRoute("/chat")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { activeId } = ensureBootstrap();
    navigate({ to: "/chat/$threadId", params: { threadId: activeId }, replace: true });
  }, [navigate]);
  return <div className="flex min-h-[100dvh] items-center justify-center text-muted-foreground">Loading PNX…</div>;
}
