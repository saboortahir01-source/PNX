import type { UIMessage } from "ai";
import { POSTS } from "@/lib/blog-posts";

/** Pull the plain text out of the most recent user message. */
export function lastUserMessageText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    return (m.parts ?? [])
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ")
      .trim();
  }
  return "";
}

/**
 * Zero-API answers for trivial or brand-knowledge turns.
 * Every hit here is one fewer paid model call.
 */
export function cannedReply(raw: string): string | null {
  const t = raw.toLowerCase().trim().replace(/[!?.]+$/g, "");
  if (!t || t.length > 120) return null;

  if (/^(hi|hey|hello|yo|salam|assalam[ou]?[- ]?alaikum|good (morning|evening|afternoon))\b/.test(t)) {
    return "Hey — good to see you. I'm PNX, your SEO co-pilot.\n\nDrop me a URL and I'll audit it, or tell me what you're trying to rank for and we'll build the plan together. A few things I'm good at:\n\n- **Page audits** — paste any URL\n- **Keyword research** — with real search intent\n- **Competitor checks** — what's actually ranking right now\n- **YouTube SEO** — titles, descriptions, tags\n\nWhat are we working on?";
  }
  if (/^(thanks|thank you|thx|ty|shukriya|great|awesome|nice|perfect|ok|okay|cool)\b/.test(t)) {
    return "Anytime. Send over the next URL or keyword whenever you're ready.";
  }
  if (/^(bye|goodbye|see ya|later)\b/.test(t)) {
    return "Catch you later — your chats stay saved in this browser, so just pick up where you left off.";
  }
  if (/(who (made|built|created)|who'?s (the )?(founder|creator)|about (the )?founder|saboor)/.test(t)) {
    return "![Saboor Tahir — Founder of PNX](/saboor-tahir.png)\n\nPNX was built by **Saboor Tahir** — an independent founder and SEO strategist.\n\nThe idea was simple: pro-grade SEO shouldn't cost $99 a month. PNX is 100% free, with no daily caps; optional accounts are available (Email, Google, GitHub). It runs live page audits, keyword research, SERP analysis and YouTube SEO — all from this one chat.\n\nWant to see it in action? Paste a URL and I'll audit it right now.";
  }
  if (/(is (it|pnx) free|pricing|how much (does )?(it|pnx) cost|do i (have to )?pay|subscription)/.test(t)) {
    return "PNX is **100% free** — optional accounts are available (Email, Google, GitHub); there are no daily limits and no credit card required.\n\nYou get live page audits, keyword research, competitor and SERP analysis, YouTube SEO and content planning. Your chats stay in your browser's local storage by default; optional accounts let you save preferences and access additional features.\n\nWhat would you like to run first?";
  }
  if (/(what is pnx|what'?s pnx|about pnx|who are you|what (can|do) you do)$/.test(t)) {
    return "I'm **PNX** — a free agentic SEO co-pilot. Instead of handing you dashboards to decipher, I go and look at the live page, check what's actually ranking, and tell you in plain English what to change.\n\nHere's what I handle:\n\n- **Page audits** — paste a URL, get prioritised fixes\n- **Keyword research** — with intent and difficulty read\n- **Competitor & SERP analysis** — what the top results are doing\n- **YouTube SEO** — titles, descriptions, tags, thumbnails\n- **Content strategy** — briefs writers can actually follow\n\nPaste a URL or a keyword and we'll start.";
  }
  if (/(how (do i|to) use (this|pnx)|how does (this|pnx) work|getting started)/.test(t)) {
    return "Easiest way to start: **paste a URL** and say what you want from it.\n\nThree ways people usually use me:\n\n1. **\"Audit https://yoursite.com\"** — I fetch the live page and give you prioritised fixes.\n2. **\"What should I rank for in [your niche]?\"** — keyword research with real intent.\n3. **\"Who's beating me for [keyword]?\"** — I pull the top results and break down why they win.\n\nThere's also a mode picker under the message box: **Sonar 01** for deep technical audits, **Sonar 02** for content strategy and human-sounding copy.\n\nGo ahead — paste something.";
  }
  return null;
}

/**
 * Cheap, local recommendation engine: matches the user's message against
 * our own published guides and suggests them to the model as context.
 * No extra API call.
 */
export function recommendationContext(raw: string): string {
  const t = raw.toLowerCase();
  if (t.length < 8) return "";
  const scored = POSTS.map((p) => {
    const hay = `${p.title} ${p.keyword} ${p.category} ${p.description}`.toLowerCase();
    const words = Array.from(new Set(t.split(/[^a-z0-9]+/g).filter((w) => w.length > 3)));
    const score = words.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
    return { p, score };
  })
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return "";
  const list = scored.map(({ p }) => `- [${p.title}](/blog/${p.slug}) — ${p.description}`).join("\n");
  return `\n\n---\n\n## Relevant PNX guides (internal)\nIf it genuinely helps the user, end your reply with a short "Related reading" list linking 1–2 of these. Never force it.\n\n${list}`;
}

/** Emit a UI message stream for a locally generated answer (no model call). */
export function staticUiMessageStream(text: string): Response {
  const id = `msg_${Math.random().toString(36).slice(2)}`;
  const frames = [
    { type: "start" },
    { type: "start-step" },
    { type: "text-start", id },
    { type: "text-delta", id, delta: text },
    { type: "text-end", id },
    { type: "finish-step" },
    { type: "finish" },
  ];
  const body = frames.map((f) => `data: ${JSON.stringify(f)}\n\n`).join("") + "data: [DONE]\n\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "x-vercel-ai-ui-message-stream": "v1",
    },
  });
}