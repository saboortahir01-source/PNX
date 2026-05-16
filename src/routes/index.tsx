import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ensureBootstrap } from "@/lib/threads";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { activeId } = ensureBootstrap();
    navigate({ to: "/chat/$threadId", params: { threadId: activeId }, replace: true });
  }, [navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Loading SEO Agent...
    </div>
  );
}
