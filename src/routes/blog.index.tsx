import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, X as XIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "PNX SEO Blog — Agentic SEO & AI Guides" },
      { name: "description", content: "Free SEO guides: agentic SEO, AI SEO audits, free keyword research, SERP analysis, YouTube SEO, AI content generation. Practical, ranked, no fluff." },
      { property: "og:title", content: "PNX SEO Blog" },
      { property: "og:description", content: "Free, practical SEO guides by Saboor Tahir." },
      { property: "og:url", content: "https://pnx.lovable.app/blog" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/blog" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/blog" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Blog",
            "@id": "https://pnx.lovable.app/blog#blog",
            url: "https://pnx.lovable.app/blog",
            name: "PNX SEO Blog",
            description: "Free, practical SEO and GEO (Generative Engine Optimization) guides by the PNX team.",
            inLanguage: "en",
            publisher: { "@type": "Organization", name: "PNX", url: "https://pnx.lovable.app/" },
            author: { "@type": "Person", name: "Saboor Tahir", url: "https://pnx.lovable.app/about" },
            blogPost: POSTS.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.description,
              url: `https://pnx.lovable.app/blog/${p.slug}`,
              datePublished: p.publishedAt,
              dateModified: p.updatedAt,
              keywords: p.keyword,
              articleSection: p.category,
              author: { "@type": "Person", name: "Saboor Tahir" },
              publisher: { "@type": "Organization", name: "PNX" },
              mainEntityOfPage: `https://pnx.lovable.app/blog/${p.slug}`,
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://pnx.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://pnx.lovable.app/blog" },
            ],
          },
        ],
      }),
    }],
  }),
});

function BlogIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of POSTS) set.add(p.category);
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keyword.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">The PNX SEO Blog</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Free agentic SEO, AI keyword research, SERP analysis, YouTube SEO and AI content guides — by Saboor Tahir.</p>

        {/* Search + category filter — pure client-side, no API key required */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PNX blog — try 'GEO', 'YouTube SEO', 'keyword research'…"
              aria-label="Search PNX blog"
              className="glass w-full rounded-full border border-border/60 bg-background/60 pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-[color:var(--brand)]/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium transition " +
                  (category === c
                    ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                    : "border-border/60 text-muted-foreground hover:text-foreground")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {filtered.length} of {POSTS.length} articles
          {query ? <> matching &ldquo;{query}&rdquo;</> : null}
          {category !== "All" ? <> in <span className="font-medium text-foreground">{category}</span></> : null}
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="glass-card p-8 sm:col-span-2 text-center">
              <div className="text-sm font-semibold">No articles matched.</div>
              <p className="mt-1 text-sm text-muted-foreground">Try a broader term, or <button className="underline" onClick={() => { setQuery(""); setCategory("All"); }}>clear the filters</button>.</p>
            </div>
          ) : filtered.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="glass-card p-6 hover:-translate-y-0.5 transition-transform">
              <div className="text-xs text-muted-foreground">{p.category} · {p.readTime}</div>
              <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-300 font-medium">Read article →</div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}