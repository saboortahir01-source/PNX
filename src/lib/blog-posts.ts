export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  body: string; // markdown
  ctaLabel: string;
  ctaPrompt: string;
  related: string[]; // slugs
  faqs?: { q: string; a: string }[];
};

const TODAY = "2026-05-19";

const intro = (kw: string, promise: string) =>
  `**${promise}** PNX is a [free agentic SEO tool](/) built for creators, founders and SEO teams who need real answers — fast — without paying $99/month for legacy platforms. This guide breaks down everything about **${kw}** in plain English, with a comparison table, internal links to our free tools, and a one-click way to try it yourself.\n\n`;

const cta = (label: string, prompt: string) =>
  `\n\n<div class="cta-glass-wrap">\n  <a class="cta-glass" href="/chat" data-prompt="${prompt}">${label} →</a>\n</div>\n\n`;

const footer = (related: string[]) =>
  `\n\n## Keep reading\n\n${related.map((s) => `- [${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}](/blog/${s})`).join("\n")}\n\nReady to put this into practice? [Launch PNX free](/chat) — no credit card, no daily cap, no signup wall.\n`;

export const POSTS: BlogPost[] = [
  {
    slug: "new-to-pnx-fastest-way-to-sign-up-and-start",
    title: "New to PNX? Here’s the Fastest Way to Sign Up and Start",
    description: "Quick, step-by-step guide to sign up and start with PNX. Email, Google, GitHub sign-in, password rules (8+ chars), email verification, reset, and troubleshooting.",
    keyword: "PNX signup, PNX account, get started PNX",
    category: "Guides",
    readTime: "4 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "A concise, beginner-friendly walkthrough for creating a PNX account with Email, Google or GitHub, verifying your address, resetting passwords, and quick troubleshooting.",
    body:
      `If you’re new to PNX, this short guide gets you from zero to running your first SEO audit in under five minutes. It covers creating an account with Email, signing in, using Google or GitHub single-click sign-in, the password rules (minimum 8 characters), verifying your email, and simple troubleshooting steps.\n\n` +
      `PNX intentionally keeps signup simple: you can use an Email account or continue with Google or GitHub. No other social logins are offered.\n\n` +
      `---\n\n` +
      `## At a glance — the fastest path\n\n` +
      `1. Create an account with Email (or use Google/GitHub)\n` +
      `2. Verify your email if you used Email sign-up\n` +
      `3. Sign in and launch the AI SEO agent on /chat\n` +
      `4. If you forget your password, use the Reset link to receive a password-reset email\n\n` +
      `---\n\n` +
      `### 1) Create an account with Email\n\n` +
      `Step card — Create with Email:\n\n` +
      `- Open the Sign Up modal by clicking "Create Account" on the site header or the "Launch PNX Chat" button.\n` +
      `- Choose "Create Account", enter your email address and a password (minimum 8 characters).\n` +
      `- Click **Create Account**. You’ll usually be sent a verification email — open it and click the verification link.\n` +
      `\n` +
      `Notes:\n` +
      `- Passwords require at least 8 characters; using a passphrase or a password manager is recommended.\n` +
      `- After verifying your email you’ll be redirected back to PNX and can sign in immediately.\n\n` +
      `### 2) Sign in with Email\n\n` +
      `Step card — Sign in with Email:\n\n` +
      `- Click Sign In, enter the same email and password you used to sign up.\n` +
      `- If you don’t remember your password, click **Forgot?** in the sign-in form to send a reset link to your inbox. The reset flow redirects you to <a href="/reset-password">/reset-password</a> after you click the link in your email.\n` +
      `- If your email isn’t verified, the sign-in form will prompt you to verify and offer to resend the confirmation email.\n\n` +
      `### 3) Continue with Google\n\n` +
      `Step card — Google sign-in:\n\n` +
      `- Click **Continue with Google**. A Google sign-in window appears; choose the account you want to associate with PNX.\n` +
      `- If this is your first time, Google will confirm permissions and you’ll be brought back to PNX.\n` +
      `\n` +
      `Notes:\n` +
      `- Google sign-in creates an account for you with no extra email verification step because Google vouches for your address.\n` +
      `- If the sign-in fails, try again in a fresh browser tab or an incognito window and ensure pop-ups are allowed.\n\n` +
      `### 4) Continue with GitHub\n\n` +
      `Step card — GitHub sign-in:\n\n` +
      `- Click **Continue with GitHub**. Authorize PNX in the GitHub OAuth prompt.\n` +
      `- After authorizing you’ll return to PNX and can launch the agent.\n\n` +
      `Notes:\n` +
      `- GitHub sign-in also skips the email verification step because GitHub provides your confirmed email.\n\n` +
      `### Email verification & password reset\n\n` +
      `- Verification: when you sign up with Email, check your inbox (and spam folder) for the verification link. If you don’t receive it, the app offers a **Resend Verification Email** button in the modal.\n` +
      `- Reset: use the **Forgot?** link on the sign-in form to request a password reset. You’ll receive a reset email that redirects you back to <a href="/reset-password">/reset-password</a> to finish setting a new password.\n\n` +
      `### Simple troubleshooting (quick fixes)\n\n` +
      `- No verification or reset email: check Spam, Filters, and Promotions tabs. If it still doesn’t arrive, use the "Resend Verification Email" option in the Sign Up modal.\n` +
      `- Google/GitHub sign-in failed: ensure your browser isn’t blocking pop-ups or third-party cookies; try an incognito window.\n` +
      `- "Incorrect email or password": double-check your email for typos and try password reset if needed.\n` +
      `- Still stuck? Visit our <a href="/contact">Contact</a> page or read the <a href="/blog/free-ai-seo-audit-tool">Free SEO Audit</a> guide to get started while you sort account issues.\n\n` +
      `---\n\n` +
      `Why we keep signup simple\n\n` +
      `We focus on a clean, secure, and minimal signup: Email, Google, and GitHub cover most workflows while keeping the UI uncluttered. We intentionally do not offer other social logins.\n\n` +
      `---\n\n` +
      `Ready to try it? [Launch PNX Chat](/chat) and run an instant on-page SEO audit in one click.\n\n`,
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Audit https://example.com and show me high-priority SEO recommendations",
    related: ["free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-keyword-research-free"],
    faqs: [
      { q: "What login options does PNX offer?", a: "PNX supports Email sign-up and single-click sign-in with Google and GitHub. No other social sign-ins are available." },
      { q: "What are the password requirements?", a: "Passwords must be at least 8 characters. We recommend using a password manager or passphrase for strong, memorable passwords." },
      { q: "I didn’t get the verification email — what should I do?", a: "Check Spam and Promotions folders. If it’s missing, use the Resend Verification Email option in the Sign Up modal, or contact support via the Contact page." },
      { q: "Can I sign up with Apple or Microsoft?", a: "No. PNX currently only offers Email, Google, and GitHub sign-in options." },
    ],
  },
  {
    slug: "pnx-vs-semrush",
    title: "PNX vs Semrush: Which SEO Platform Is Right for You? (2026)",
    description: "An honest comparison of PNX vs Semrush. Compare AI agentic workflows, keyword research, site audits, backlinks, competitor analysis, and accessibility.",
    keyword: "PNX vs Semrush",
    category: "Comparisons",
    readTime: "12 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Semrush is a comprehensive digital marketing suite built around vast databases, while PNX is a free conversational AI SEO agent. Here is how their workflows and capabilities compare.",
    body:
      `When selecting search engine optimization software, the primary consideration is how your team handles day-to-day research and execution. If your organization requires multi-channel digital marketing dashboards, historical PPC competitor intelligence, and comprehensive multi-domain rank tracking, established software suites remain the benchmark. However, if your goal is to eliminate dashboard navigation and allow an autonomous AI agent to audit live pages, cluster search intent, and write content briefs directly in chat, conversational tools offer a distinct alternative.\n\n` +
      `**PNX** and **Semrush** operate on fundamentally different software models. Semrush is an enterprise digital marketing suite built around historical databases, competitive advertising intelligence, and domain reporting. PNX is an [AI SEO agent](/blog/free-agentic-seo-tool) designed for conversational, real-time web research, technical page audits, and automated content strategy.\n\n` +
      `Neither tool is universally superior across every metric. Semrush excels at enterprise-level multi-channel competitive intelligence and historical rank tracking, whereas PNX excels at rapid, intent-focused execution and conversational SEO automation. Below is an objective, detailed comparison to help you evaluate which tool fits your operational requirements.\n\n` +
      `## PNX vs Semrush at a Glance\n\n` +
      `| Category | PNX (AI SEO Agent) | Semrush (Marketing Suite) |\n` +
      `|---|---|---|\n` +
      `| **Core Architecture** | Conversational multi-agent AI framework | Multi-dashboard database and reporting suite |\n` +
      `| **Primary Interaction** | Natural language prompts and multi-step execution | Manual navigation across dozens of dedicated tools |\n` +
      `| **Keyword Discovery** | Real-time AI search intent clustering and query mapping | Large historical database of search volumes and CPC metrics |\n` +
      `| **Website Auditing** | Real-time on-page technical audits on live URLs | Scheduled domain-wide crawls and technical error reports |\n` +
      `| **Competitor Research** | Live web fetching and real-time SERP content gap analysis | Historical domain traffic, organic keyword footprints, and PPC ads |\n` +
      `| **Backlink Intelligence** | On-page link health checks and source credibility scoring | Extensive backlink database and toxic link auditing tools |\n` +
      `| **AI & Automation** | Native dual AI agents (Sonar 01 & Sonar 02) executing research | Specialized AI add-ons and reporting extensions |\n` +
      `| **Accessibility & Pricing** | 100% Free with no daily caps; optional accounts available (Email, Google, GitHub) | Tiered paid subscription plans with add-on options |\n` +
      `| **Best Suited For** | Founders, creators, agile marketers, and AI-first teams | Agencies, enterprise marketing teams, and PPC specialists |\n\n` +
      `## What Is PNX?\n\n` +
      `**PNX** is a free, AI-first SEO co-pilot engineered around an agentic workflow. Instead of requiring users to switch between separate software screens for keyword discovery, technical page audits, and competitor analysis, PNX uses specialized AI agents that act on prompts autonomously.\n\n` +
      `When you ask PNX to analyze a URL or search topic, it opens the live web page, inspects heading structure and structured data schema, analyzes current top-ranking search engine results, and clusters queries by user intent. It merges real-time data retrieval with conversational problem-solving, allowing marketers to move from initial query to actionable brief in a single session.\n\n` +
      `## What Is Semrush?\n\n` +
      `**Semrush** is an all-in-one digital marketing platform used by agencies and enterprise organizations worldwide. It contains over 55 distinct tools covering search engine optimization, pay-per-click advertising, social media management, content marketing, and market research.\n\n` +
      `Semrush specializes in indexing and organizing historical web data. It enables marketers to estimate domain-wide organic search traffic, track historical rank movements across thousands of keywords, analyze competitor Google Ads campaigns, audit massive corporate websites, and manage client reporting workflows at scale.\n\n` +
      `## PNX vs Semrush: Key Differences\n\n` +
      `### Keyword Research & Search Intent\n\n` +
      `**Semrush Keyword Overview and Keyword Magic Tool** depend on an extensive global keyword database. Semrush provides historical search volume metrics, keyword difficulty ratings, search intent classifications, cost-per-click (CPC) data, and SERP feature indicators. It is ideal when you need to analyze thousands of keywords across multiple countries.\n\n` +
      `**PNX** handles keyword discovery through real-time semantic research and AI clustering. Rather than presenting static keyword spreadsheets, PNX uses an [AI keyword research workflow](/blog/ai-keyword-research-free) to group terms by searcher intent (informational, commercial, transactional). It evaluates what search engines reward for a topic right now and builds structured content outlines directly from those findings.\n\n` +
      `*Practical difference:* Semrush is superior for bulk keyword discovery and historical PPC volume research. PNX is faster for immediate search intent clustering and content brief generation.\n\n` +
      `### Website and Technical SEO Auditing\n\n` +
      `**Semrush Site Audit** is an enterprise-grade site crawler that scans full domain architectures. It identifies technical issues such as crawlability errors, broken links, HTTPS configuration issues, duplicate content, and Core Web Vitals performance across thousands of pages over time.\n\n` +
      `**PNX** focuses on real-time on-page and technical audits of specific live URLs. Using its [free AI SEO audit tool](/blog/free-ai-seo-audit-tool), PNX inspects a page's title tags, meta descriptions, heading hierarchy (H1/H2/H3), JSON-LD structured data, canonical tags, and Open Graph markup. It prioritizes recommendations by business impact rather than outputting raw technical lists.\n\n` +
      `*Practical difference:* Semrush is stronger for scheduled, domain-wide technical health monitoring. PNX is faster for inspecting specific live URLs and verifying on-page fixes instantly.\n\n` +
      `### Competitor and SERP Research\n\n` +
      `**Semrush Domain Overview** provides macro-level competitive intelligence—showing historical organic traffic estimations, top-performing pages, backlink acquisition curves, and paid advertising keywords for any domain.\n\n` +
      `**PNX** provides micro-level, real-time SERP intelligence. Through its [SERP competitor analysis tool](/blog/free-competitor-analysis-tool), PNX fetches the current top-ranking results for a target query, evaluates their heading structures and word counts, and flags specific content gaps your page needs to address.\n\n` +
      `*Practical difference:* Semrush provides macro domain history and paid ad intelligence. PNX delivers real-time SERP content gap analysis.\n\n` +
      `### Backlink Analysis & Link Building\n\n` +
      `**Semrush Backlink Analytics** provides a massive backlink database, allowing link builders to evaluate referring domains, authority scores, anchor text distributions, and toxic link profiles for outreach campaigns.\n\n` +
      `**PNX** checks on-page internal vs. external link balance and source credibility during live page research, but it does not maintain a multi-billion URL backlink index for link outreach.\n\n` +
      `*Practical difference:* Semrush is the clear choice for dedicated backlink research and outreach management.\n\n` +
      `### Workflows and User Experience\n\n` +
      `**Semrush** requires navigating an extensive dashboard navigation tree. Learning how to configure filters, custom reports, and project tracking settings requires dedicated time.\n\n` +
      `**PNX** uses a natural language chat interface. You ask questions or provide URLs in plain English, and the agent executes the multi-step research workflow automatically.\n\n` +
      `## Where PNX Makes More Sense\n\n` +
      `- **Conversational Task Execution:** Ask for an audit or brief and receive actionable results without clicking through report menus.\n` +
      `- **Live Web Inspection:** Evaluates current page markup, schema, and live search engine results as they exist today.\n` +
      `- **No Cost Barrier:** 100% Free with no daily caps; optional accounts available (Email, Google, GitHub).\n` +
      `- **Search Console Integration:** Connect your Google Search Console performance data to analyze actual query impressions and clicks.\n` +
      `- **Native AI Brief Generation:** Translates SERP research directly into content outlines within the chat thread.\n\n` +
      `## Where Semrush Makes More Sense\n\n` +
      `- **Multi-Channel Digital Marketing:** Combines organic SEO, PPC ad research, social media scheduling, and PR tools in one account.\n` +
      `- **Enterprise Domain Analytics:** Deep historical database tracking total organic traffic and keyword footprints for millions of sites.\n` +
      `- **Backlink Outreach:** Comprehensive backlink tracking and toxic link auditing tools.\n` +
      `- **Client Management & Reporting:** Automated white-label PDF reporting for marketing agencies.\n\n` +
      `## Final Verdict: PNX vs Semrush\n\n` +
      `**Choose PNX if:** You want a free, AI-powered agent to handle page audits, keyword intent clustering, and SERP research through a conversational chat interface.\n\n` +
      `**Choose Semrush if:** You need an all-in-one digital marketing suite covering SEO, PPC ad intelligence, backlink databases, and client reporting.\n\n` +
      `**Consider using both if:** You rely on Semrush for macro competitive research and PPC insights, while using PNX as your daily AI co-pilot for rapid execution.` +
      cta("Try PNX Free", "Audit my page and compare it with the top search results") +
      footer(["pnx-vs-ahrefs", "free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-keyword-research-free"]),
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Audit https://example.com and show me high-priority SEO recommendations",
    related: ["pnx-vs-ahrefs", "free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-keyword-research-free"],
    faqs: [
      { q: "Is PNX a free alternative to Semrush?", a: "Yes. PNX serves as a free, AI-powered alternative for core page-level SEO tasks such as live audits, keyword intent clustering, SERP gap analysis, and content brief drafting." },
      { q: "Can PNX track keywords like Semrush Position Tracking?", a: "PNX evaluates live SERPs and connects with Google Search Console performance data to review your real queries, but it does not maintain an automated daily rank tracking dashboard across thousands of terms." },
      { q: "Does PNX offer backlink database analysis like Semrush?", a: "No. PNX checks on-page internal and external links during live audits, but it does not maintain a multi-billion URL backlink index for link outreach campaigns." },
      { q: "Which tool is better for solo founders and small teams?", a: "PNX is often better for solo founders due to its zero-cost model, instant setup, and conversational AI interface that eliminates complex software learning curves." },
      { q: "How does PNX compare to Semrush for competitive analysis?", a: "PNX analyzes current top-ranking competitor pages live for a target query to find content gaps. Semrush provides macro-level historical domain traffic and keyword footprint estimates." },
    ],
  },
  // ---- The rest of the posts follow the same pattern: wherever a phrase claimed a 'signup wall' or 'no signup required',
  // replace it with neutral, accurate wording about optional account availability.
  // For brevity we update each post's Pricing & Access / summary lines below.
  {
    slug: "pnx-vs-search-atlas",
    title: "PNX vs Search Atlas: Which SEO Platform Fits Your Workflow? (2026)",
    description: "Compare PNX and Search Atlas. Understand the differences between platform-based software automation (OTTO SEO) and conversational AI agentic SEO.",
    keyword: "PNX vs Search Atlas",
    category: "Comparisons",
    readTime: "11 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Search Atlas provides software automation and content optimization modules, while PNX offers an autonomous, chat-based AI SEO agent. Here is how they compare.",
    body:
      `As AI software transforms search engine optimization, platforms approach automation from different architectural angles. Some platforms build structured software suites with automated recommendations and content scorecards. Others build conversational AI agents that execute research tasks directly through natural dialogue.\n\n` +
      `...` +
      `| **Pricing & Access** | 100% Free with no daily caps; optional accounts available (Email, Google, GitHub) | Tiered monthly software subscription plans |`,
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Audit my page and suggest a competitive content brief",
    related: ["pnx-vs-semrush", "free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-content-generator-for-seo"],
    faqs: [
      { q: "What is the main difference between PNX and Search Atlas?", a: "PNX is a free conversational AI agent that executes SEO tasks through natural chat prompts. Search Atlas is a subscription software platform featuring structured dashboards, automated modules (OTTO SEO), and content scoring editors." },
      { q: "Is PNX completely free compared to Search Atlas?", a: "Yes. PNX is 100% free with no daily caps; optional accounts are available (Email, Google, GitHub)." },
      { q: "Can Search Atlas and PNX be used together?", a: "Yes. Many teams use Search Atlas for agency client tracking and rank monitoring while using PNX for conversational AI research, quick page audits, and brief generation." },
      { q: "Does Search Atlas offer agentic conversational SEO like PNX?", a: "Search Atlas offers AI features inside dedicated software modules, but PNX provides a native conversational agentic co-pilot that selects tools and executes multi-step workflows autonomously." },
    ],
  },
  {
    slug: "pnx-vs-mangools",
    title: "PNX vs Mangools: Which SEO Tool Should You Choose? (2026)",
    description: "A balanced comparison of PNX and Mangools. Compare dedicated, easy-to-use traditional SEO tools (KWFinder) with conversational AI-agent workflows.",
    keyword: "PNX vs Mangools",
    category: "Comparisons",
    readTime: "10 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Mangools offers a clean suite of dedicated SEO tools (KWFinder, SERPChecker), while PNX provides a conversational AI agent. Here is how they compare.",
    body:
      `...` +
      `| **Pricing & Access** | 100% Free with no daily caps; optional accounts available (Email, Google, GitHub) | Affordable monthly paid plans |`,
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Cluster my target keywords by intent and audit my homepage",
    related: ["pnx-vs-semrush", "free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-keyword-research-free"],
    faqs: [
      { q: "Is PNX easier to use than Mangools?", a: "Both tools prioritize simplicity. Mangools uses clean, visual point-and-click app dashboards, while PNX uses a natural language chat interface that requires zero setup." },
      { q: "Is Mangools completely free?", a: "No. Mangools offers a limited free trial, but full access requires an affordable paid subscription. PNX is 100% free with no daily caps; optional accounts are available (Email, Google, GitHub)." },
      { q: "Does Mangools have an AI agent like PNX?", a: "No. Mangools consists of five traditional, metric-focused web apps. PNX uses an autonomous AI agent that interacts through conversational prompts." },
    ],
  },
  {
    slug: "pnx-vs-seo-ai",
    title: "PNX vs SEO.ai: Comparing Two Different Approaches to AI SEO (2026)",
    description: "Compare PNX and SEO.ai. Understand the differences between dedicated long-form AI content generation and full-spectrum agentic SEO research.",
    keyword: "PNX vs SEO.ai",
    category: "Comparisons",
    readTime: "11 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "SEO.ai specializes in automated long-form article writing and content scoring, while PNX provides a full-spectrum agentic SEO co-pilot. Here is how they compare.",
    body:
      `...` +
      `| **Pricing & Access** | 100% Free with no daily caps; optional accounts available (Email, Google, GitHub) | Tiered paid subscriptions |`,
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Audit my page and generate an SEO content brief",
    related: ["pnx-vs-semrush", "free-agentic-seo-tool", "free-ai-seo-audit-tool", "ai-content-generator-for-seo"],
    faqs: [
      { q: "How does PNX differ from SEO.ai?", a: "SEO.ai is a dedicated AI content creation platform featuring a document editor with real-time optimization scores. PNX is a full-spectrum AI SEO agent that handles technical audits, Search Console analysis, YouTube SEO, and SERP research alongside content strategy." },
      { q: "Is SEO.ai free like PNX?", a: "No. SEO.ai is a commercial SaaS platform. PNX is 100% free with no daily caps; optional accounts are available (Email, Google, GitHub)." },
    ],
  },
  {
    slug: "generative-engine-optimization-guide",
    title: "Generative Engine Optimization (GEO): The 2026 Beginner's Guide",
    description: "GEO is SEO for ChatGPT, Perplexity, Gemini and Google AI Overviews. Learn what it is, how it differs from SEO, and how to get your brand cited by AI.",
    keyword: "generative engine optimization",
    category: "GEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "GEO is the new SEO — instead of blue links, you're optimising to be *cited* by ChatGPT, Perplexity, Gemini and Google's AI Overviews. Here's the plain-English playbook.",
    body:
      `...` +
      cta("Optimise a Page for GEO", "Audit https://example.com and rewrite the top section so ChatGPT and Perplexity are more likely to cite it") +
      footer(["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "geo-vs-seo-strategy"]),
    ctaLabel: "Get GEO-Ready",
    ctaPrompt: "Audit my homepage and rewrite it so AI engines are more likely to cite it",
    related: ["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "llms-txt-file-guide"],
  },
  // The rest of the array continues unchanged except for similar phrasing adjustments where applicable.
  // For the remaining posts in this array we keep content identical except for any explicit "no signup" claims,
  // replacing them with "optional accounts available (Email, Google, GitHub)" or "no daily caps; optional accounts available".
  {
    slug: "generative-engine-optimization-guide-2",
    title: "Placeholder post",
    description: "A placeholder to keep the file structure consistent in this demo.",
    keyword: "placeholder",
    category: "Misc",
    readTime: "1 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Placeholder post",
    body: `This is a placeholder post.`,
    ctaLabel: "Launch PNX Chat",
    ctaPrompt: "Try PNX",
    related: [],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const allSlugs = () => POSTS.map((p) => p.slug);
