import type { UIMessage } from "ai";

export type ToolPart = {
  type: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error"
    | "approval-requested"
    | "approval-responded"
    | "output-denied";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type WorkflowStep = {
  id: string;
  kind: "understand" | "search" | "crawl" | "images" | "serp" | "analyze" | "compose";
  label: string;
  detail?: string;
  status: "done" | "active" | "pending" | "error";
  meta?: string;
};

export type Source = {
  url: string;
  title: string;
  domain: string;
  snippet?: string;
  via: "search" | "page" | "serp";
};

export const isToolPart = (p: { type?: string }): p is ToolPart =>
  typeof p.type === "string" && p.type.startsWith("tool-");

const toolName = (p: ToolPart) => p.type.replace(/^tool-/, "");

const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] ?? url;
  }
}

/** Build the human-readable workflow for one assistant turn. */
export function buildWorkflow(parts: ToolPart[], streaming: boolean, hasText: boolean): WorkflowStep[] {
  if (parts.length === 0) return [];
  const steps: WorkflowStep[] = [
    { id: "understand", kind: "understand", label: "Understanding the request", status: "done" },
  ];

  parts.forEach((p, i) => {
    const name = toolName(p);
    const input = rec(p.input);
    const out = rec(p.output);
    const failed = p.state === "output-error" || Boolean(str(out.error));
    const running = p.state === "input-streaming" || p.state === "input-available";
    const status: WorkflowStep["status"] = failed ? "error" : running ? "active" : "done";

    if (name === "web_search") {
      const results = Array.isArray(out.results) ? out.results.length : 0;
      steps.push({
        id: `${name}-${i}`,
        kind: "search",
        label: running ? "Searching the web" : "Searched the web",
        detail: str(input.query),
        meta: status === "done" ? `${results} result${results === 1 ? "" : "s"}` : undefined,
        status,
      });
    } else if (name === "fetch_page") {
      const url = str(input.url) ?? str(out.finalUrl) ?? "";
      steps.push({
        id: `${name}-${i}`,
        kind: "crawl",
        label: running ? "Crawling the page" : "Crawled the page",
        detail: url ? domainOf(url) : undefined,
        meta:
          status === "done" && typeof out.wordCount === "number"
            ? `${out.wordCount.toLocaleString()} words`
            : undefined,
        status,
      });
      if (status === "done") {
        steps.push({
          id: `${name}-${i}-analyze`,
          kind: "analyze",
          label: "Analysing on-page signals",
          detail: "Titles, meta, headings, schema, links",
          status: "done",
        });
      }
    } else if (name === "analyze_serp") {
      const pages = Array.isArray(out.pages) ? out.pages.length : 0;
      steps.push({
        id: `${name}-${i}`,
        kind: "serp",
        label: running ? "Analysing the SERP" : "Analysed the SERP",
        detail: str(input.query),
        meta: status === "done" ? `${pages} page${pages === 1 ? "" : "s"} compared` : undefined,
        status,
      });
    } else if (name === "image_search") {
      const results = Array.isArray(out.results) ? out.results.length : 0;
      steps.push({
        id: `${name}-${i}`,
        kind: "images",
        label: running ? "Finding visual references" : "Found visual references",
        detail: str(input.query),
        meta: status === "done" ? `${results} image${results === 1 ? "" : "s"}` : undefined,
        status,
      });
    } else {
      steps.push({
        id: `${name}-${i}`,
        kind: "analyze",
        label: name.replace(/_/g, " "),
        status,
      });
    }
  });

  steps.push({
    id: "compose",
    kind: "compose",
    label: hasText ? "Composed the answer" : "Writing the answer",
    status: hasText ? (streaming ? "active" : "done") : streaming ? "active" : "pending",
  });

  return steps;
}

/** Collect every external resource the turn actually consulted. */
export function collectSources(parts: ToolPart[]): Source[] {
  const map = new Map<string, Source>();
  const add = (s: Source) => {
    if (!s.url || !/^https?:\/\//i.test(s.url)) return;
    const key = s.url.replace(/#.*$/, "");
    if (!map.has(key)) map.set(key, { ...s, url: key });
  };

  for (const p of parts) {
    const name = toolName(p);
    const out = rec(p.output);
    if (name === "web_search" && Array.isArray(out.results)) {
      for (const r of out.results as Record<string, unknown>[]) {
        const url = str(r.url);
        if (!url) continue;
        add({ url, title: str(r.title) ?? domainOf(url), domain: domainOf(url), snippet: str(r.snippet), via: "search" });
      }
    }
    if (name === "fetch_page") {
      const url = str(out.finalUrl) ?? str(out.url);
      if (url)
        add({
          url,
          title: str(out.title) ?? domainOf(url),
          domain: domainOf(url),
          snippet: str(out.metaDescription),
          via: "page",
        });
    }
    if (name === "analyze_serp" && Array.isArray(out.pages)) {
      for (const r of out.pages as Record<string, unknown>[]) {
        const url = str(r.url);
        if (!url) continue;
        add({ url, title: str(r.title) ?? domainOf(url), domain: domainOf(url), snippet: str(r.metaDescription), via: "serp" });
      }
    }
  }
  return [...map.values()];
}
