import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShieldCheck, Lock, Eye, RefreshCw } from "lucide-react";

const SCOPES: { api: string; scope: string; what: string; why: string }[] = [
  { api: "Search Console", scope: "webmasters.readonly", what: "Read aggregated search performance (queries, impressions, clicks, position).", why: "Power SEO audits and ranking reports inside PNX." },
  { api: "Google Analytics 4", scope: "analytics.readonly", what: "Read aggregated GA4 metrics (sessions, pageviews, conversions).", why: "Correlate SEO work with real engagement." },
  { api: "Google Drive", scope: "drive.file", what: "Access only files you pick via the Google file picker.", why: "Import source content; export PNX reports." },
  { api: "Google Sheets", scope: "spreadsheets", what: "Read/write the sheets you select.", why: "Import keyword lists; export keyword clusters & SERP results." },
  { api: "Blogger", scope: "blogger", what: "Read your posts and (with consent) publish drafts.", why: "On-page SEO analysis and one-click publishing." },
  { api: "YouTube Data v3", scope: "youtube.readonly", what: "Read public video metadata, your channel info and search results.", why: "YouTube SEO analysis & keyword research." },
];

export const Route = createFileRoute("/google-oauth-verification")({
  component: VerificationHub,
  head: () => ({
    meta: [
      { title: "Google OAuth Verification & API Transparency Hub — PNX" },
      { name: "description", content: "PNX's transparency hub for Google OAuth 2.0 verification. Scopes requested, data handling, Limited Use compliance and demo video for Search Console, GA4, Drive, Sheets, Blogger and YouTube." },
      { property: "og:title", content: "Google OAuth Verification — PNX" },
      { property: "og:description", content: "Full transparency on PNX's Google API integrations." },
      { property: "og:url", content: "https://pnx.lovable.app/google-oauth-verification" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/google-oauth-verification" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/google-oauth-verification" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Google OAuth Verification & API Transparency Hub",
        url: "https://pnx.lovable.app/google-oauth-verification",
        about: "Google API Services User Data Policy compliance for PNX",
      }),
    }],
  }),
});

function VerificationHub() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-emerald-500" /> Google API Services User Data Policy — Limited Use compliant
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Google OAuth &amp; API Transparency Hub</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          PNX integrates with Google Search Console, GA4, Drive, Sheets, Blogger and the YouTube Data API to power
          user-facing SEO features. This page is a full, plain-English breakdown of what we ask for, why, and how
          your data is handled — for both PNX users and Google's verification team.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          <div className="glass-card p-4">
            <Lock className="size-5 text-emerald-500" />
            <h3 className="mt-2 font-semibold">Minimum scopes</h3>
            <p className="text-sm text-muted-foreground">We request the narrowest scope that makes the feature work.</p>
          </div>
          <div className="glass-card p-4">
            <Eye className="size-5 text-sky-500" />
            <h3 className="mt-2 font-semibold">No human reads</h3>
            <p className="text-sm text-muted-foreground">Humans never read your Google data except with explicit consent or for legal/security reasons.</p>
          </div>
          <div className="glass-card p-4">
            <RefreshCw className="size-5 text-purple-500" />
            <h3 className="mt-2 font-semibold">No retention</h3>
            <p className="text-sm text-muted-foreground">Google API responses are processed ephemerally — nothing is stored on our servers.</p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Requested scopes &amp; user benefit</h2>
        <div className="mt-4 overflow-x-auto glass-card p-1">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-3 py-2">Google API</th>
                <th className="px-3 py-2">Scope</th>
                <th className="px-3 py-2">What we access</th>
                <th className="px-3 py-2">Why (user benefit)</th>
              </tr>
            </thead>
            <tbody>
              {SCOPES.map((s) => (
                <tr key={s.api} className="border-b last:border-0 align-top">
                  <td className="px-3 py-3 font-medium">{s.api}</td>
                  <td className="px-3 py-3 font-mono text-xs">{s.scope}</td>
                  <td className="px-3 py-3 text-muted-foreground">{s.what}</td>
                  <td className="px-3 py-3 text-muted-foreground">{s.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Limited Use compliance</h2>
        <p className="mt-3 text-muted-foreground">
          PNX's use and transfer to any other app of information received from Google APIs will adhere to the{" "}
          <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener">Google API Services User Data Policy</a>,
          including the Limited Use requirements. We do not use Google user data for advertising, do not sell it,
          and do not allow humans to read it except (a) with your explicit consent, (b) for security investigations,
          or (c) to comply with applicable law.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Just-in-time disclosures</h2>
        <p className="mt-3 text-muted-foreground">
          When you launch a Google-powered tool inside PNX (e.g. "Run Search Console audit"), a contextual notice
          appears before the Google consent screen: <em>"PNX needs read-only access to your Search Console to
          analyze your rankings. We never store your data."</em> You always click through Google's own consent
          screen — we never bypass it.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Demo video</h2>
        <div className="mt-3 glass-card p-6">
          <p className="text-muted-foreground">
            A full demonstration video — showing the OAuth grant flow, every scope on the Google consent screen,
            and each Google-powered feature in action — is published as an unlisted YouTube video for Google's
            verification team.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Video link: <span className="font-mono text-xs">(coming soon — request from <a className="underline" href="mailto:saboortahir01@gmail.com">saboortahir01@gmail.com</a>)</span>
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Revoking access</h2>
        <p className="mt-3 text-muted-foreground">
          You can revoke PNX's access at any time at{" "}
          <a className="underline" href="https://myaccount.google.com/permissions" rel="noopener">myaccount.google.com/permissions</a>.
          Revocation is immediate and removes our ability to call any Google API on your behalf.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Technical &amp; privacy contact</h2>
        <p className="mt-3 text-muted-foreground">
          Security disclosures, privacy questions and verification-team contact:{" "}
          <a className="underline" href="mailto:saboortahir01@gmail.com"><strong>saboortahir01@gmail.com</strong></a>.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/privacy" className="cta-glass">Read full Privacy Policy →</Link>
          <Link to="/terms" className="cta-glass">Terms of Service →</Link>
          <a href="https://developers.google.com/terms/api-services-user-data-policy" className="cta-glass" rel="noopener">Google's User Data Policy →</a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}