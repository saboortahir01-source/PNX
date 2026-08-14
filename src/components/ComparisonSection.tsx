"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import pnxLogo from "@/assets/pnx-logo.png";
import { Bot } from "lucide-react";

const userPrompt = `Should I start with backlinks to grow traffic to my SaaS landing page?`;

const chatgptMd = `### ChatGPT

**Short answer:** Not first — focus on clarity, on-page strength, and supporting content before heavy link-building.

For a SaaS landing page I would prioritise these steps:

---

### 1. Make the page's primary intent obvious

Priority: High

Pick one clear commercial search intent for the homepage (for example: "project management SaaS — pricing & features"). Make the hero and first paragraph reflect that intent in plain language. This helps search engines and users understand what the page should rank for.

**What to do first →**
- Choose a single primary search purpose for the homepage.
- Update the H1, title tag and meta description to match that purpose.

Why this helps: a single focus concentrates signals and reduces topical noise.

---

### 2. Fix basic on-page and technical issues

Priority: High

Check title/meta, headings, schema, canonical tags, robots, and page speed. If Google can't crawl or understand the page, backlinks won't help.

**Quick wins →**
- Make title ≤ 60 chars and include the primary phrase.
- Ensure the hero contains the core benefit and the target phrase in natural language.
- Add or fix canonical and meta description.

---

### 3. Build supporting pages, then measure

Priority: Medium

Turn important features into dedicated pages (e.g. /seo-audit, /keyword-research) and link them from the homepage. This creates clearer internal linking and gives you pages to target more specific queries.

**Next action →**
- Create one supporting capability page and link to it from the feature card.

---

### What to expect and next step

Start with the single-page focus and on-page fixes. Track impressions and clicks in Search Console over 2–6 weeks; if you see queries with high impressions but low CTR or positions 4–20, those are good candidates for content and link building.

**Concrete next action:** Pick one primary search intent for the homepage and update the title, H1 and meta description to match it.
`;

const pnxMd = `**Sample analysis**

### PNX

**I wouldn’t start with backlinks yet.**

Before trying to get more traffic, I’d first make sure Google can clearly understand **what this page deserves to rank for**.

For a SaaS landing page, these are the first 3 things I’d investigate:

---

### 1. Is the page trying to rank for too many things?

**Priority: High**

If one landing page is simultaneously targeting:

\`AI SEO tool\`
\`SEO audit\`
\`keyword research\`
\`SERP analysis\`

the page can become relevant to all of them, but especially strong for none of them.

**What I’d do first →**

Choose one primary commercial search intent for the homepage.

Then let dedicated pages go deeper into the other capabilities.

**Why this matters:**
One clear search purpose gives both users and search engines a much cleaner picture of what the page is about.

---

### 2. Your feature cards may be hiding an SEO opportunity

This is where things get interesting.

Features such as:

**SEO Audit**
**Keyword Research**
**SERP Analysis**

shouldn’t only explain what PNX can do.

They can also become **paths into deeper searchable content**.

**Opportunity →**

Turn important capabilities into useful supporting pages and connect them naturally from the homepage.

That creates:

* clearer site structure
* stronger internal linking
* more useful pages for users
* more opportunities to rank for specific search intent

---

### 3. Can someone understand the product from the first few lines?

**Priority: Important**

Your hero can look great and still leave search engines with weak topical context.

Near the top of the page, I’d make three things immediately clear:

**What is PNX?**
An agentic SEO product.

**Who is it for?**
Founders, writers and small teams.

**What can it actually help with?**
Audits, keyword research, SERP analysis and SEO strategy.

No keyword stuffing.

Just clearer language.

## What would I fix first?

**Not everything.**

I’d start here:

### → Give the homepage one clear primary search intent.

Then build supporting capability pages around it.

That gives you a cleaner foundation before spending time on more content, backlinks or smaller technical tweaks.

---

**Prioritized**  ·  **Explains why**  ·  **Clear next action**
`;

export default function ComparisonSection() {
  return (
    <div className="w-full">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Sample analysis</span>
        </div>
        <div className="mt-3 max-w-3xl mx-auto text-sm sm:text-base bg-background/60 border border-border/60 rounded-md p-3 text-left font-mono text-[13px]">
          <strong className="block">User prompt</strong>
          <div className="mt-1 text-muted-foreground">{userPrompt}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ChatGPT column */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2">
              <Bot size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold">ChatGPT</div>
              <div className="text-xs text-muted-foreground">Balanced, practical guidance</div>
            </div>
          </div>

          <div className="mt-4 prose prose-sm max-w-none prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{chatgptMd}</ReactMarkdown>
          </div>
        </div>

        {/* PNX column */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-3">
            <img src={pnxLogo} alt="PNX logo" className="size-8 rounded-md" />
            <div>
              <div className="text-sm font-semibold">PNX</div>
              <div className="text-xs text-muted-foreground">Focused, prioritised next steps</div>
            </div>
          </div>

          <div className="mt-4 prose prose-sm max-w-none prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{pnxMd}</ReactMarkdown>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">Prioritized</span>
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">Explains why</span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700">Clear next action</span>
          </div>
        </div>
      </div>
    </div>
  );
}
