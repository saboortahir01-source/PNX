import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, MessageSquare, Search } from "lucide-react";
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
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Search className="size-4" />
        </div>
        <div className="text-sm font-semibold">SEO Agent</div>
      </div>
      <div className="p-2">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sm font-medium text-sidebar-accent-foreground transition-colors hover:opacity-90"
        >
          <Plus className="size-4" /> New conversation
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {threads.map((t) => {
          const isActive = t.id === activeId;
          return (
            <div
              key={t.id}
              className={cn(
                "group mb-1 flex items-center gap-1 rounded-md text-sm",
                isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
              )}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2"
              >
                <MessageSquare className="size-3.5 shrink-0 opacity-70" />
                <span className="truncate">{t.title}</span>
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
                className="mr-1 hidden rounded p-1.5 text-sidebar-foreground/60 hover:bg-destructive hover:text-destructive-foreground group-hover:block"
                aria-label="Delete conversation"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] text-sidebar-foreground/60">
        History is saved in this browser only.
      </div>
    </aside>
  );
}