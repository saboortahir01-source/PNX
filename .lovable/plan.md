## PNX — Marketing Site, Blog, Trust & SEO Expansion

A large multi-part build. Grouping into 6 phases so you can approve scope before I start writing files.

### 1. Information architecture (new routes)

New TanStack routes, each with its own `head()` (title, description, og:title, og:description, canonical, JSON-LD where relevant):

```text
/                  Landing page (rebuilt, conversion-focused)
/about             About + founder bio (Saboor Tahir + headshot)
/contact           Contact (email + form, headshot, trust signals)
/faq               FAQPage schema, "is it really free?" front and center
/privacy           Privacy policy (AdSense-ready)
/terms             Terms of service
/disclaimer        Disclaimer (AdSense-ready)
/blog              Blog index
/blog/$slug        8 articles (see section 4)
/chat/$threadId    Existing app (unchanged behavior)
```

`/` becomes a real landing page (not a redirect). Chat moves behind a "Launch PNX" CTA. Adds Header + Footer shared layout via `__root.tsx` (footer hidden inside `/chat/*`).

### 2. Trust, identity & favicon

- Save uploaded headshot → `src/assets/saboor-tahir.jpg`; use on `/about` and `/contact`.
- Founder identity: Saboor Tahir, with `sameAs` block in `Person` JSON-LD on `/about`.
- Favicon: generate from PNX logo → `public/favicon.ico` + `apple-touch-icon.png`, wire in `__root.tsx`.
- "100% Free — No Daily Limits" trust band on `/`, `/faq`, `/about`, footer.
- Lovable-policy-safe security copy: clear ownership, real contact, privacy/terms/disclaimer linked from every page footer, no claims we can't back, no scraping/PII-harvesting language.

### 3. SEO infrastructure

- Rewrite root JSON-LD: expand `SoftwareApplication.featureList` with the keyword list you supplied (SEO audit, technical SEO, AI content generator, AI keyword research, free keyword research tool, keyword research tools, SERP analysis, SEO competitor analysis, free competitor analysis tool, YouTube SEO analyzer, free YouTube SEO tools, YouTube SEO keywords, free YouTube keyword research, YouTube SEO strategist, agentic SEO tool, free agentic SEO tool, AI SEO strategist).
- Add `Organization` + `Person` (Saboor Tahir, founder) + `WebSite` SearchAction.
- Per-route `Article`, `FAQPage`, `BreadcrumbList`, `ContactPage` schemas.
- Convert `public/sitemap.xml` → dynamic `src/routes/sitemap[.]xml.ts` listing all routes + blog posts; delete stale static.
- Update `public/robots.txt` sitemap line.
- Per-page meta descriptions (≤160 chars) tuned to target keywords.
- H1/H2/H3 hierarchy on every page; one H1 per route.

### 4. Blog — 8 articles (low-comp / high-intent)

Stored as typed objects in `src/lib/blog-posts.ts` (no CMS). Each post: hero, intro, H2 sections, comparison table, internal links to ≥2 other posts + ≥2 service pages, glassmorphism CTA buttons (e.g. "Try the AI SEO Strategist", "Run a Free SEO Audit"), Article JSON-LD, OG meta.

| # | Slug | Primary keyword (low comp / high intent) |
|---|------|------------------------------------------|
| 1 | `free-agentic-seo-tool` | free agentic SEO tool |
| 2 | `free-ai-seo-audit-tool` | free AI SEO audit tool |
| 3 | `ai-keyword-research-free` | AI keyword research free |
| 4 | `free-youtube-seo-tools` | free YouTube SEO tools |
| 5 | `youtube-seo-keywords-guide` | YouTube SEO keywords |
| 6 | `free-competitor-analysis-tool` | free competitor analysis tool |
| 7 | `ai-content-generator-for-seo` | AI content generator for SEO |
| 8 | `ai-seo-strategist-vs-traditional-seo` | AI SEO strategist |

Each gets a comparison table (PNX vs paid alternatives, or feature-by-feature). Internal-link map ensures every post links to ≥2 siblings + Home + relevant tool CTA, and `/` + `/about` link back into the blog.

### 5. Landing page (`/`)

Glassmorphism, mobile-first. Sections: Hero (H1: "Free Agentic SEO Tool — AI Audits, Keyword Research & SERP Analysis"), Trust band ("100% free, no daily limits, no signup required"), Feature grid (8 tools using your keyword set), How-it-works (3 steps), Comparison table (PNX vs Ahrefs/Semrush/Surfer — free vs paid), Featured articles (4 of 8), FAQ teaser, Founder strip (Saboor Tahir), Final CTA → `/chat`.

### 6. AdSense readiness

- Real `/privacy`, `/terms`, `/disclaimer` with substantive content (cookies, analytics, third-party AI, no medical/financial advice, affiliate disclosure placeholder).
- `/about` with real human (Saboor Tahir + photo + bio), `/contact` with working mailto.
- ≥8 long-form articles + landing = enough unique content for AdSense review.
- No prohibited content; clear navigation; footer links to all policy pages on every route.

### Technical details

- All new routes use `createFileRoute` with `head()` returning `meta`, `links` (canonical only on leaf), `scripts` (JSON-LD).
- Shared `<SiteHeader/>` and `<SiteFooter/>` components; rendered in `__root.tsx` but suppressed for `/chat/*` via pathname check.
- Glassmorphism via existing `.glass` utility in `src/styles.css`; add `.glass-card-hover` and `.cta-glass` variants.
- Blog post body rendered with `react-markdown` + `remark-gfm` (already common pattern) — will install if missing.
- Favicon generated from existing `src/assets/pnx-logo.png` via `imagegen--edit_image` to a 512px square + copied to `public/favicon.ico` / `public/apple-touch-icon.png`.
- `src/routes/sitemap[.]xml.ts` replaces `public/sitemap.xml`; static file deleted.

### Out of scope (ask if you want them)

- CMS / admin for blog posts (posts are code-managed for speed and SSR).
- Newsletter / email capture backend.
- Real working contact form backend (will use `mailto:` unless you want Cloud + email service).
- AdSense account creation / ads.txt (added once you share your publisher ID).

### Deliverable order

1. Footer/Header + policy/about/contact/faq + favicon + headshot
2. Landing page rebuild + updated JSON-LD/meta
3. Blog infra + 8 articles + internal links + comparison tables
4. Dynamic sitemap + robots update + final SEO sweep

Reply "go" to build all four phases, or tell me which to drop/trim.