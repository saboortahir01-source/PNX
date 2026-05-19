import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const FAQ = [
  { q: "Is PNX really free?", a: "Yes. Every tool — SEO audit, AI keyword research, SERP analysis, YouTube SEO, AI content generator — is 100% free with no daily limits, no signup wall, and no premium tier." },
  { q: "How is PNX free?", a: "PNX is funded by the founder and runs efficiently on the Lovable AI Gateway. We pass the cost saving directly to users." },
  { q: "Do I need an account?", a: "No. Open the chat and start. Your conversation history stays in your browser." },
  { q: "Is there a daily limit?", a: "No daily limits. Use PNX as much as you need." },
  { q: "What can the SEO agent do?", a: "On-page SEO audits, technical SEO checks, AI keyword research with clustering, SERP competitor analysis, YouTube SEO optimisation, and SERP-aware AI content generation." },
  { q: "Does PNX support YouTube SEO?", a: "Yes — title, description, tags, thumbnail strategy and chapters. See our free YouTube SEO tools guide." },
  { q: "Is PNX an AI SEO strategist?", a: "Yes. It's an agentic SEO tool that plans the workflow, runs the analysis, and delivers a structured result." },
  { q: "Can I trust the data?", a: "PNX fetches live page and SERP data, parses it, and surfaces sources. Always validate critical decisions with your own analytics." },
];

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "PNX FAQ — Is the Free Agentic SEO Tool Really Free?" },
      { name: "description", content: "Frequently asked questions about PNX, the free agentic SEO tool. Pricing, limits, accounts, YouTube SEO support and more." },
      { property: "og:title", content: "PNX FAQ" },
      { property: "og:description", content: "Pricing, limits, what PNX can do, and how it stays free." },
      { property: "og:url", content: "https://pnx.lovable.app/faq" },
    ],
    links: [{ rel: "canonical", href: "https://pnx.lovable.app/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }),
    }],
  }),
});

function FaqPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">Short answers. Honest ones.</p>
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="glass-card p-5 group">
              <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                <span>{f.q}</span><span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10"><Link to="/chat" className="cta-glass">Try PNX Free →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
