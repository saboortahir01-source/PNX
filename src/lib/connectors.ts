/**
 * PNX connectors — user-owned data sources the agent may read from.
 *
 * Everything lives in the browser's localStorage (same privacy promise as chat
 * history): nothing is stored on a PNX server. The connected snapshot is sent
 * with each chat request so the agent can ground its advice in the user's real
 * Search Console numbers instead of guessing.
 */

export type GscRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscConnection = {
  property: string;
  /** ISO date the snapshot was imported. */
  importedAt: string;
  rows: GscRow[];
};

export type ConnectorState = {
  gsc: GscConnection | null;
};

const KEY = "pnx.connectors.v1";

export function loadConnectors(): ConnectorState {
  if (typeof window === "undefined") return { gsc: null };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { gsc: null };
    const parsed = JSON.parse(raw) as ConnectorState;
    return { gsc: parsed?.gsc ?? null };
  } catch {
    return { gsc: null };
  }
}

export function saveConnectors(state: ConnectorState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — connectors are best-effort */
  }
}

const num = (v: string | undefined) => {
  if (!v) return 0;
  const n = Number(v.replace(/[%,\s"]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Parse a Search Console "Queries" CSV export (the file inside the Export ▸ CSV
 * zip). Tolerates locale header variants and quoted fields.
 */
export function parseGscCsv(text: string): GscRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') quoted = !quoted;
      else if (c === "," && !quoted) {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const header = split(lines[0]!).map((h) => h.toLowerCase());
  const idx = (...names: string[]) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const qi = Math.max(0, idx("query", "top queries", "search term", "page"));
  const ci = idx("click");
  const ii = idx("impression");
  const ri = idx("ctr");
  const pi = idx("position");

  const rows: GscRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = split(line);
    const query = (cols[qi] ?? "").replace(/^"|"$/g, "");
    if (!query) continue;
    rows.push({
      query,
      clicks: num(cols[ci]),
      impressions: num(cols[ii]),
      ctr: num(cols[ri]),
      position: num(cols[pi]),
    });
  }
  return rows;
}

/** Compact payload sent to the agent — capped so requests stay fast. */
export function connectorPayload(state: ConnectorState) {
  if (!state.gsc) return undefined;
  const rows = [...state.gsc.rows]
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, 40);
  return {
    gsc: {
      property: state.gsc.property,
      importedAt: state.gsc.importedAt,
      totals: {
        queries: state.gsc.rows.length,
        clicks: state.gsc.rows.reduce((n, r) => n + r.clicks, 0),
        impressions: state.gsc.rows.reduce((n, r) => n + r.impressions, 0),
      },
      rows,
    },
  };
}
