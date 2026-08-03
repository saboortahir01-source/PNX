/**
 * PNX v2.0 — Google Sheets Knowledge Cache (the "speed layer").
 *
 * Four sheets back the agent:
 *   Query_Cache     Hash | Query | Task_Type | Summary | Sources_JSON | Confidence | Timestamp
 *   Source_Library  URL | Domain | Title | Credibility_Score | Key_Facts
 *   Trusted_Domains Domain | Authority_Level | Category
 *   Execution_Logs  Request_ID | Timestamp | Task_Type | Tools_Used | Cache_Hit | Duration_Ms | Outcome
 *
 * SECURITY / PRIVACY: this module is server-only. Nothing here is ever
 * described, quoted or surfaced in the assistant's replies — the cache is an
 * internal performance layer, not user-facing knowledge. Every call fails
 * soft: a Sheets outage must never break a chat turn.
 */

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";
const TIMEOUT_MS = 6000;

type Rows = string[][];

function config() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connectionKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.PNX_CACHE_SHEET_ID;
  if (!lovableKey || !connectionKey || !sheetId) return null;
  return { lovableKey, connectionKey, sheetId };
}

async function call(path: string, init?: RequestInit): Promise<unknown | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const res = await fetch(`${GATEWAY}/spreadsheets/${cfg.sheetId}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${cfg.lovableKey}`,
        "X-Connection-Api-Key": cfg.connectionKey,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[pnx-cache] sheets ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("[pnx-cache] request failed", (err as Error).message);
    return null;
  }
}

async function readRange(range: string): Promise<Rows> {
  const json = (await call(`/values/${range}`)) as { values?: Rows } | null;
  return json?.values ?? [];
}

async function appendRow(range: string, row: (string | number)[]): Promise<void> {
  await call(`/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
  });
}

/** Stable SHA-256 fingerprint of a normalized request. */
export async function queryFingerprint(query: string, taskType: string): Promise<string> {
  const normalized = `${taskType}::${query
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9\s.:/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()}`;
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export type CacheHit = {
  summary: string;
  confidence: number;
  ageMinutes: number;
  sources: { url: string; title: string }[];
};

/**
 * Look for a fresh, high-confidence answer to an identical request.
 * `maxAgeMinutes` is deliberately short for volatile SERP work.
 */
export async function cacheLookup(hash: string, maxAgeMinutes: number): Promise<CacheHit | null> {
  const rows = await readRange("Query_Cache!A2:G400");
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    if (!row || row[0] !== hash) continue;
    const ts = Date.parse(row[6] ?? "");
    if (!Number.isFinite(ts)) continue;
    const ageMinutes = (Date.now() - ts) / 60000;
    if (ageMinutes > maxAgeMinutes) continue;
    const confidence = Number(row[5] ?? 0);
    if (!Number.isFinite(confidence) || confidence < 0.75) continue;
    const summary = row[3] ?? "";
    if (summary.trim().length < 80) continue;
    let sources: { url: string; title: string }[] = [];
    try {
      const parsed: unknown = JSON.parse(row[4] || "[]");
      if (Array.isArray(parsed)) sources = parsed as { url: string; title: string }[];
    } catch {
      /* ignore malformed cache payloads */
    }
    return { summary, confidence, ageMinutes, sources };
  }
  return null;
}

export async function cacheStore(entry: {
  hash: string;
  query: string;
  taskType: string;
  summary: string;
  sources: { url: string; title: string }[];
  confidence: number;
}): Promise<void> {
  if (entry.summary.trim().length < 200) return; // not worth caching
  await appendRow("Query_Cache!A:G", [
    entry.hash,
    entry.query.slice(0, 500),
    entry.taskType,
    entry.summary.slice(0, 40000),
    JSON.stringify(entry.sources.slice(0, 12)),
    entry.confidence.toFixed(2),
    new Date().toISOString(),
  ]);
}

let trustedCache: { at: number; map: Map<string, number> } | null = null;

/** Domain → authority level (0-100). Cached in-process for 10 minutes. */
export async function trustedDomains(): Promise<Map<string, number>> {
  if (trustedCache && Date.now() - trustedCache.at < 600_000) return trustedCache.map;
  const rows = await readRange("Trusted_Domains!A2:C200");
  const map = new Map<string, number>();
  for (const row of rows) {
    const domain = (row?.[0] ?? "").trim().toLowerCase();
    const level = Number(row?.[1] ?? 0);
    if (domain && Number.isFinite(level)) map.set(domain, level);
  }
  trustedCache = { at: Date.now(), map };
  return map;
}

export async function rememberSources(
  sources: { url: string; domain: string; title: string; credibility: number; keyFacts?: string }[],
): Promise<void> {
  if (sources.length === 0) return;
  const cfg = config();
  if (!cfg) return;
  await call(`/values/Source_Library!A:E:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({
      values: sources
        .slice(0, 10)
        .map((s) => [s.url, s.domain, s.title.slice(0, 300), String(s.credibility), (s.keyFacts ?? "").slice(0, 2000)]),
    }),
  });
}

export async function logExecution(entry: {
  requestId: string;
  taskType: string;
  toolsUsed: string[];
  cacheHit: boolean;
  durationMs: number;
  outcome: string;
}): Promise<void> {
  await appendRow("Execution_Logs!A:G", [
    entry.requestId,
    new Date().toISOString(),
    entry.taskType,
    entry.toolsUsed.join(", ") || "none",
    entry.cacheHit ? "hit" : "miss",
    String(Math.round(entry.durationMs)),
    entry.outcome.slice(0, 300),
  ]);
}