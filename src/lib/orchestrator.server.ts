/**
 * PNX v2.0 — Orchestrator / Decision Engine + Shared Agent State.
 *
 * The Shared Agent State is a request-scoped object every module reads from
 * and writes to. The orchestrator observes it, decides the next action, acts,
 * and records the outcome. Intent detection, classification and planning are
 * deliberately deterministic (zero model calls) so the "thinking" layer costs
 * nothing — model credits are spent only on the actual answer.
 */

import { fetchPage, webSearch, type SearchResult } from "@/lib/seo-tools.server";
import { trustedDomains } from "@/lib/knowledge-cache.server";
import type { PnxEvent, PnxPhase, PnxResearchAsset } from "@/lib/pnx/agent-events";

export type TaskType =
  | "page_audit"
  | "competitor_analysis"
  | "keyword_research"
  | "serp_analysis"
  | "content_strategy"
  | "youtube_seo"
  | "local_seo"
  | "general_seo"
  | "conversational";

export type Intent = {
  raw: string;
  taskType: TaskType;
  label: string;
  urls: string[];
  topic: string;
  complex: boolean;
  ambiguous: boolean;
  needsResearch: boolean;
};

export type SharedAgentState = {
  requestId: string;
  startedAt: number;
  intent: Intent | null;
  plan: string[];
  toolsUsed: string[];
  assets: Map<string, PnxResearchAsset>;
  notes: string[];
  cacheHit: boolean;
  errors: string[];
  emit: (event: PnxEvent) => void;
};

export function createAgentState(emit: (event: PnxEvent) => void): SharedAgentState {
  return {
    requestId: `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    startedAt: Date.now(),
    intent: null,
    plan: [],
    toolsUsed: [],
    assets: new Map(),
    notes: [],
    cacheHit: false,
    errors: [],
    emit,
  };
}

export function phase(state: SharedAgentState, next: PnxPhase) {
  state.emit({ kind: "phase", phase: next });
}

export function log(state: SharedAgentState, level: PnxEvent extends { level: infer L } ? L : never, text: string) {
  state.emit({ kind: "log", level, text });
}

const URL_RE = /\bhttps?:\/\/[^\s<>")]+|\bwww\.[^\s<>")]+/gi;

/** Step 1 — Intent detection. Deterministic, no model call. */
export function detectIntent(raw: string): Intent {
  const text = raw.trim();
  const t = text.toLowerCase();
  const urls = Array.from(new Set((text.match(URL_RE) ?? []).map((u) => (u.startsWith("http") ? u : `https://${u}`))));

  const has = (re: RegExp) => re.test(t);

  let taskType: TaskType = "conversational";
  let label = "General question";

  if (has(/youtube|video (seo|title|description|tag)|thumbnail|watch time/)) {
    taskType = "youtube_seo";
    label = "YouTube SEO";
  } else if (has(/\b(competitor|rival|vs\.?|compare|beating me|outrank)/)) {
    taskType = "competitor_analysis";
    label = "Competitor analysis";
  } else if (has(/\bserp\b|top (results|ranking)|who ranks|what'?s ranking|first page/)) {
    taskType = "serp_analysis";
    label = "SERP analysis";
  } else if (has(/keyword|search volume|long[- ]tail|intent cluster|what should i rank/)) {
    taskType = "keyword_research";
    label = "Keyword research";
  } else if (urls.length > 0 || has(/\baudit\b|analy[sz]e (my|this|the) (site|page)|on[- ]page|technical seo/)) {
    taskType = "page_audit";
    label = "Technical SEO audit";
  } else if (has(/content (plan|strategy|calendar|brief)|blog (plan|ideas)|topic cluster|write .*(article|blog|post)/)) {
    taskType = "content_strategy";
    label = "Content strategy";
  } else if (has(/local seo|google business|near me|map pack|gbp\b/)) {
    taskType = "local_seo";
    label = "Local SEO";
  } else if (has(/seo|ranking|backlink|schema|crawl|index|traffic|google/)) {
    taskType = "general_seo";
    label = "SEO guidance";
  }

  const needsResearch =
    urls.length > 0 ||
    (taskType !== "conversational" &&
      taskType !== "content_strategy" &&
      taskType !== "general_seo") ||
    has(/latest|current|right now|2025|2026|news|trending|research|find|search/);

  // Complex = more than one distinct deliverable, or an explicit multi-target ask.
  const complex =
    urls.length > 1 ||
    (urls.length > 0 && has(/\b(and|then|also|plus)\b.*\b(competitor|keyword|content|serp|compare|strategy)\b/)) ||
    has(/\b(compare|versus|vs\.?)\b.*\b(competitor|site|page)/) ||
    has(/\b(top|best)\s*\d+\b.*\bcompetitor/) ||
    has(/full (audit|strategy|plan).*(competitor|keyword|content)/);

  // Ambiguous = an SEO ask with no target, no topic and no detail to act on.
  const ambiguous =
    taskType !== "conversational" &&
    urls.length === 0 &&
    text.split(/\s+/).length <= 6 &&
    has(/^(make|improve|fix|help|boost|grow|optimi[sz]e|rank)\b/) &&
    !has(/[a-z0-9-]+\.[a-z]{2,}/);

  const topic = text.replace(URL_RE, "").replace(/\s+/g, " ").trim().slice(0, 180);

  return { raw: text, taskType, label, urls, topic, complex, ambiguous, needsResearch };
}

/** Step 2 — Task classification & planning (query decomposition). */
export function buildPlan(intent: Intent): string[] {
  const host = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return u;
    }
  };

  switch (intent.taskType) {
    case "page_audit":
      return [
        ...intent.urls.map((u) => `Crawl ${host(u)} and capture its live on-page structure`),
        ...(intent.urls.length === 0 ? ["Identify the target page from your request"] : []),
        "Check titles, meta, headings, schema and link balance",
        "Benchmark against what currently ranks for the same intent",
        "Write prioritised fixes grouped by effort and impact",
      ];
    case "competitor_analysis":
      return [
        intent.urls[0] ? `Crawl your page (${host(intent.urls[0])})` : "Establish your current position",
        "Find the pages actually ranking for this topic",
        "Crawl the top competitors and extract their structure",
        "Run a gap analysis: content depth, keywords, schema, intent match",
        "Turn the gaps into a ranked action list",
      ];
    case "keyword_research":
      return [
        "Map the topic to real searcher intent",
        "Pull live results to see what Google rewards for it",
        "Cluster keywords by intent and difficulty",
        "Recommend the pages to build or rewrite first",
      ];
    case "serp_analysis":
      return [
        "Search the query and capture the current top results",
        "Crawl the leading pages for structure and depth",
        "Compare what the winners share",
        "Explain what it takes to break in",
      ];
    case "youtube_seo":
      return [
        "Read the topic and target audience",
        "Check what's ranking and getting suggested for it",
        "Write titles, description and tags built for click-through",
        "Add a thumbnail and watch-time plan",
      ];
    case "content_strategy":
      return [
        "Clarify the audience and business goal",
        "Map the topic clusters worth owning",
        "Sequence the calendar by effort and payoff",
        "Write briefs a writer can follow",
      ];
    case "local_seo":
      return [
        "Review the service area and category",
        "Check what local competitors are doing",
        "Fix listing, review and on-page location signals",
        "Set the weekly routine that keeps rankings",
      ];
    default:
      return [
        "Understand what you're really asking for",
        intent.needsResearch ? "Pull current, real-world data" : "Draw on established SEO practice",
        "Write a clear, actionable answer",
      ];
  }
}

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0]?.toLowerCase() ?? url;
  }
}

/** Step 6 — Source credibility scoring against the trusted-domain library. */
export async function scoreSources(
  state: SharedAgentState,
  results: { url: string; title: string; snippet?: string }[],
): Promise<PnxResearchAsset[]> {
  const trusted = await trustedDomains().catch(() => new Map<string, number>());
  const assets = results.map((r) => {
    const domain = domainOf(r.url);
    const authority = trusted.get(domain);
    // Baseline heuristic when the domain isn't in the library yet.
    const baseline = /\.(gov|edu)$/.test(domain) ? 90 : /\.(org)$/.test(domain) ? 70 : 60;
    const credibility = authority ?? baseline;
    return { url: r.url, domain, title: r.title || domain, credibility, trusted: authority !== undefined };
  });
  for (const a of assets) state.assets.set(a.url, a);
  if (assets.length > 0) state.emit({ kind: "research", assets: [...state.assets.values()] });
  return assets;
}

/**
 * Step 5 — Search strategy with intelligent retry.
 * Refine → broaden, logging each attempt so the user sees the recovery.
 */
export async function searchWithRetry(
  state: SharedAgentState,
  query: string,
  limit: number,
): Promise<SearchResult[]> {
  const attempts: string[] = [query];
  const refined = query.replace(/["']/g, "").replace(/\s+/g, " ").trim();
  if (refined !== query) attempts.push(refined);
  // Broaden: drop the tail qualifiers and keep the head noun phrase.
  const broad = refined.split(/\s+/).slice(0, 4).join(" ");
  if (broad && broad !== refined) attempts.push(broad);

  for (let i = 0; i < attempts.length; i++) {
    const q = attempts[i];
    try {
      const results = await webSearch(q, limit);
      if (results.length > 0) {
        state.emit({
          kind: "log",
          level: "ok",
          text: `Found ${results.length} source${results.length === 1 ? "" : "s"} for “${q}”`,
        });
        await scoreSources(state, results);
        return results;
      }
      state.emit({
        kind: "log",
        level: "warn",
        text:
          i < attempts.length - 1
            ? `“${q}” returned nothing — retrying with a ${i === 0 ? "refined" : "broader"} query…`
            : `“${q}” returned nothing.`,
      });
    } catch (err) {
      state.errors.push((err as Error).message);
      state.emit({
        kind: "log",
        level: i < attempts.length - 1 ? "warn" : "error",
        text:
          i < attempts.length - 1
            ? `Search hiccup — retrying with a different query…`
            : `Search failed: ${(err as Error).message}`,
      });
    }
  }
  return [];
}

/** Step 6 — Retrieval + evidence extraction for a single page. */
export async function retrievePage(state: SharedAgentState, url: string) {
  const page = await fetchPage(url);
  const domain = domainOf(page.finalUrl || page.url);
  const trusted = await trustedDomains().catch(() => new Map<string, number>());
  const asset: PnxResearchAsset = {
    url: page.finalUrl || page.url,
    domain,
    title: page.title ?? domain,
    credibility: trusted.get(domain) ?? 65,
    trusted: trusted.has(domain),
  };
  state.assets.set(asset.url, asset);
  state.emit({ kind: "research", assets: [...state.assets.values()] });
  state.emit({
    kind: "log",
    level: "ok",
    text: `Crawled ${domain} — ${page.wordCount.toLocaleString()} words, ${page.h2.length} sections, ${page.jsonLdTypes.length} schema types`,
  });
  return page;
}

/**
 * Step 7/8 — Confidence scoring. Derived from how much verified, credible
 * evidence the state actually holds, never guessed by the model.
 */
export function computeConfidence(state: SharedAgentState): { score: number; basis: string } {
  const assets = [...state.assets.values()];
  const intent = state.intent;

  if (!intent?.needsResearch) {
    return { score: 0.86, basis: "Answered from established SEO practice — no live data needed." };
  }
  if (assets.length === 0) {
    return {
      score: 0.45,
      basis: "No live sources came back, so this leans on general practice rather than current data.",
    };
  }
  const avg = assets.reduce((n, a) => n + a.credibility, 0) / assets.length;
  const trustedCount = assets.filter((a) => a.trusted).length;
  const breadth = Math.min(assets.length / 5, 1);
  const score = Math.min(0.98, 0.42 + (avg / 100) * 0.35 + breadth * 0.15 + Math.min(trustedCount / 4, 1) * 0.08);
  const errorPenalty = state.errors.length > 0 ? 0.06 : 0;

  return {
    score: Math.max(0.35, score - errorPenalty),
    basis: `Based on ${assets.length} live source${assets.length === 1 ? "" : "s"}${
      trustedCount > 0 ? `, ${trustedCount} from high-authority domains` : ""
    }.`,
  };
}