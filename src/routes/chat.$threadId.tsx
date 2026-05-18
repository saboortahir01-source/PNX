import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";
import { ChatWindow } from "@/components/ChatWindow";
import { ThreadSidebar } from "@/components/ThreadSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import pnxLogo from "@/assets/pnx-logo.png";
import {
  createThread,
  deriveTitle,
  loadThreads,
  saveThreads,
  type Thread,
} from "@/lib/threads";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "SEO AI Agent" },
      {
        name: "description",
        content:
          "Chat with an SEO expert AI. Audit URLs, generate content, cluster keywords, and analyze SERPs.",
      },
    ],
  }),
});

function ChatPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[] | null>(null);

  // Bootstrap from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = loadThreads();
    if (existing.length === 0) {
      const t = createThread();
      saveThreads([t]);
      setThreads([t]);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      return;
    }
    if (!existing.find((t) => t.id === threadId)) {
      // unknown thread id: create with that id so URL stays stable
      const t: Thread = {
        id: threadId,
        title: "New conversation",
        updatedAt: Date.now(),
        messages: [],
      };
      const next = [t, ...existing];
      saveThreads(next);
      setThreads(next);
      return;
    }
    setThreads(existing);
  }, [threadId, navigate]);

  const activeThread = useMemo(
    () => threads?.find((t) => t.id === threadId) ?? null,
    [threads, threadId],
  );

  const handleNew = useCallback(() => {
    const t = createThread();
    setThreads((prev) => {
      const next = [t, ...(prev ?? [])];
      saveThreads(next);
      return next;
    });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }, [navigate]);

  const handleDelete = useCallback(
    (id: string) => {
      setThreads((prev) => {
        const filtered = (prev ?? []).filter((t) => t.id !== id);
        if (filtered.length === 0) {
          const t = createThread();
          saveThreads([t]);
          navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
          return [t];
        }
        saveThreads(filtered);
        return filtered;
      });
    },
    [navigate],
  );

  const handleMessagesChange = useCallback(
    (messages: UIMessage[]) => {
      setThreads((prev) => {
        if (!prev) return prev;
        let changed = false;
        const next = prev.map((t) => {
          if (t.id !== threadId) return t;
          if (t.messages === messages) return t;
          changed = true;
          const newTitle =
            t.title === "New conversation"
              ? deriveTitle(messages) ?? t.title
              : t.title;
          return { ...t, messages, title: newTitle, updatedAt: Date.now() };
        });
        if (changed) saveThreads(next);
        return changed ? next : prev;
      });
    },
    [threadId],
  );

  if (!threads || !activeThread) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background">
      <div className="hidden md:flex">
        <ThreadSidebar
          threads={threads}
          activeId={threadId}
          onNew={handleNew}
          onDelete={handleDelete}
        />
      </div>
      <main className="flex h-full min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 md:hidden glass">
          <Sheet>
            <SheetTrigger
              aria-label="Open conversations"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[19rem] border-r-0 p-0">
              <VisuallyHidden>
                <SheetTitle>Conversations</SheetTitle>
              </VisuallyHidden>
              <ThreadSidebar
                threads={threads}
                activeId={threadId}
                onNew={handleNew}
                onDelete={handleDelete}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <img src={pnxLogo} alt="PNX" className="size-7 rounded-lg" />
            <span className="text-sm font-semibold tracking-tight">PNX</span>
          </div>
          <div className="size-9" aria-hidden />
        </header>
        <ChatWindow
          key={threadId}
          threadId={threadId}
          initialMessages={activeThread.messages}
          onMessagesChange={handleMessagesChange}
        />
      </main>
    </div>
  );
}