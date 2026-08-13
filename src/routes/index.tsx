"use client";

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
      { name: "description", content: "PNX is a 100% free agentic SEO tool. Run AI SEO audits, keyword research, SERP analysis, YouTube SEO and AI content generation. No daily limits." },
      { name: "keywords", content: "free agentic SEO tool, AI SEO strategist, free SEO audit tool, AI keyword research, free keyword research tool, SERP analysis, SEO competitor analysis, free YouTube SEO tools, YouTube SEO analyzer, AI content generator for SEO, technical SEO" },
      { property: "og:title", content: "PNX — Free Agentic SEO Tool" },
      { property: "og:description", content: "Free AI SEO audits, keyword research, SERP analysis & YouTube SEO. No daily limits." },
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
              <ShieldCheck size={12} className="text-emerald-500" /> 100% Free · No limits
            </div>
            <h1 className="mt-4 text-[1.85rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-bold tracking-tight text-balance">
              The <span className="text-gradient-brand">Free Agentic SEO Tool</span><br className="hidden sm:block" />
              built for founders, writers & small teams
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-[14px] leading-relaxed sm:text-lg text-muted-foreground">
              PNX is a new, independent AI SEO agent — free while in beta. Audits, keyword research, SERP analysis, YouTube SEO and AI content — all in one chat.
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
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Every tool below is unlimited and free.</p>
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

        {/* ... rest unchanged ... */}

      </main>
      <SiteFooter />
    </div>
  );
}