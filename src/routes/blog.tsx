import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "PNX SEO Blog — Agentic SEO & AI Guides" },
      { name: "description", content: "Free SEO guides: agentic SEO, AI SEO audits, free keyword research, SERP analysis, YouTube SEO, AI content generation. Practical, ranked, no fluff." },
      { property: "og:title", content: "PNX SEO Blog" },
      { property: "og:description", content: "Free, practical SEO guides by Saboor Tahir." },
      { property: "og:url", content: "https://pnx.lovable.app/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://pnx.lovable.app/blog" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        url: "https://pnx.lovable.app/blog",
        name: "PNX SEO Blog",
        author: { "@type": "Person", name: "Saboor Tahir" },
        blogPost: POSTS.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `https://pnx.lovable.app/blog/${p.slug}`,
          datePublished: p.publishedAt,
        })),
      }),
    }],
  }),
});

function BlogIndex() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">The PNX SEO Blog</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Free agentic SEO, AI keyword research, SERP analysis, YouTube SEO and AI content guides — by Saboor Tahir.</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {POSTS.map((p) => (
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
