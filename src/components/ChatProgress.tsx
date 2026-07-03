import { useEffect, useState } from "react";
import { Shimmer } from "@/components/ai-elements/shimmer";

const STEPS = [
  "Reading your question",
  "Searching the live web",
  "Scanning the top results",
  "Checking SEO, UX and technical signals",
  "Compiling clear, human recommendations",
];

type Props = { status: "submitted" | "streaming" };

/**
 * Lightweight, honest progress indicator shown while the agent is working.
 * - Rotates through plain-English steps so users know something is happening.
 * - Uses an indeterminate progress bar (no fake percentages).
 */
export function ChatProgress({ status }: Props) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (status !== "submitted") return;
    const t = setInterval(() => setI((n) => (n + 1) % STEPS.length), 1600);
    return () => clearInterval(t);
  }, [status]);

  const label = status === "streaming" ? "Writing your answer" : STEPS[i];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-2 rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-2.5"
    >
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground/90">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[color:var(--brand)] opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-[color:var(--brand)]" />
        </span>
        <Shimmer as="span" className="text-[13px]">{`${label}…`}</Shimmer>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-border/40">
        <div className="h-full w-1/3 animate-[chat-progress_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[color:var(--brand)] to-transparent" />
      </div>
    </div>
  );
}
