import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Short summary shown on the collapsed header, e.g. "11 steps · 8 sources". */
  summary?: string;
  children: ReactNode;
};

/**
 * Single "Advanced" dropdown that hides the agent workflow trace and the
 * sources panel by default, so a turn stays compact in the chat.
 */
export function AdvancedDetails({ summary, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/35"
      >
        <span className="material-symbols-rounded text-[16px] leading-none text-[color:var(--brand)]" aria-hidden>
          manage_search
        </span>
        <span className="text-[13px] font-medium tracking-tight text-foreground/90">
          {open ? "Hide working & sources" : "Show working & sources"}
        </span>
        {summary && (
          <span className="ml-auto text-[11.5px] font-light tabular-nums text-muted-foreground">{summary}</span>
        )}
        <span
          className={cn(
            "material-symbols-rounded text-[18px] leading-none text-muted-foreground transition-transform",
            summary ? "" : "ml-auto",
            open && "rotate-180",
          )}
          aria-hidden
        >
          expand_more
        </span>
      </button>
      {open && <div className="border-t border-border/50 px-3 py-2.5">{children}</div>}
    </div>
  );
}
