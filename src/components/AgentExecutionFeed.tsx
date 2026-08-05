import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PHASE_LABEL, type PnxEvent, type PnxPhase, type PnxResearchAsset } from "@/lib/pnx/agent-events";

const PHASE_ORDER: PnxPhase[] = ["planning", "researching", "analyzing", "composing"];

const LEVEL_ICON = {
  ok: "check_circle",
  info: "arrow_forward",
  warn: "warning",
  error: "error",
} as const;

const LEVEL_CLASS = {
  ok: "text-[color:var(--brand)]",
  info: "text-muted-foreground",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-destructive",
} as const;

type Props = {
  events: PnxEvent[];
  live: boolean;
  onApprovePlan?: () => void;
};

/**
 * PNX v2.0 execution feed — the visible half of the Shared Agent State.
 * Shows phase, live logs, the plan (with approval for complex jobs), the
 * research assets being collected, and a confidence read on the answer.
 */
export function AgentExecutionFeed({ events, live, onApprovePlan }: Props) {
  const [showResearch, setShowResearch] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const view = useMemo(() => {
    let phase: PnxPhase | null = null;
    let plan: Extract<PnxEvent, { kind: "plan" }> | null = null;
    let confidence: Extract<PnxEvent, { kind: "confidence" }> | null = null;
    let assets: PnxResearchAsset[] = [];
    const logs: Extract<PnxEvent, { kind: "log" }>[] = [];
    const notes: string[] = [];
    for (const e of events) {
      if (e.kind === "phase") phase = e.phase;
      else if (e.kind === "plan") plan = e;
      else if (e.kind === "confidence") confidence = e;
      else if (e.kind === "research") assets = e.assets;
      else if (e.kind === "log") logs.push(e);
      else if (e.kind === "note") notes.push(e.text);
    }
    return { phase, plan, confidence, assets, logs, notes };
  }, [events]);

  if (events.length === 0) return null;
  const { phase, plan, confidence, assets, logs, notes } = view;
  // Once the turn is no longer streaming, every phase is finished — never
  // leave the rail stuck on "Researching" while the answer is already there.
  const finished = !live || phase === "done";
  const activeIndex = finished ? PHASE_ORDER.length : PHASE_ORDER.indexOf(phase ?? "planning");

  return (
    <div className="mb-3 space-y-2.5">
      {/* Phase rail — live only. Completed turns collapse to one quiet chip. */}
      {finished ? (
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
          <span className="material-symbols-rounded text-[15px] leading-none text-[color:var(--brand)]" aria-hidden>
            task_alt
          </span>
          <span>Completed</span>
          {confidence && (
            <span className="rounded-full bg-[color:var(--brand)]/10 px-1.5 py-px text-[10.5px] tabular-nums text-[color:var(--brand)]">
              {Math.round(confidence.score * 100)}% confidence
            </span>
          )}
        </div>
      ) : (
      <div className="flex flex-wrap items-center gap-1.5">
        {PHASE_ORDER.map((p, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <span
              key={p}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider transition-colors",
                done && "bg-[color:var(--brand)]/10 text-[color:var(--brand)]",
                current && "bg-[color:var(--brand)]/18 text-[color:var(--brand)] ring-1 ring-[color:var(--brand)]/30",
                !done && !current && "bg-muted text-muted-foreground/60",
              )}
            >
              {current && (
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-1.5 animate-ping rounded-full bg-[color:var(--brand)] opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[color:var(--brand)]" />
                </span>
              )}
              {PHASE_LABEL[p]}
            </span>
          );
        })}
      </div>
      )}

      {/* Plan */}
      {plan && (
        <div className="rounded-2xl border border-border/60 bg-muted/25 p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-rounded text-[16px] leading-none text-[color:var(--brand)]" aria-hidden>
              route
            </span>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
              {plan.awaitingApproval ? "Proposed plan" : "Plan"}
            </h4>
            <span className="ml-auto rounded-full bg-muted px-1.5 py-px text-[10.5px] font-light text-muted-foreground">
              {plan.intent}
            </span>
          </div>
          <ol className="space-y-1">
            {plan.steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-foreground/85">
                <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="font-light">{s}</span>
              </li>
            ))}
          </ol>
          {plan.awaitingApproval && onApprovePlan && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onApprovePlan}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[color:var(--brand)] px-3.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                <span className="material-symbols-rounded text-[16px] leading-none" aria-hidden>
                  play_arrow
                </span>
                Run this plan
              </button>
              <span className="self-center text-[12px] font-light text-muted-foreground">
                or tell me what to change
              </span>
            </div>
          )}
        </div>
      )}

      {/* Compact activity line while working — one informative line, never a wall of logs */}
      {live && logs.length > 0 && (
        <p className="flex items-start gap-2 pl-1 text-[12.5px] font-light leading-snug text-muted-foreground">
          <span
            className={cn(
              "material-symbols-rounded mt-px text-[14px] leading-none",
              LEVEL_CLASS[logs[logs.length - 1]!.level],
            )}
            aria-hidden
          >
            {LEVEL_ICON[logs[logs.length - 1]!.level]}
          </span>
          {logs[logs.length - 1]!.text}
        </p>
      )}

      {notes.map((n, i) => (
        <p key={i} className="pl-1 text-[12.5px] font-light italic text-muted-foreground">
          {n}
        </p>
      ))}

      {/* Live research assets */}
      {assets.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-muted/20">
          <button
            type="button"
            onClick={() => setShowResearch((v) => !v)}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left"
            aria-expanded={showResearch}
          >
            <span className="material-symbols-rounded text-[16px] leading-none text-[color:var(--brand)]" aria-hidden>
              database
            </span>
            <span className="text-[12.5px] font-medium text-foreground/85">Research collected</span>
            <span className="ml-auto text-[11.5px] font-light tabular-nums text-muted-foreground">
              {assets.length} source{assets.length === 1 ? "" : "s"}
            </span>
            <span
              className={cn(
                "material-symbols-rounded text-[16px] leading-none text-muted-foreground transition-transform",
                showResearch && "rotate-180",
              )}
              aria-hidden
            >
              expand_more
            </span>
          </button>
          {showResearch && (
            <ul className="space-y-1 border-t border-border/50 px-3.5 py-2">
              {assets.map((a) => (
                <li key={a.url} className="flex items-center gap-2 text-[12.5px]">
                  <span className="truncate font-light text-muted-foreground">{a.domain}</span>
                  <span className="ml-auto shrink-0 tabular-nums text-[11px] text-muted-foreground/80">
                    {a.credibility}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium",
                      a.trusted
                        ? "bg-[color:var(--brand)]/12 text-[color:var(--brand)]"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {a.trusted ? "trusted" : "checked"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Advanced — execution log + confidence, collapsed by default so chat stays clean */}
      {(logs.length > 0 || confidence) && (
        <div className="rounded-2xl border border-border/60 bg-muted/20">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left"
            aria-expanded={showAdvanced}
          >
            <span className="material-symbols-rounded text-[16px] leading-none text-[color:var(--brand)]" aria-hidden>
              manage_search
            </span>
            <span className="text-[12.5px] font-medium text-foreground/85">How I worked this out</span>
            {confidence && (
              <span className="rounded-full bg-[color:var(--brand)]/10 px-1.5 py-px text-[10.5px] font-medium tabular-nums text-[color:var(--brand)]">
                Confidence {Math.round(confidence.score * 100)}%
              </span>
            )}
            <span className="ml-auto text-[11.5px] font-light tabular-nums text-muted-foreground">
              {logs.length} step{logs.length === 1 ? "" : "s"}
            </span>
            <span
              className={cn(
                "material-symbols-rounded text-[16px] leading-none text-muted-foreground transition-transform",
                showAdvanced && "rotate-180",
              )}
              aria-hidden
            >
              expand_more
            </span>
          </button>
          {showAdvanced && (
            <div className="space-y-2.5 border-t border-border/50 px-3.5 py-2.5">
              <ul className="space-y-1">
                {logs.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] font-light leading-snug">
                    <span
                      className={cn("material-symbols-rounded mt-px text-[14px] leading-none", LEVEL_CLASS[l.level])}
                      aria-hidden
                    >
                      {LEVEL_ICON[l.level]}
                    </span>
                    <span
                      className={cn(
                        l.level === "warn" || l.level === "error" ? "text-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {l.text}
                    </span>
                  </li>
                ))}
              </ul>
              {confidence && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Confidence
                    </span>
                    <span className="text-[12.5px] font-medium tabular-nums text-foreground/85">
                      {Math.round(confidence.score * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border/50">
                    <div
                      className="h-full rounded-full bg-[color:var(--brand)] transition-all"
                      style={{ width: `${Math.round(confidence.score * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11.5px] font-light leading-snug text-muted-foreground">{confidence.basis}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}