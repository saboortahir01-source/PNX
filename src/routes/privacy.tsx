import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — PNX Free Agentic SEO Tool" },
      { name: "description", content: "How PNX handles your data, including Google API integrations (Search Console, GA4, Drive, Sheets, Blogger, YouTube). Limited Use compliant." },
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
        <p>
          PNX (the "Service") is operated by Saboor Tahir. This policy explains what data we collect,
          how it's used, and your rights. For a full breakdown of how we use each Google API, see our{" "}
          <Link to="/google-oauth-verification">Google API Integrations &amp; OAuth Transparency Hub</Link>.
        </p>

        <h2>1. Data we collect</h2>
        <ul>
          <li><strong>Chat history</strong> — stored locally in your browser (localStorage). We do not store your conversations on our servers.</li>
          <li><strong>Analytics</strong> — Google Analytics (G-2MT0HT3T33) collects anonymous usage data (pages viewed, country, device type) to help us improve the product.</li>
          <li><strong>AI processing</strong> — your prompts are sent to the Lovable AI Gateway and underlying model providers (e.g. Google Gemini) for processing. Do not paste sensitive personal data.</li>
          <li><strong>Google API data (only when you connect)</strong> — see Section 9 below for a per-API breakdown.</li>
        </ul>

        <h2>2. Cookies</h2>
        <p>We use first-party cookies for analytics. You can disable cookies in your browser settings. Third-party services (Google Analytics, Google AdSense if enabled in future) may set their own cookies governed by their privacy policies.</p>

        <h2>3. Advertising</h2>
        <p>This site may display ads via Google AdSense in the future. Google may use cookies to serve ads based on prior visits. You can opt out at <a href="https://www.google.com/settings/ads">google.com/settings/ads</a>.</p>

        <h2>4. Data sharing</h2>
        <p>
          We do not sell your data. We only share data with the processors strictly needed to operate the
          Service (Lovable, Google Analytics, Cloudflare, and — when you explicitly authorize them — Google
          API endpoints). <strong>No personally identifiable information (PII) is shared with third parties</strong>,
          and data obtained through any Google API is never sold, used for advertising, or transferred to data
          brokers.
        </p>

        <h2>5. Your rights</h2>
        <p>
          You can clear chat history at any time by clearing your browser localStorage. You can revoke PNX's
          access to any Google API at any time from your <a href="https://myaccount.google.com/permissions" rel="noopener">Google Account permissions page</a>.
          To request deletion of analytics data, email{" "}
          <a href="mailto:saboortahir01@gmail.com"><strong>saboortahir01@gmail.com</strong></a>.
        </p>

        <h2>6. Children</h2>
        <p>PNX is not directed to children under 13. We do not knowingly collect data from children.</p>

        <h2>7. Changes</h2>
        <p>We may update this policy. Material changes will be announced on this page.</p>

        <h2>8. Contact</h2>
        <p>
          Questions or privacy / security inquiries? Email{" "}
          <a href="mailto:saboortahir01@gmail.com"><strong>saboortahir01@gmail.com</strong></a>.
        </p>

        <h2 id="google-api-services">9. Google API Services &amp; OAuth Disclosures</h2>
        <p>
          <strong>Limited Use Disclosure.</strong> PNX's use and transfer to any other app of information received
          from Google APIs will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener">Google API Services User Data Policy</a>,
          including the Limited Use requirements. We request only the minimum scopes needed for each user-facing
          feature, and we never use Google user data for advertising, sell it, or allow humans to read it except
          with your explicit consent, for security investigations, or to comply with applicable law.
        </p>
        <p>
          <strong>Data retention.</strong> PNX does not store Google user data on its servers. All Google API
          responses are processed ephemerally in memory for the duration of your request, or stored locally in
          your browser (localStorage) only when needed to display results.
        </p>

        <h3>9.1 Google Search Console API</h3>
        <ul>
          <li><strong>Data accessed:</strong> aggregated, anonymized search performance data (queries, impressions, clicks, average position) for sites you own.</li>
          <li><strong>Purpose:</strong> to power user-facing SEO audit, ranking, and gap-analysis reports inside PNX.</li>
          <li><strong>PII:</strong> none collected. <strong>Storage:</strong> ephemeral; not retained server-side.</li>
        </ul>

        <h3>9.2 Google Analytics 4 (GA4) Data API</h3>
        <ul>
          <li><strong>Data accessed:</strong> aggregated, anonymized traffic and engagement metrics (page views, sessions, bounce rate, conversion counts).</li>
          <li><strong>Purpose:</strong> to correlate SEO work with real engagement and surface data-driven recommendations.</li>
          <li><strong>PII:</strong> none collected. <strong>Storage:</strong> ephemeral; not retained server-side.</li>
        </ul>

        <h3>9.3 Google Drive API</h3>
        <ul>
          <li><strong>Data accessed:</strong> only files you explicitly pick (file picker), for importing source content or exporting PNX reports.</li>
          <li><strong>Scopes:</strong> read-only for imports, file-scoped write for exports — never broad Drive access.</li>
          <li><strong>Storage:</strong> files are processed in memory and discarded after the response is returned.</li>
        </ul>

        <h3>9.4 Blogger API</h3>
        <ul>
          <li><strong>Data accessed:</strong> post titles, content, tags and publication status of blogs you own.</li>
          <li><strong>Purpose:</strong> on-page SEO analysis of existing posts and optional one-click publishing of PNX-generated drafts.</li>
          <li><strong>Storage:</strong> not retained server-side.</li>
        </ul>

        <h3>9.5 Google Sheets API</h3>
        <ul>
          <li><strong>Data accessed:</strong> only the spreadsheets you explicitly select for keyword imports, content plans, or report exports.</li>
          <li><strong>Scopes:</strong> file-scoped — never your entire Drive.</li>
          <li><strong>Storage:</strong> ephemeral processing only.</li>
        </ul>

        <h3>9.6 YouTube Data API v3</h3>
        <ul>
          <li><strong>Data accessed:</strong> public video metadata (titles, descriptions, tags, view counts), channel info and search results — used for YouTube SEO analysis and keyword research.</li>
          <li><strong>PII / private data:</strong> none.</li>
          <li><strong>Storage:</strong> not retained server-side.</li>
        </ul>

        <h3>9.7 Revoking access</h3>
        <p>
          You can revoke PNX's access to any Google service at any time from{" "}
          <a href="https://myaccount.google.com/permissions" rel="noopener">myaccount.google.com/permissions</a>.
          Revocation takes effect immediately and removes our ability to call any Google API on your behalf.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}