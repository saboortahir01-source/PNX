import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain,
  Search,
  Globe,
  Images,
  BarChart3,
  ScanText,
  PenLine,
  Check,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { WorkflowStep } from "@/components/agent-run";

const ICONS = {
  understand: Brain,
  search: Search,
  crawl: Globe,
  images: Images,
  serp: BarChart3,
  analyze: ScanText,
  compose: PenLine,
} as const;

/**
 * Structured, human-readable trace of what the agent did this turn:
 * understand → search / crawl → analyse → compose. Replaces raw JSON dumps.
 */
export function AgentWorkflow({ steps }: { steps: WorkflowStep[] }) {
  const [open, setOpen] = useState(true);
  if (steps.length === 0) return null;

  const done = steps.filter((s) => s.status === "done").length;
  const active = steps.find((s) => s.status === "active");
  const failed = steps.some((s) => s.status === "error");

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-border/60 bg-muted/25 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
      >
        <ChevronRight className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
        <span className="text-[13px] font-medium tracking-tight text-foreground/90">
          {active ? active.label : failed ? "Workflow finished with issues" : "Agent workflow"}
        </span>
        <span className="ml-auto shrink-0 text-[11.5px] font-light tabular-nums text-muted-foreground">
          {done}/{steps.length} steps
        </span>
      </button>

      {open && (
        <ol className="space-y-0 border-t border-border/50 px-3.5 py-2">
          {steps.map((s, i) => {
            const Icon = ICONS[s.kind];
            const last = i === steps.length - 1;
            return (
              <li key={s.id} className="relative flex gap-3 pb-2.5 last:pb-0">
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[13px] top-7 bottom-0 w-px bg-gradient-to-b from-border to-transparent"
                  />
                )}
                <span
                  className={cn(
                    "mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full ring-1 transition-colors",
                    s.status === "done" && "bg-[color:var(--brand)]/12 text-[color:var(--brand)] ring-[color:var(--brand)]/25",
                    s.status === "active" && "bg-[color:var(--brand)]/15 text-[color:var(--brand)] ring-[color:var(--brand)]/40",
                    s.status === "pending" && "bg-muted text-muted-foreground/60 ring-border/60",
                    s.status === "error" && "bg-destructive/10 text-destructive ring-destructive/30",
                  )}
                >
                  {s.status === "active" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : s.status === "done" ? (
                    <Check className="size-3.5" strokeWidth={2.6} />
                  ) : s.status === "error" ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                      className={cn(
                        "text-[13px] tracking-tight",
                        s.status === "pending" ? "font-light text-muted-foreground" : "font-medium text-foreground/90",
                      )}
                    >
                      {s.label}
                    </span>
                    {s.meta && (
                      <span className="rounded-full bg-muted px-1.5 py-px text-[10.5px] font-light text-muted-foreground">
                        {s.meta}
                      </span>
                    )}
                  </div>
                  {s.detail && (
                    <p className="mt-0.5 truncate text-[12px] font-light text-muted-foreground">{s.detail}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
