import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — PNX Free Agentic SEO Tool" },
      { name: "description", content: "PNX Terms of Service. Use the free agentic SEO tool responsibly. No abuse, no scraping at scale, no illegal use." },
      { property: "og:title", content: "Terms of Service — PNX" },
      { property: "og:description", content: "PNX Terms of Service — use the free agentic SEO tool responsibly. No abuse, no scraping at scale, no illegal use." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pnx.lovable.app/terms" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/terms" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/terms" },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
        <h1>Terms of Service</h1>
        <p><em>Last updated: May 2026.</em></p>

        <h2>1. Acceptance</h2>
        <p>By using PNX you agree to these Terms. If you don't agree, do not use the Service.</p>

        <h2>2. Use of the Service</h2>
        <ul>
          <li>The Service is provided free of charge for personal and commercial SEO research.</li>
          <li>You may not use PNX to violate any law, infringe any IP, generate spam, or harass others.</li>
          <li>You may not attempt to overload, reverse-engineer, or scrape the Service at scale.</li>
          <li>You are responsible for the content you submit and the results you publish.</li>
        </ul>

        <h2>3. AI output</h2>
        <p>AI output may contain errors. Always verify critical SEO and business decisions. PNX is a tool, not professional advice.</p>

        <h2>4. Account</h2>
        <p>
          No account is required for core use of PNX; the chat and main tools work without signing in. By default, chat history is stored locally in your browser's storage. Optional accounts (Email, Google, GitHub) are available to save preferences and enable additional account features.
        </p>

        <h2>5. Intellectual property</h2>
        <p>The PNX name, logo and content are owned by Saboor Tahir. You retain ownership of your prompts and outputs (subject to model provider terms).</p>

        <h2>6. Disclaimers</h2>
        <p>The Service is provided "as is" without warranty. See our <a href="/disclaimer">Disclaimer</a>.</p>

        <h2>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, PNX and Saboor Tahir shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of the Service.</p>

        <h2>8. Termination</h2>
        <p>We may suspend access if you violate these Terms.</p>

        <h2>9. Governing law</h2>
        <p>These Terms are governed by the laws of the jurisdiction in which Saboor Tahir resides, without regard to conflict-of-laws rules.</p>

        <h2>10. Contact</h2>
        <p><a href="mailto:saboortahir01@gmail.com">saboortahir01@gmail.com</a></p>
      </main>
      <SiteFooter />
    </div>
  );
}