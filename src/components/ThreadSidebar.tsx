import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, MessageSquare, Sparkle } from "lucide-react";
import type { Thread } from "@/lib/threads";
import { cn } from "@/lib/utils";

type Props = {
  threads: Thread[];
  activeId: string;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export function ThreadSidebar({ threads, activeId, onNew, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <aside className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60" style={{ background: "radial-gradient(400px 200px at 30% 0%, oklch(0.58 0.14 165 / 0.18), transparent 70%)" }} />
      <div className="relative flex items-center gap-3 px-5 py-5">
        <div
          className="flex size-9 items-center justify-center rounded-lg text-sidebar-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.58_0.14_165/0.6)]"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Sparkle className="size-4" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-lg tracking-tight">Atlas</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/50">SEO Intelligence</span>
        </div>
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