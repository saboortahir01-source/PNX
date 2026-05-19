import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — PNX Free Agentic SEO Tool" },
      { name: "description", content: "How PNX handles your data. We store nothing on our servers — chat history lives in your browser only." },
      { property: "og:title", content: "Privacy Policy — PNX" },
      { property: "og:url", content: "https://pnx.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://pnx.lovable.app/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: May 2026.</em></p>
        <p>PNX (the "Service") is operated by Saboor Tahir. This policy explains what data we collect, how it's used, and your rights.</p>

        <h2>1. Data we collect</h2>
        <ul>
          <li><strong>Chat history</strong> — stored locally in your browser (localStorage). We do not store your conversations on our servers.</li>
          <li><strong>Analytics</strong> — Google Analytics (G-2MT0HT3T33) collects anonymous usage data (pages viewed, country, device type) to help us improve the product.</li>
          <li><strong>AI processing</strong> — your prompts are sent to the Lovable AI Gateway and underlying model providers (e.g. Google Gemini) for processing. Do not paste sensitive personal data.</li>
        </ul>

        <h2>2. Cookies</h2>
        <p>We use first-party cookies for analytics. You can disable cookies in your browser settings. Third-party services (Google Analytics, Google AdSense if enabled in future) may set their own cookies governed by their privacy policies.</p>

        <h2>3. Advertising</h2>
        <p>This site may display ads via Google AdSense in the future. Google may use cookies to serve ads based on prior visits. You can opt out at <a href="https://www.google.com/settings/ads">google.com/settings/ads</a>.</p>

        <h2>4. Data sharing</h2>
        <p>We do not sell your data. We only share data with the processors strictly needed to operate the Service (Lovable, Google Analytics, Cloudflare).</p>

        <h2>5. Your rights</h2>
        <p>You can clear chat history at any time by clearing your browser localStorage. To request deletion of analytics data, email <a href="mailto:hello@pnx.lovable.app">hello@pnx.lovable.app</a>.</p>

        <h2>6. Children</h2>
        <p>PNX is not directed to children under 13. We do not knowingly collect data from children.</p>

        <h2>7. Changes</h2>
        <p>We may update this policy. Material changes will be announced on this page.</p>

        <h2>8. Contact</h2>
        <p>Questions? Email <a href="mailto:hello@pnx.lovable.app">hello@pnx.lovable.app</a>.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
