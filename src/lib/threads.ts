import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "seo-agent-threads-v1";

const isBrowser = () => typeof window !== "undefined";

export function loadThreads(): Thread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

export function newThreadId() {
  return (
    "t_" +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  );
}

export function createThread(): Thread {
  return {
    id: newThreadId(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function ensureBootstrap(): { threads: Thread[]; activeId: string } {
  const threads = loadThreads();
  if (threads.length === 0) {
    const t = createThread();
    saveThreads([t]);
    return { threads: [t], activeId: t.id };
  }
  return { threads, activeId: threads[0].id };
}

export function deriveTitle(messages: UIMessage[]): string | null {
  const first = messages.find((m) => m.role === "user");
  if (!first) return null;
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return null;
  return text.length > 60 ? text.slice(0, 57) + "..." : text;
}