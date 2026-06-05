import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";

type Props = {
  messages: UIMessage[];
  scrollContainer?: HTMLElement | null;
};

/**
 * Right-side progress rail. One marker per message. Click jumps to that
 * message; the marker closest to the viewport center stays highlighted.
 * Auto-hides on mobile when the on-screen keyboard is open.
 */
export function ConversationTimeline({ messages }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [kbdHidden, setKbdHidden] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Track active marker via scroll position
  useEffect(() => {
    if (messages.length === 0) return;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const center = window.innerHeight / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < messages.length; i++) {
          const el = document.getElementById(`msg-${messages[i].id}`);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const d = Math.abs(mid - center);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        }
        setActiveIdx(bestIdx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
  }, [messages]);

  // Hide on mobile when virtual keyboard is open
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const onResize = () => {
      const occluded = window.innerHeight - vv.height;
      setKbdHidden(occluded > 140);
    };
    onResize();
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  if (messages.length < 2) return null;

  return (
    <div
      className={`timeline-rail ${kbdHidden ? "kbd-hidden" : ""}`}
      aria-hidden={kbdHidden}
      role="navigation"
      aria-label="Conversation timeline"
    >
      {messages.map((m, i) => (
        <button
          key={m.id}
          onClick={() => {
            const el = document.getElementById(`msg-${m.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className={`timeline-mark ${m.role} ${i === activeIdx ? "active" : ""}`}
          title={`Message ${i + 1} · ${m.role === "user" ? "Your question" : "PNX response"}`}
          aria-label={`Jump to message ${i + 1}`}
        />
      ))}
    </div>
  );
}