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

const GOOGLE_FAQ = [
  { q: "Which Google APIs does PNX use?", a: "Google Search Console, Google Analytics 4, Google Drive, Google Sheets, Blogger and the YouTube Data API. Each is only called when you explicitly connect that account." },
  { q: "Is PNX verified by Google?", a: "PNX is preparing for Google OAuth 2.0 verification. See the full breakdown on our Google OAuth Verification & API Transparency Hub." },
  { q: "Does PNX store my Google data?", a: "No. Google API responses are processed in memory for your request and discarded. Nothing is retained on our servers." },
  { q: "Will my Google data be used for advertising?", a: "Never. PNX adheres to Google API Services User Data Policy Limited Use requirements — no ads, no resale, no human review except with your explicit consent or for security/legal reasons." },
  { q: "How do I revoke PNX's access to my Google account?", a: "Go to myaccount.google.com/permissions, find PNX in the list and click Remove Access. Revocation is immediate." },
  { q: "What scopes does PNX request?", a: "Only the minimum needed: webmasters.readonly, analytics.readonly, drive.file, spreadsheets, blogger, and youtube.readonly. The exact scope is shown on Google's consent screen before you approve." },
  { q: "Is the contact form secure?", a: "Yes. The whole site is served over HTTPS. The form opens your local email app via mailto — no data is posted to any third-party server." },
  { q: "Where is my chat history stored?", a: "Entirely in your browser's localStorage. Clear browser storage to wipe it; we have no copy." },
  { q: "Can I use PNX on mobile?", a: "Yes — PNX is mobile-first, fast, and works fully on phones and tablets." },
  { q: "How fast is PNX?", a: "PNX runs on edge infrastructure and serves cached static assets, so most pages load in under a second on a good connection." },
];

const ALL_FAQ = [...FAQ, ...GOOGLE_FAQ];

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "PNX FAQ — Is the Free Agentic SEO Tool Really Free?" },
      { name: "description", content: "Frequently asked questions about PNX, the free agentic SEO tool. Pricing, limits, accounts, YouTube SEO support and more." },
      { property: "og:title", content: "PNX FAQ" },
      { property: "og:description", content: "Pricing, limits, what PNX can do, and how it stays free." },
      { property: "og:url", content: "https://pnx.lovable.app/faq" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/faq" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/faq" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ALL_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
        <h2 className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">About PNX</h2>
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
        <h2 className="mt-12 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Google APIs, OAuth & security</h2>
        <div className="mt-4 space-y-3">
          {GOOGLE_FAQ.map((f) => (
            <details key={f.q} className="glass-card p-5 group">
              <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                <span>{f.q}</span><span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10"><Link to="/chat" className="cta-glass" aria-label="Launch PNX Chat — free AI SEO agent">Launch PNX Chat →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}