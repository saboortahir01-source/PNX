import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS } from "@/lib/blog-posts";
import pnxLogo from "@/assets/pnx-logo.png";
import { Gauge, Search, Sparkles, BarChart3, Play, PenLine, Bot, ShieldCheck, Zap, Globe } from "lucide-react";

const TOOLS = [
  { icon: Gauge, title: "Free SEO Audit Tool", desc: "Full on-page & technical SEO audit in 30 seconds.", href: "/blog/free-ai-seo-audit-tool" },
  { icon: Search, title: "AI Keyword Research", desc: "Free keyword research tool with intent clustering.", href: "/blog/ai-keyword-research-free" },
  { icon: BarChart3, title: "SERP Analysis", desc: "Live SEO competitor analysis & content gap finder.", href: "/blog/free-competitor-analysis-tool" },
  { icon: Play, title: "YouTube SEO", desc: "Free YouTube SEO analyzer & keyword research.", href: "/blog/free-youtube-seo-tools" },
  { icon: PenLine, title: "AI Content Generator", desc: "SERP-aware AI content generation for SEO.", href: "/blog/ai-content-generator-for-seo" },
  { icon: Bot, title: "AI SEO Strategist", desc: "Agentic SEO that plans, executes and reports.", href: "/blog/ai-seo-strategist-vs-traditional-seo" },
] as const;

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "PNX — Free Agentic SEO Tool & AI Audits" },
      { name: "description", content: "PNX is a 100% free agentic SEO tool. Run AI SEO audits, free keyword research, SERP analysis, YouTube SEO and AI content generation. No limits, no signup." },
      { name: "keywords", content: "free agentic SEO tool, AI SEO strategist, free SEO audit tool, AI keyword research, free keyword research tool, SERP analysis, SEO competitor analysis, free YouTube SEO tools, YouTube SEO analyzer, AI content generator for SEO, technical SEO" },
      { property: "og:title", content: "PNX — Free Agentic SEO Tool" },
      { property: "og:description", content: "Free AI SEO audits, keyword research, SERP analysis & YouTube SEO. No limits, no signup." },
      { property: "og:url", content: "https://pnx.lovable.app/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/" },
      { rel: "preload", as: "image", href: "/favicon.png", fetchpriority: "high" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "Is PNX really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. PNX is 100% free while in beta — no signup wall, no daily limits, no credit card." } },
                { "@type": "Question", name: "What can PNX do?", acceptedAnswer: { "@type": "Answer", text: "PNX runs on-page SEO audits, AI keyword research with intent clustering, live SERP competitor analysis, YouTube SEO optimisation and AI-assisted content generation." } },
                { "@type": "Question", name: "How is PNX different from Ahrefs, Semrush or Surfer?", acceptedAnswer: { "@type": "Answer", text: "PNX is an agentic assistant — you describe the goal in plain English and PNX picks the right tool, runs it live and returns an actionable report. It's free, has no daily caps and works in a single chat." } },
                { "@type": "Question", name: "Does PNX help with GEO and AI search (ChatGPT, Perplexity, Google AI Overviews)?", acceptedAnswer: { "@type": "Answer", text: "Yes. PNX is built for the AI search era and helps you optimise for generative engines like ChatGPT, Perplexity, Gemini and Google's AI Overviews alongside classic Google SEO." } },
              ],
            },
            {
              "@type": "ItemList",
              name: "PNX free SEO tools",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Free SEO Audit Tool", url: "https://pnx.lovable.app/blog/free-ai-seo-audit-tool" },
                { "@type": "ListItem", position: 2, name: "AI Keyword Research", url: "https://pnx.lovable.app/blog/ai-keyword-research-free" },
                { "@type": "ListItem", position: 3, name: "SERP Analysis", url: "https://pnx.lovable.app/blog/free-competitor-analysis-tool" },
                { "@type": "ListItem", position: 4, name: "YouTube SEO", url: "https://pnx.lovable.app/blog/free-youtube-seo-tools" },
                { "@type": "ListItem", position: 5, name: "AI Content Generator", url: "https://pnx.lovable.app/blog/ai-content-generator-for-seo" },
                { "@type": "ListItem", position: 6, name: "AI SEO Strategist", url: "https://pnx.lovable.app/blog/ai-seo-strategist-vs-traditional-seo" },
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://pnx.lovable.app/" },
              ],
            },
          ],
        }),
      },
    ],
  }),
});

function LandingPage() {
  const featured = POSTS.slice(0, 4);
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-surface)" }} />
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] sm:text-xs text-muted-foreground">
              <ShieldCheck size={12} className="text-emerald-500" /> 100% Free · No limits · No signup
            </div>
            <h1 className="mt-4 text-[1.85rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-bold tracking-tight text-balance">
              The <span className="text-gradient-brand">Free Agentic SEO Tool</span><br className="hidden sm:block" />
              built for founders, writers &amp; small teams
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-[14px] leading-relaxed sm:text-lg text-muted-foreground">
              PNX is a new, independent AI SEO agent — free while in beta. Audits, keyword research, SERP analysis, YouTube SEO and AI content, all in one chat.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <Link to="/chat" className="cta-glass w-full sm:w-auto justify-center !py-3 sm:!py-3 !text-sm" aria-label="Launch PNX Chat — free AI SEO agent">Launch PNX Chat →</Link>
              <Link to="/blog" className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full text-sm font-medium border hover:bg-accent text-center">Read the SEO blog</Link>
            </div>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <img src={pnxLogo} alt="PNX agentic SEO tool" width={96} height={96} fetchPriority="high" decoding="async" className="size-20 sm:size-[120px] rounded-3xl glass p-3" />
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="text-center mb-7 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">All your SEO tools, in one free agent</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Every tool below is unlimited and free, powered by AI.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {TOOLS.map((t) => (
              <a key={t.title} href={t.href} className="glass-card p-4 sm:p-5 hover:-translate-y-0.5 transition-transform">
                <div className="size-9 sm:size-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <t.icon size={18} />
                </div>
                <h3 className="mt-3 sm:mt-4 text-[13.5px] sm:text-base font-semibold leading-tight">{t.title}</h3>
                <p className="mt-1 text-[12px] sm:text-sm text-muted-foreground leading-snug">{t.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How agentic SEO works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: "Ask in plain English", desc: "Describe your SEO goal — PNX picks the right tool." },
              { icon: Zap, title: "Agent runs the workflow", desc: "Live page fetch, SERP parse, schema check, AI clustering." },
              { icon: Globe, title: "Ship the result", desc: "Get a structured report, brief or content draft you can act on today." },
            ].map((s, i) => (
              <div key={s.title} className="glass-card p-6">
                <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                <div className="mt-2 size-9 rounded-lg bg-accent flex items-center justify-center"><s.icon size={18} /></div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">PNX vs paid SEO tools</h2>
            <p className="mt-3 text-muted-foreground">Honest comparison. No spin.</p>
          </div>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4">Feature</th>
                  <th className="p-4">PNX</th>
                  <th className="p-4">Ahrefs</th>
                  <th className="p-4">Semrush</th>
                  <th className="p-4">Surfer</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr:last-child]:border-0">
                {[
                  ["Price", "Free", "$99+/mo", "$139+/mo", "$89+/mo"],
                  ["On-page SEO audit", "✅ Unlimited", "✅", "✅", "✅"],
                  ["AI keyword research", "✅", "Limited", "Limited", "❌"],
                  ["SERP analysis", "✅ Live", "✅", "✅", "✅"],
                  ["YouTube SEO", "✅", "❌", "Limited", "❌"],
                  ["AI content generation", "✅", "Add-on", "Add-on", "✅"],
                  ["Signup required", "No", "Yes", "Yes", "Yes"],
                  ["Daily limits", "None", "Plan-based", "Plan-based", "Plan-based"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((c, i) => (
                      <td key={i} className={i === 1 ? "p-4 font-medium" : "p-4 text-muted-foreground"}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Featured articles */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From the SEO blog</h2>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">All articles →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="glass-card p-5 hover:-translate-y-0.5 transition-transform">
                <div className="text-xs text-muted-foreground">{p.category} · {p.readTime}</div>
                <h3 className="mt-2 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Founder strip */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="glass-card p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <img src="/saboor-tahir.png" alt="Saboor Tahir, founder of PNX" width={96} height={96} className="rounded-full border object-cover size-24" />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">Built by Saboor Tahir</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">PNX is an independent project. No VC pressure to upsell you. Just a free, fast, agentic SEO tool you can actually trust. <Link to="/about" className="underline">Read the story →</Link></p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-4 pb-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to rank?</h2>
          <p className="mt-3 text-muted-foreground">Launch PNX and run your first SEO audit in under a minute.</p>
          <div className="mt-6"><Link to="/chat" className="cta-glass" aria-label="Start the free PNX SEO agent">Start Free SEO Agent →</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
