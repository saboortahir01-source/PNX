"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { POSTS } from "@/lib/blog-posts";
import pnxLogo from "@/assets/pnx-logo.png";
import agentViz from "@/assets/agent-visual-anim.svg";
import { Gauge, Search, Sparkles, BarChart3, Play, PenLine, Bot, ShieldCheck, Zap, Globe } from "lucide-react";
import ComparisonSection from "@/components/ComparisonSection";

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
      { title: "PNX — Your SEO agent" },
      { name: "description", content: "PNX is an AI SEO agent: ask a question, provide a URL or topic, and PNX handles research, auditing and optimization with grounded evidence." },
      { name: "keywords", content: "AI SEO agent, SEO audit, keyword research, SERP analysis, content optimization" },
      { property: "og:title", content: "PNX — Your SEO agent" },
      { property: "og:description", content: "Ask PNX an SEO question and get prioritized, evidence-backed work you can act on." },
      { property: "og:url", content: "https://pnx.lovable.app/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/" },
      { rel: "preload", as: "image", href: "/favicon.png", fetchpriority: "high" },
    ],
  }),
});

function LandingPage() {
  const featured = POSTS.slice(0, 4);
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main>
        {/* Hero - redesigned */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[color:var(--bg-surface)]" />
          <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] sm:text-xs text-muted-foreground">
                <ShieldCheck size={12} className="text-emerald-500" /> 100% Free · No limits
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl leading-tight font-bold tracking-tight text-balance">
                Your SEO work. <span className="text-gradient-brand">One intelligent agent.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground">
                Research, analyze, audit and optimize — hand an SEO question, URL or topic to PNX and it does the work with evidence-backed recommendations.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-start gap-3">
                <Link to="/chat" className="cta-glass !py-3 !px-5 rounded-full font-semibold">Start with a URL</Link>
                <Link to="#demo" className="text-sm text-muted-foreground underline">See demo</Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 max-w-xl">
                <button className="chip">Why is this page not ranking?</button>
                <button className="chip">Find keyword opportunities</button>
                <button className="chip">Audit this page and prioritize fixes</button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[640px]">
              {/* Agent visual - inline for animations */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white p-4">
                <img src={agentViz} alt="PNX agent visual" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Tools grid - unchanged but kept */}
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

        {/* Comparison section (ChatGPT vs PNX) */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">How ChatGPT compares to PNX</h2>
            <p className="mt-2 text-sm text-muted-foreground">Same prompt — two perspectives. Useful, fair, and focused on next steps.</p>
          </div>
          <div className="mt-6">
            <ComparisonSection />
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

export default LandingPage;
