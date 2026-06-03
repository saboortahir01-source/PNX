import * as cheerio from "cheerio";

const UA =
  "Mozilla/5.0 (compatible; LovableSEOAgent/1.0; +https://lovable.dev)";

// SSRF protection: only allow http(s) on public hostnames.
// Blocks loopback, private RFC1918, link-local, cloud metadata, and
// internal-only TLDs to prevent server-side request forgery via
// user-supplied URLs in the SEO agent's fetch tool.
const BLOCKED_HOSTS = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "broadcasthost",
  "metadata.google.internal",
  "metadata.goog",
]);

function isBlockedIPv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local + AWS/GCP metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isBlockedIPv6(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (!h.includes(":")) return false;
  if (h === "::1" || h === "::" ) return true;
  if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) return true;
  if (h.startsWith("::ffff:")) {
    const v4 = h.slice(7);
    return isBlockedIPv4(v4);
  }
  return false;
}

function assertSafeUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed");
  }
  const host = u.hostname.toLowerCase();
  if (!host) throw new Error("Missing hostname");
  if (BLOCKED_HOSTS.has(host)) throw new Error("Blocked hostname");
  if (host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) {
    throw new Error("Internal hostnames are not allowed");
  }
  if (isBlockedIPv4(host) || isBlockedIPv6(host)) {
    throw new Error("Private or loopback addresses are not allowed");
  }
  return u;
}

export type FetchPageResult = {
  url: string;
  finalUrl: string;
  statusCode: number;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robots: string | null;
  lang: string | null;
  viewport: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  h1: string[];
  h2: string[];
  h3: string[];
  headingOrder: { tag: string; text: string }[];
  wordCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  jsonLdTypes: string[];
  hasFavicon: boolean;
  textPreview: string;
};

export async function fetchPage(rawUrl: string): Promise<FetchPageResult> {
  const url = normalizeUrl(rawUrl);
  const parsed = assertSafeUrl(url);
  const res = await fetch(parsed.toString(), {
    redirect: "manual",
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
  });
  // Manually follow redirects (max 5) re-validating each hop to prevent
  // SSRF via open redirect.
  let current = res;
  let finalUrl = parsed.toString();
  for (let i = 0; i < 5 && current.status >= 300 && current.status < 400; i++) {
    const loc = current.headers.get("location");
    if (!loc) break;
    const next = new URL(loc, finalUrl);
    assertSafeUrl(next.toString());
    finalUrl = next.toString();
    current = await fetch(finalUrl, {
      redirect: "manual",
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
  }
  const statusCode = current.status;
  const html = await current.text();
  const $ = cheerio.load(html);

  const og: Record<string, string> = {};
  const tw: Record<string, string> = {};
  $("meta").each((_, el) => {
    const prop = $(el).attr("property") || "";
    const name = $(el).attr("name") || "";
    const content = $(el).attr("content") || "";
    if (prop.startsWith("og:")) og[prop.slice(3)] = content;
    if (name.startsWith("twitter:")) tw[name.slice(8)] = content;
  });

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h3 = $("h3").map((_, el) => $(el).text().trim()).get().filter(Boolean);

  const headingOrder: { tag: string; text: string }[] = [];
  $("h1, h2, h3, h4").each((_, el) => {
    const tag = ((el as { tagName?: string }).tagName || "").toLowerCase();
    const text = $(el).text().trim();
    if (text) headingOrder.push({ tag, text: text.slice(0, 120) });
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  const images = $("img");
  const imageCount = images.length;
  let imagesMissingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || !alt.trim()) imagesMissingAlt++;
  });

  const origin = new URL(finalUrl).origin;
  let internalLinks = 0;
  let externalLinks = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
      return;
    try {
      const u = new URL(href, finalUrl);
      if (u.origin === origin) internalLinks++;
      else externalLinks++;
    } catch {
      /* skip */
    }
  });

  const jsonLdTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      collectJsonLdTypes(data, jsonLdTypes);
    } catch {
      /* ignore */
    }
  });

  return {
    url,
    finalUrl,
    statusCode,
    title: $("title").first().text().trim() || null,
    metaDescription: $('meta[name="description"]').attr("content")?.trim() || null,
    canonical: $('link[rel="canonical"]').attr("href")?.trim() || null,
    robots: $('meta[name="robots"]').attr("content")?.trim() || null,
    lang: $("html").attr("lang")?.trim() || null,
    viewport: $('meta[name="viewport"]').attr("content")?.trim() || null,
    og,
    twitter: tw,
    h1,
    h2: h2.slice(0, 30),
    h3: h3.slice(0, 30),
    headingOrder: headingOrder.slice(0, 50),
    wordCount,
    imageCount,
    imagesMissingAlt,
    internalLinks,
    externalLinks,
    jsonLdTypes: Array.from(new Set(jsonLdTypes)),
    hasFavicon:
      $('link[rel="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0,
    textPreview: bodyText.slice(0, 600),
  };
}

function collectJsonLdTypes(node: unknown, out: string[]) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const n of node) collectJsonLdTypes(n, out);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const t = obj["@type"];
    if (typeof t === "string") out.push(t);
    else if (Array.isArray(t)) for (const v of t) if (typeof v === "string") out.push(v);
    for (const v of Object.values(obj)) collectJsonLdTypes(v, out);
  }
}

function normalizeUrl(u: string): string {
  const trimmed = u.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "https://" + trimmed.replace(/^\/+/, "");
}

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export async function webSearch(
  query: string,
  limit = 8
): Promise<SearchResult[]> {
  const body = new URLSearchParams({ q: query });
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html",
    },
    body,
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  const results: SearchResult[] = [];
  $(".result").each((_, el) => {
    if (results.length >= limit) return;
    const a = $(el).find("a.result__a").first();
    const title = a.text().trim();
    let href = a.attr("href") || "";
    // DuckDuckGo wraps links: /l/?uddg=<encoded>
    try {
      if (href.startsWith("/")) href = "https://duckduckgo.com" + href;
      const u = new URL(href);
      const target = u.searchParams.get("uddg");
      if (target) href = decodeURIComponent(target);
    } catch {
      /* keep href */
    }
    const snippet = $(el).find(".result__snippet").text().trim();
    if (title && href) results.push({ title, url: href, snippet });
  });
  return results;
}

export type ImageResult = {
  title: string;
  image: string;
  thumbnail: string;
  source: string;
  url: string;
};

// DuckDuckGo image search (two-step: get vqd token, then JSON endpoint).
export async function imageSearch(query: string, limit = 6): Promise<ImageResult[]> {
  try {
    const tokenRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      { headers: { "User-Agent": UA, Accept: "text/html" } },
    );
    const tokenHtml = await tokenRes.text();
    const m = tokenHtml.match(/vqd=["']?([\d-]+)["']?/);
    if (!m) return [];
    const vqd = m[1];
    const res = await fetch(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`,
      {
        headers: {
          "User-Agent": UA,
          Accept: "application/json",
          Referer: "https://duckduckgo.com/",
        },
      },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: Array<Record<string, string>> };
    const out: ImageResult[] = [];
    for (const r of json.results ?? []) {
      if (out.length >= limit) break;
      if (!r.image || !r.url) continue;
      out.push({
        title: r.title ?? "",
        image: r.image,
        thumbnail: r.thumbnail ?? r.image,
        source: r.source ?? "",
        url: r.url,
      });
    }
    return out;
  } catch {
    return [];
  }
}