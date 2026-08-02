import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Link2 } from "lucide-react";
import type { Source } from "@/components/agent-run";

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;

/**
 * Professional citation panel listing every page the agent consulted this turn,
 * so users can verify the answer instead of reading raw tool JSON.
 */
export function SourcesPanel({ sources }: { sources: Source[] }) {
  const [expanded, setExpanded] = useState(false);
  if (sources.length === 0) return null;

  const visible = expanded ? sources : sources.slice(0, 6);
  const domains = [...new Set(sources.map((s) => s.domain))];

  return (
    <section className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3.5" aria-label="Sources">
      <header className="mb-2.5 flex items-center gap-2">
        <Link2 className="size-3.5 text-[color:var(--brand)]" />
        <h4 className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">Sources</h4>
        <span className="text-[11.5px] font-light text-muted-foreground/80">
          {sources.length} link{sources.length === 1 ? "" : "s"} · {domains.length} site
          {domains.length === 1 ? "" : "s"}
        </span>
      </header>

      <ol className="grid gap-2 sm:grid-cols-2">
        {visible.map((s, i) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={cn(
                "group flex h-full items-start gap-2.5 rounded-xl border border-border/50 bg-background/70 p-2.5",
                "transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand)]/40 hover:shadow-[var(--shadow-soft)]",
              )}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10.5px] font-semibold tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <img
                    src={favicon(s.domain)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="size-3.5 rounded-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <span className="truncate text-[11.5px] font-light text-muted-foreground">{s.domain}</span>
                  <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[13px] font-medium leading-snug tracking-tight text-foreground/90">
                  {s.title}
                </span>
                {s.snippet && (
                  <span className="mt-0.5 line-clamp-2 block text-[12px] font-light leading-snug text-muted-foreground">
                    {s.snippet}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {sources.length > 6 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 text-[12px] font-medium text-[color:var(--brand)] hover:underline"
        >
          {expanded ? "Show fewer sources" : `Show all ${sources.length} sources`}
        </button>
      )}
    </section>
  );
}
