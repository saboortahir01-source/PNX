import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";
import { ChatWindow } from "@/components/ChatWindow";
import { ThreadSidebar } from "@/components/ThreadSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
      { title: "PNX SEO AI Agent Chat — Free Audits" },
      {
        name: "description",
        content:
          "Chat with PNX, your free AI SEO agent. Run on-page SEO audits, cluster keywords, analyse SERP competitors, and generate content strategies instantly.",
      },
      { property: "og:title", content: "PNX SEO AI Agent Chat" },
      { property: "og:description", content: "Chat with PNX — run free AI SEO audits, keyword research, SERP analysis and content strategies." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pnx.lovable.app/chat" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function ChatPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  // Default closed on desktop for a focused, distraction-free chat surface.
  // Users can expand it on demand via the toggle in the header.
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div
        className="flex h-screen flex-col items-center justify-center gap-4 bg-background"
        style={{ backgroundImage: "var(--gradient-surface)" }}
        role="status"
        aria-label="Loading conversation"
      >
        <div className="glass flex size-16 items-center justify-center rounded-2xl shadow-[var(--shadow-elegant)]">
          <img src={pnxLogo} alt="PNX" className="size-12 object-contain animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your SEO workspace…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="hidden md:flex">
          <ThreadSidebar
            threads={threads}
            activeId={threadId}
            onNew={handleNew}
            onDelete={handleDelete}
          />
        </div>
      )}
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <h1 className="sr-only">PNX AI SEO Agent Chat</h1>
        {/* Unified top bar — visible on desktop & mobile so users know they're on PNX */}
        <header className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 glass">
          <div className="flex items-center gap-2">
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="hidden md:inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground transition-colors hover:bg-accent"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
            </button>
            {/* Mobile sidebar trigger */}
            <Sheet>
              <SheetTrigger
                aria-label="Open conversations"
                className="md:hidden inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground"
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
            <Link to="/" className="flex items-center gap-2" aria-label="PNX home">
              <img src={pnxLogo} alt="PNX" className="size-7 rounded-lg" />
              <span className="text-sm font-semibold tracking-tight">PNX</span>
              <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-widest text-muted-foreground">SEO Agent</span>
            </Link>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/" className="hidden sm:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">Home</Link>
            <Link to="/blog" className="hidden sm:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">Blog</Link>
            <Link to="/about" className="hidden md:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">About</Link>
            <Link to="/faq" className="hidden md:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">FAQ</Link>
            <button
              onClick={handleNew}
              className="ml-1 cta-glass !py-1.5 !px-3 !text-xs"
              aria-label="New chat"
            >
              + New
            </button>
          </nav>
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