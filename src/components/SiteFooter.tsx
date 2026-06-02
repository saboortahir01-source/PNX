import { Link } from "@tanstack/react-router";
import pnxLogo from "@/assets/pnx-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <img src={pnxLogo} alt="PNX logo" width={28} height={28} className="rounded-md" />
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
          <p>Made for creators, founders & SEO teams. 100% free.</p>
        </div>
      </div>
    </footer>
  );
}
