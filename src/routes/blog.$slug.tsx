import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getPost, POSTS, type BlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPostPage,
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    const url = `https://pnx.lovable.app/blog/${params.slug}`;
    if (!p) return { meta: [{ title: "Article — PNX" }] };
    return {
      meta: [
        { title: `${p.title} | PNX SEO Blog` },
        { name: "description", content: p.description },
        { name: "keywords", content: p.keyword },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:author", content: "Saboor Tahir" },
        { property: "article:published_time", content: p.publishedAt },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.description,
          author: { "@type": "Person", name: "Saboor Tahir", url: "https://pnx.lovable.app/about" },
          publisher: { "@type": "Organization", name: "PNX", logo: { "@type": "ImageObject", url: "https://pnx.lovable.app/favicon.png" } },
          datePublished: p.publishedAt,
          dateModified: p.updatedAt,
          mainEntityOfPage: url,
          keywords: p.keyword,
        }),
      }, {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pnx.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://pnx.lovable.app/blog" },
            { "@type": "ListItem", position: 3, name: p.title, item: url },
          ],
        }),
      }],
    };
  },
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = post.related
    .map((s: string) => POSTS.find((p) => p.slug === s))
    .filter((p): p is BlogPost => Boolean(p));
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-xs text-muted-foreground flex gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span>{post.category}</span>
        </nav>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{post.title}</h1>
        <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 text-xs text-muted-foreground flex gap-3">
          <span>By Saboor Tahir</span><span>·</span><span>{post.readTime}</span><span>·</span><span>{post.publishedAt}</span>
        </div>

        <article className="prose prose-neutral dark:prose-invert mt-10 max-w-none prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-300 prose-table:text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            // Allow the CTA glass anchor pattern
            a: ({ href, children, ...props }) => {
              const cls = (props as { className?: string }).className;
              if (cls?.includes("cta-glass")) {
                return <a href={href} className="cta-glass">{children}</a>;
              }
              return <a href={href}>{children}</a>;
            },
          }}>{post.body}</ReactMarkdown>
        </article>

        <div className="mt-12 cta-glass-wrap"><Link to="/chat" className="cta-glass">{post.ctaLabel} →</Link></div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold">Related guides</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {related.map((r: BlogPost) => (
                <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="glass-card p-4 hover:-translate-y-0.5 transition-transform">
                  <div className="text-xs text-muted-foreground">{r.category}</div>
                  <div className="mt-1 font-semibold text-sm">{r.title}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
