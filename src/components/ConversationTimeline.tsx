import { useEffect, useState } from "react";
import type { UIMessage } from "ai";

type Props = {
  messages: UIMessage[];
  scrollContainer?: HTMLElement | null;
};

/**
 * Right-side progress rail. One marker per message. Click jumps to that
 * message; the marker closest to the viewport center stays highlighted via
 * IntersectionObserver (works whether the scroll container is window or a
 * Radix scroll area).
 */
export function ConversationTimeline({ messages }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [kbdHidden, setKbdHidden] = useState(false);

  useEffect(() => {
    if (messages.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observed: Element[] = [];
    const visibility = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visibility.set(e.target.id, e.intersectionRatio);
        let bestIdx = 0;
        let best = -1;
        for (let i = 0; i < messages.length; i++) {
          const r = visibility.get(`msg-${messages[i].id}`) ?? 0;
          if (r > best) { best = r; bestIdx = i; }
        }
        setActiveIdx(bestIdx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-30% 0px -30% 0px" }
    );
    for (const m of messages) {
      const el = document.getElementById(`msg-${m.id}`);
      if (el) { obs.observe(el); observed.push(el); }
    }
    return () => obs.disconnect();
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