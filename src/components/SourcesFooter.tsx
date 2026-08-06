import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Source, WorkflowStep } from "@/components/agent-run";

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;

type Props = {
  sources: Source[];
  steps: WorkflowStep[];
  confidence?: { score: number; basis: string } | null;
};

/**
 * Compact end-of-turn footer. Collapsed it is a single chip: three stacked
 * favicons + the word "Sources". Expanded it shows a dense, space-efficient
 * list of every page consulted plus a one-line-per-step trace of the working.
 */
export function SourcesFooter({ sources, steps, confidence }: Props) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0 && steps.length === 0) return null;

  const domains = [...new Set(sources.map((s) => s.domain))];
  const stack = domains.slice(0, 3);

  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex min-h-[32px] items-center gap-2 rounded-full px-1.5 text-[12.5px] font-light text-muted-foreground transition-colors hover:text-foreground"
      >
        {stack.length > 0 && (
          <span className="flex -space-x-1.5" aria-hidden>
            {stack.map((d) => (
              <img
                key={d}
                src={favicon(d)}
                alt=""
                loading="lazy"
                className="size-4 rounded-full bg-background ring-1 ring-border/70"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
            ))}
          </span>
        )}
        <span>{sources.length > 0 ? "Sources" : "How I worked this out"}</span>
        {sources.length > 0 && <span className="tabular-nums opacity-70">{sources.length}</span>}
        <span
          className={cn(
            "material-symbols-rounded text-[16px] leading-none opacity-60 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="mt-2 space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3">
          {sources.length > 0 && (
            <ol className="divide-y divide-border/40">
              {sources.map((s, i) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group flex items-center gap-2.5 py-1.5 transition-colors hover:text-foreground"
                  >
                    <span className="w-4 shrink-0 text-right text-[10.5px] tabular-nums text-muted-foreground/70">
                      {i + 1}
                    </span>
                    <img
                      src={favicon(s.domain)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="size-3.5 shrink-0 rounded-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-light text-foreground/85 group-hover:underline">
                      {s.title}
                    </span>
                    <span className="shrink-0 text-[11px] font-light text-muted-foreground/80">{s.domain}</span>
                  </a>
                </li>
              ))}
            </ol>
          )}

          {steps.length > 0 && (
            <div className={cn(sources.length > 0 && "border-t border-border/50 pt-2.5")}>
              <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                Working
              </p>
              <ul className="space-y-0.5">
                {steps.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 text-[12.5px] font-light text-muted-foreground">
                    <span
                      className={cn(
                        "material-symbols-rounded text-[13px] leading-none",
                        s.status === "error" ? "text-destructive" : "text-[color:var(--brand)]",
                      )}
                      aria-hidden
                    >
                      {s.status === "error" ? "error" : "check_small"}
                    </span>
                    <span className="truncate">
                      {s.label}
                      {s.detail ? ` — ${s.detail}` : ""}
                      {s.meta ? ` (${s.meta})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {confidence && (
            <p className="border-t border-border/50 pt-2 text-[11.5px] font-light text-muted-foreground">
              Confidence {Math.round(confidence.score * 100)}% — {confidence.basis}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
