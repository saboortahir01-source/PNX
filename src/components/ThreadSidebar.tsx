import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, MessageSquare, Home, BookOpen, HelpCircle } from "lucide-react";
import type { Thread } from "@/lib/threads";
import { cn } from "@/lib/utils";
import pnxLogo from "@/assets/pnx-logo.png";

type Props = {
  threads: Thread[];
  activeId: string;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export function ThreadSidebar({ threads, activeId, onNew, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <aside
      className="relative flex h-full w-72 flex-col border-r border-sidebar-border text-sidebar-foreground"
      style={{
        background: "color-mix(in oklab, white 55%, transparent)",
        backdropFilter: "saturate(180%) blur(22px)",
        WebkitBackdropFilter: "saturate(180%) blur(22px)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60" style={{ background: "radial-gradient(400px 200px at 30% 0%, oklch(0.66 0.18 265 / 0.18), transparent 70%)" }} />
      <div className="relative flex items-center gap-3 px-5 py-5">
        <Link to="/" className="flex items-center gap-3" aria-label="PNX home">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur">
            <img src={pnxLogo} alt="PNX agentic SEO tool" className="size-8 object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight">PNX</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/50">SEO Intelligence</span>
          </div>
        </Link>
      </div>
      <div className="relative px-3 pb-3">
        <button
          onClick={onNew}
          className="group flex w-full items-center justify-between rounded-lg border border-sidebar-border/70 bg-sidebar-accent/60 px-3 py-2.5 text-sm font-medium text-sidebar-accent-foreground transition-all hover:border-sidebar-primary/40 hover:bg-sidebar-accent"
        >
          <span className="flex items-center gap-2">
            <Plus className="size-3.5" /> New conversation
          </span>
          <span className="rounded border border-sidebar-border/60 px-1.5 py-0.5 text-[10px] text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80">⌘N</span>
        </button>
      </div>
      <div className="relative grid grid-cols-3 gap-1 px-3 pb-1">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/30 px-2 py-2 text-[10.5px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Home className="size-3.5" /> Home
        </Link>
        <Link
          to="/blog"
          className="flex flex-col items-center gap-1 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/30 px-2 py-2 text-[10.5px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <BookOpen className="size-3.5" /> Blog
        </Link>
        <Link
          to="/faq"
          className="flex flex-col items-center gap-1 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/30 px-2 py-2 text-[10.5px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <HelpCircle className="size-3.5" /> FAQ
        </Link>
      </div>
      <div className="relative px-5 pb-2 pt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/40">
        Conversations
      </div>
      <nav className="relative flex-1 overflow-y-auto px-2 pb-3">
        {threads.map((t) => {
          const isActive = t.id === activeId;
          return (
            <div
              key={t.id}
              className={cn(
                "group relative mb-0.5 flex items-center gap-1 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full" style={{ background: "var(--gradient-brand)" }} />
              )}
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2"
              >
                <MessageSquare className="size-3.5 shrink-0 opacity-60" />
                <span className="truncate text-[13px]">{t.title}</span>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (threads.length === 1) {
                    onDelete(t.id);
                    return;
                  }
                  onDelete(t.id);
                  if (isActive) {
                    const next = threads.find((x) => x.id !== t.id);
                    if (next) navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
                  }
                }}
                className="mr-1.5 hidden rounded-md p-1.5 text-sidebar-foreground/50 transition-colors hover:bg-destructive/90 hover:text-destructive-foreground group-hover:block"
                aria-label="Delete conversation"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </nav>
      <div className="relative border-t border-sidebar-border/60 px-5 py-4">
        <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/50">
          <span className="size-1.5 rounded-full bg-[color:var(--brand)] shadow-[0_0_8px_var(--brand)]" />
          History saved locally · private
        </div>
      </div>
    </aside>
  );
}