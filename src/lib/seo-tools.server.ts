import * as cheerio from "cheerio";

const UA =
  "Mozilla/5.0 (compatible; LovableSEOAgent/1.0; +https://lovable.dev)";

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
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
  });
  const finalUrl = res.url || url;
  const statusCode = res.status;
  const html = await res.text();
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
    const tag = (el as cheerio.Element).tagName?.toLowerCase() || "";
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