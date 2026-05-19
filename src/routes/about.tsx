import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About PNX & Founder Saboor Tahir | Free Agentic SEO Tool" },
      { name: "description", content: "PNX is built by Saboor Tahir — an independent, 100% free agentic SEO platform. Learn the mission, the team and why every tool is unlimited." },
      { property: "og:title", content: "About PNX — by Saboor Tahir" },
      { property: "og:description", content: "Independent. Free. Unlimited. The story behind PNX, the free agentic SEO tool." },
      { property: "og:url", content: "https://pnx.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://pnx.lovable.app/about" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: "https://pnx.lovable.app/about",
        mainEntity: {
          "@type": "Person",
          name: "Saboor Tahir",
          jobTitle: "Founder of PNX",
          worksFor: { "@type": "Organization", name: "PNX" },
          image: "https://pnx.lovable.app/saboor-tahir.png",
          url: "https://pnx.lovable.app/about",
        },
      }),
    }],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About PNX</h1>
        <p className="mt-4 text-lg text-muted-foreground">PNX is a 100% free agentic SEO platform — built so anyone can rank without paying enterprise prices.</p>

        <div className="glass-card mt-10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
          <img src="/saboor-tahir.png" alt="Saboor Tahir — Founder of PNX" width={140} height={140} className="rounded-2xl object-cover size-36 border" />
          <div>
            <h2 className="text-2xl font-semibold">Saboor Tahir</h2>
            <p className="text-sm text-muted-foreground">Founder & Lead SEO Strategist</p>
            <p className="mt-3 text-sm">
              Saboor has spent the last several years helping creators and founders rank with smaller budgets. PNX is the tool he wished existed — agentic, AI-native, and free.
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Our mission</h2>
        <p className="mt-3 text-muted-foreground">Make professional-grade SEO accessible to every creator and founder on earth. No paywalls. No daily caps. No surprise upsells.</p>

        <h2 className="mt-10 text-2xl font-semibold">What you get, free forever</h2>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-muted-foreground">
          <li><Link to="/blog/free-ai-seo-audit-tool" className="underline">Free AI SEO audit tool</Link> — unlimited audits</li>
          <li><Link to="/blog/ai-keyword-research-free" className="underline">AI keyword research</Link> with clustering</li>
          <li><Link to="/blog/free-competitor-analysis-tool" className="underline">Free competitor analysis</Link> & SERP analysis</li>
          <li><Link to="/blog/free-youtube-seo-tools" className="underline">Free YouTube SEO tools</Link></li>
          <li><Link to="/blog/ai-content-generator-for-seo" className="underline">AI content generator for SEO</Link></li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Why free?</h2>
        <p className="mt-3 text-muted-foreground">PNX is funded by the founder and runs efficiently on Lovable AI Gateway. The cost savings are passed back to you. There is no daily cap, no premium tier hiding the good stuff.</p>

        <div className="mt-10"><Link to="/chat" className="cta-glass">Try PNX Free →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
