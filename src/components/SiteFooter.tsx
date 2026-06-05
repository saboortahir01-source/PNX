import { Link } from "@tanstack/react-router";
import pnxLogo from "@/assets/pnx-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-background/60">
      {/* Mobile: premium, compact, scannable. Brand + CTA hero, then two collapsible groups. */}
      <div className="md:hidden px-5 pt-8 pb-4">
        <div className="flex items-center gap-2.5">
          <img src={pnxLogo} alt="PNX AI SEO platform" width={28} height={28} className="rounded-md" />
          <span className="text-base font-semibold tracking-tight">PNX</span>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-muted-foreground rounded-full border px-2 py-0.5">Free</span>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Free agentic SEO co-pilot by Saboor Tahir. Audits, keyword research, SERP &amp; YouTube SEO — no signup.
        </p>
        <Link to="/chat" className="cta-glass mt-5 w-full !py-3 !text-sm justify-center" aria-label="Launch PNX Chat">
          Launch PNX Chat →
        </Link>

        <details className="group mt-6 border-t pt-3">
          <summary className="flex items-center justify-between text-[13px] font-semibold cursor-pointer list-none">
            Tools
            <span className="msym text-muted-foreground transition-transform group-open:rotate-180">expand_more</span>
          </summary>
          <ul className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-3 text-[13px] text-muted-foreground">
            <li><Link to="/blog/$slug" params={{ slug: "free-ai-seo-audit-tool" }}>SEO Audit</Link></li>
            <li><Link to="/blog/$slug" params={{ slug: "ai-keyword-research-free" }}>Keyword Research</Link></li>
            <li><Link to="/blog/$slug" params={{ slug: "free-competitor-analysis-tool" }}>SERP Analysis</Link></li>
            <li><Link to="/blog/$slug" params={{ slug: "free-youtube-seo-tools" }}>YouTube SEO</Link></li>
            <li><Link to="/blog/$slug" params={{ slug: "ai-content-generator-for-seo" }}>AI Content</Link></li>
          </ul>
        </details>

        <details className="group mt-3 border-t pt-3">
          <summary className="flex items-center justify-between text-[13px] font-semibold cursor-pointer list-none">
            Company &amp; legal
            <span className="msym text-muted-foreground transition-transform group-open:rotate-180">expand_more</span>
          </summary>
          <ul className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-3 text-[13px] text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
            <li><Link to="/google-oauth-verification">Google APIs</Link></li>
          </ul>
        </details>

        <p className="mt-6 text-[11px] text-muted-foreground/80 text-center">© {new Date().getFullYear()} PNX · Made for creators, founders &amp; SEO teams.</p>
      </div>

      {/* Desktop: original 4-col layout */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <img src={pnxLogo} alt="PNX AI SEO platform" width={28} height={28} className="rounded-md" />
              PNX
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Free agentic SEO tool by Saboor Tahir. AI-powered SEO audits, keyword research, SERP analysis,
              YouTube SEO and AI content generation — 100% free, no daily limits, no signup.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blog/$slug" params={{ slug: "free-ai-seo-audit-tool" }} className="hover:text-foreground">SEO Audit</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "ai-keyword-research-free" }} className="hover:text-foreground">Keyword Research</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "free-competitor-analysis-tool" }} className="hover:text-foreground">SERP Analysis</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "free-youtube-seo-tools" }} className="hover:text-foreground">YouTube SEO</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "ai-content-generator-for-seo" }} className="hover:text-foreground">AI Content</Link></li>
              <li><Link to="/chat" className="hover:text-foreground font-medium">Launch PNX Chat →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
              <li><Link to="/google-oauth-verification" className="hover:text-foreground">Google OAuth &amp; APIs</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} PNX by Saboor Tahir. All rights reserved.</p>
            <p>Made for creators, founders &amp; SEO teams. 100% free.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
