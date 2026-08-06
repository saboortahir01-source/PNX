import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ai-elements/shimmer";
import type { PnxEvent, PnxResearchAsset } from "@/lib/pnx/agent-events";
import type { WorkflowStep } from "@/components/agent-run";

type Props = {
  events: PnxEvent[];
  steps: WorkflowStep[];
  live: boolean;
  onApprovePlan?: () => void;
};

/**
 * Minimal, ChatGPT-style live activity strip.
 *
 * Instead of a wall of phase chips + logs + panels, a working turn now shows at
 * most two quiet lines: what it's thinking about, and what it's touching right
 * now ("Searching 6 websites"). Everything else moves behind the Sources
 * footer once the turn completes.
 */
export function AgentActivity({ events, steps, live, onApprovePlan }: Props) {
  const view = useMemo(() => {
    let plan: Extract<PnxEvent, { kind: "plan" }> | null = null;
    let assets: PnxResearchAsset[] = [];
    for (const e of events) {
      if (e.kind === "plan") plan = e;
      else if (e.kind === "research") assets = e.assets;
    }
    return { plan, assets };
  }, [events]);

  const awaiting = Boolean(view.plan?.awaitingApproval && onApprovePlan);

  // Proposed plans still need a real card — the user has to approve them.
  if (awaiting && view.plan) {
    return (
      <div className="mb-3 rounded-2xl border border-border/60 bg-muted/25 p-3.5">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-rounded text-[16px] leading-none text-[color:var(--brand)]" aria-hidden>
            route
          </span>
          <h4 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">Proposed plan</h4>
        </div>
        <ol className="space-y-1">
          {view.plan.steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-snug text-foreground/85">
              <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="font-light">{s}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onApprovePlan}
          className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[color:var(--brand)] px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-rounded text-[16px] leading-none" aria-hidden>
            play_arrow
          </span>
          Run this plan
        </button>
      </div>
    );
  }

  if (!live) return null;

  const running = steps.find((s) => s.status === "active");
  const siteCount = view.assets.length;

  // One line of "what am I doing right now", in plain words.
  const action = running
    ? running.kind === "search"
      ? siteCount > 0
        ? `Searching ${siteCount} website${siteCount === 1 ? "" : "s"}`
        : "Searching the web"
      : running.kind === "crawl"
        ? `Reading ${running.detail ?? "the page"}`
        : running.kind === "serp"
          ? "Comparing the top results"
          : running.kind === "images"
            ? "Finding visuals"
            : running.label
    : siteCount > 0
      ? `Reviewing ${siteCount} source${siteCount === 1 ? "" : "s"}`
      : null;

  return (
    <div className="mb-2.5 space-y-1.5">
      <Shimmer as="div" className="text-[13.5px] font-light text-muted-foreground">
        Thinking
      </Shimmer>
      {action && (
        <div className="flex items-center gap-2 text-[13.5px] font-light text-muted-foreground">
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full",
              "bg-[color:var(--brand)]/15 text-[color:var(--brand)]",
            )}
            aria-hidden
          >
            <span className="material-symbols-rounded text-[12px] leading-none">travel_explore</span>
          </span>
          <span>{action}</span>
        </div>
      )}
    </div>
  );
}
