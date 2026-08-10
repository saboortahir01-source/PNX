import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModal } from "@/components/AuthModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0b0b14" },
      { name: "format-detection", content: "telephone=no" },
      { name: "google-site-verification", content: "google660a35f49eb986f6" },
      { title: "PNX | Agentic SEO & AI Search Discovery" },
      { name: "description", content: "Master 2026 search with PNX. Autonomous Agentic SEO for Gap Discovery, Semantic Mapping, and ranking in AI Overviews." },
      { name: "author", content: "Lovable" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "PNX | Agentic SEO & AI Search Discovery" },
      { property: "og:description", content: "Master 2026 search with PNX. Autonomous Agentic SEO for Gap Discovery, Semantic Mapping, and ranking in AI Overviews." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pnx.lovable.app/" },
      { property: "og:site_name", content: "PNX" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "PNX | Agentic SEO & AI Search Discovery" },
      { name: "twitter:description", content: "Master 2026 search with PNX. Autonomous Agentic SEO for Gap Discovery, Semantic Mapping, and ranking in AI Overviews." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3f5ad49d-3f98-45c3-b031-ddc8f0f76e0c/id-preview-a5d15428--f05d2fc9-caa7-489c-a74f-64a6dc418de5.lovable.app-1778937460612.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3f5ad49d-3f98-45c3-b031-ddc8f0f76e0c/id-preview-a5d15428--f05d2fc9-caa7-489c-a74f-64a6dc418de5.lovable.app-1778937460612.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap",
      },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/" },
    ],
    scripts: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-2MT0HT3T33",
      },
      {
        children: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-2MT0HT3T33');",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "PNX",
              applicationCategory: "BusinessApplication",
              applicationSubCategory: "SEO Tool",
              operatingSystem: "Web",
              url: "https://pnx.lovable.app/",
              description:
                "PNX is a free agentic SEO tool — on-page SEO audits, technical SEO, AI keyword research and clustering, SERP competitor analysis, YouTube SEO and AI content generation. 100% free, no daily limits.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: [
                "Free agentic SEO tool",
                "AI SEO strategist",
                "On-page SEO audit",
                "Technical SEO audit",
                "Free AI SEO audit tool",
                "AI content generator for SEO",
                "AI keyword research",
                "Free keyword research tool",
                "Keyword clustering by search intent",
                "SERP analysis",
                "SEO competitor analysis",
                "Free competitor analysis tool",
                "YouTube SEO analyzer",
                "Free YouTube SEO tools",
                "YouTube SEO keywords research",
                "Free YouTube keyword research",
                "YouTube SEO strategist",
                "Agentic SEO automation",
              ],
              author: { "@type": "Person", name: "Saboor Tahir" },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "128",
              },
            },
            {
              "@type": "Organization",
              name: "PNX",
              url: "https://pnx.lovable.app/",
              logo: "https://pnx.lovable.app/favicon.png",
              founder: { "@type": "Person", name: "Saboor Tahir" },
              contactPoint: { "@type": "ContactPoint", email: "saboortahir01@gmail.com", contactType: "customer support" },
              sameAs: [
                "https://medium.com/@saboortahir",
                "https://pnx.lovable.app/about",
              ],
            },
            {
              "@type": "Person",
              name: "Saboor Tahir",
              jobTitle: "Founder, PNX",
              url: "https://pnx.lovable.app/about",
              image: "https://pnx.lovable.app/saboor-tahir.png",
              worksFor: { "@type": "Organization", name: "PNX" },
              sameAs: ["https://medium.com/@saboortahir"],
            },
            {
              "@type": "WebSite",
              name: "PNX",
              url: "https://pnx.lovable.app/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://pnx.lovable.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <AuthModal />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
</dyad-file>

Let's also check `src/routes/chat.$threadId.tsx` header to include `UserMenu` so users in `/chat` can also see their profile / sign in button.

<dyad-write path="src/routes/chat.$threadId.tsx" description="Adding UserMenu to the chat header navigation">
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";
import { ChatWindow } from "@/components/ChatWindow";
import { ThreadSidebar } from "@/components/ThreadSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import pnxLogo from "@/assets/pnx-logo.png";
import { UserMenu } from "@/components/UserMenu";
import {
  createThread,
  deriveTitle,
  loadThreads,
  saveThreads,
  type Thread,
} from "@/lib/threads";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "PNX SEO AI Agent Chat — Free Audits" },
      {
        name: "description",
        content:
          "Chat with PNX, your free AI SEO agent. Run on-page SEO audits, cluster keywords, analyse SERP competitors, and generate content strategies instantly.",
      },
      { property: "og:title", content: "PNX SEO AI Agent Chat" },
      { property: "og:description", content: "Chat with PNX — run free AI SEO audits, keyword research, SERP analysis and content strategies." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pnx.lovable.app/chat" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

function ChatPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = loadThreads();
    if (existing.length === 0) {
      const t = createThread();
      saveThreads([t]);
      setThreads([t]);
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
      return;
    }
    if (!existing.find((t) => t.id === threadId)) {
      const t: Thread = {
        id: threadId,
        title: "New conversation",
        updatedAt: Date.now(),
        messages: [],
      };
      const next = [t, ...existing];
      saveThreads(next);
      setThreads(next);
      return;
    }
    setThreads(existing);
  }, [threadId, navigate]);

  const activeThread = useMemo(
    () => threads?.find((t) => t.id === threadId) ?? null,
    [threads, threadId],
  );

  const handleNew = useCallback(() => {
    const t = createThread();
    setThreads((prev) => {
      const next = [t, ...(prev ?? [])];
      saveThreads(next);
      return next;
    });
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }, [navigate]);

  const handleDelete = useCallback(
    (id: string) => {
      setThreads((prev) => {
        const filtered = (prev ?? []).filter((t) => t.id !== id);
        if (filtered.length === 0) {
          const t = createThread();
          saveThreads([t]);
          navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
          return [t];
        }
        saveThreads(filtered);
        return filtered;
      });
    },
    [navigate],
  );

  const handleMessagesChange = useCallback(
    (messages: UIMessage[]) => {
      setThreads((prev) => {
        if (!prev) return prev;
        let changed = false;
        const next = prev.map((t) => {
          if (t.id !== threadId) return t;
          if (t.messages === messages) return t;
          changed = true;
          const newTitle =
            t.title === "New conversation"
              ? deriveTitle(messages) ?? t.title
              : t.title;
          return { ...t, messages, title: newTitle, updatedAt: Date.now() };
        });
        if (changed) saveThreads(next);
        return changed ? next : prev;
      });
    },
    [threadId],
  );

  if (!threads || !activeThread) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-4 bg-background"
        style={{ backgroundImage: "var(--gradient-surface)" }}
        role="status"
        aria-label="Loading conversation"
      >
        <div className="glass flex size-16 items-center justify-center rounded-2xl shadow-[var(--shadow-elegant)]">
          <img src={pnxLogo} alt="PNX agentic SEO tool" className="size-12 object-contain animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your SEO workspace…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="hidden md:flex">
          <ThreadSidebar
            threads={threads}
            activeId={threadId}
            onNew={handleNew}
            onDelete={handleDelete}
          />
        </div>
      )}
      <main className="flex h-full min-w-0 flex-1 flex-col">
        <h1 className="sr-only">PNX AI SEO Agent Chat</h1>
        <header className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 glass">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="hidden md:inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground transition-colors hover:bg-accent"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
            </button>
            <Sheet>
              <SheetTrigger
                aria-label="Open conversations"
                className="md:hidden inline-flex size-9 items-center justify-center rounded-xl border border-border/60 bg-card/70 text-foreground"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[19rem] border-r-0 p-0">
                <VisuallyHidden>
                  <SheetTitle>Conversations</SheetTitle>
                </VisuallyHidden>
                <ThreadSidebar
                  threads={threads}
                  activeId={threadId}
                  onNew={handleNew}
                  onDelete={handleDelete}
                />
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2" aria-label="PNX home">
              <img src={pnxLogo} alt="PNX agentic SEO tool" className="size-7 rounded-lg" />
              <span className="text-sm font-semibold tracking-tight">PNX</span>
              <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-widest text-muted-foreground">SEO Agent</span>
            </Link>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/" className="hidden sm:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">Home</Link>
            <Link to="/blog" className="hidden sm:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">Blog</Link>
            <Link to="/about" className="hidden md:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">About</Link>
            <Link to="/faq" className="hidden md:inline-flex px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80">FAQ</Link>
            <button
              onClick={handleNew}
              className="ml-1 cta-glass !py-1.5 !px-3 !text-xs"
              aria-label="New chat"
            >
              + New
            </button>
            <div className="ml-2 pl-2 border-l border-border/60">
              <UserMenu />
            </div>
          </nav>
        </header>
        <ChatWindow
          key={threadId}
          threadId={threadId}
          initialMessages={activeThread.messages}
          onMessagesChange={handleMessagesChange}
        />
      </main>
    </div>
  );
}
</dyad-file>

Now let's check if database integration tag is required for connecting the database if it hasn't been connected yet.

<dyad-add-integration></dyad-add-integration>

<dyad-chat-summary>Implement complete premium authentication system for PNX</dyad-chat-summary>

I have implemented a complete, SaaS-quality authentication system for PNX using Supabase Auth.

Here is the implementation summary:

### 1. Files Created/Modified
- `src/lib/supabase.ts` — Initialized Supabase client and profile fetch/upsert helpers.
- `src/lib/auth-context.tsx` — Created Auth Context managing user sessions, profile hydration, modal views, pending prompt preservation, and sign-out logic.
- `src/components/AuthModal.tsx` — Premium SaaS auth dialog supporting Google, Apple, Email/Password, Email Verification, Password Reset, and 2-question Onboarding.
- `src/components/UserMenu.tsx` — Header avatar dropdown menu displaying user profile info, preferences, security link, and sign-out option.
- `src/routes/reset-password.tsx` — Secure password reset page route for email password recovery links.
- `src/routes/__root.tsx` — Wrapped application with `AuthProvider` and mounted `AuthModal`.
- `src/components/SiteHeader.tsx` & `src/routes/chat.$threadId.tsx` — Integrated `UserMenu` into top navigation headers.
- `src/components/ChatWindow.tsx` — Intercepted chat prompt submission for logged-out users, preserving typed prompts and automatically executing them upon successful authentication.

### 2. Supabase Tables Created/Required
`profiles` table schema:
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT,
  use_case TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. RLS Policies Created/Required
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 4. Auth Providers Implemented
- Google OAuth (Primary social option)
- Apple Sign-In
- Email + Password (with Email Verification & Password Reset)

### 5. What Still Requires Configuration in Supabase
- **Google OAuth**: Enable Google under *Authentication -> Providers* in the Supabase Dashboard and add your Google Client ID and Secret.
- **Site URL / Redirect URLs**: Set your site domain in *Authentication -> URL Configuration* (e.g. `https://pnx.lovable.app/reset-password`).

### 6. Auth-on-First-Chat Flow
When a logged-out visitor types an AI prompt in PNX chat and hits Send or clicks a suggestion card, the prompt is intercepted, preserved in `pendingPrompt` state (and `sessionStorage` for OAuth redirects), and the Auth Modal opens.

### 7. Prompt Preservation Across Auth
Yes. The prompt is preserved seamlessly across email signup, login, and OAuth redirects. As soon as the user authenticates, PNX automatically submits their saved prompt to the AI agent.

### 8. Email Verification
Yes. Built using Supabase's `signUp` and `resend` API with human-readable UI notices and resend controls.

### 9. Password Reset
Yes. Includes "Forgot password?" modal view and a dedicated `/reset-password` route page.

### 10. Google Sign-in Status
Fully integrated via `supabase.auth.signInWithOAuth({ provider: 'google' })`.

### 11. Apple Sign-in Status
Fully integrated via `supabase.auth.signInWithOAuth({ provider: 'apple' })`. If not enabled in the Supabase dashboard yet, the UI provides clear instructions without breaking.

### 12. Environment Variables Required
Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in environment variables.<dyad-write path="src/routeTree.gen.ts" description="Updating routeTree.gen.ts to include the new reset-password route">
/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AboutRouteImport } from './routes/about'
import { Route as ChatRouteImport } from './routes/chat'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as DisclaimerRouteImport } from './routes/disclaimer'
import { Route as FaqRouteImport } from './routes/faq'
import { Route as GoogleOauthVerificationRouteImport } from './routes/google-oauth-verification'
import { Route as McpRouteImport } from './routes/mcp'
import { Route as PrivacyRouteImport } from './routes/privacy'
import { Route as ResetPasswordRouteImport } from './routes/reset-password'
import { Route as SitemapDotxmlRouteImport } from './routes/sitemap[.]xml'
import { Route as TermsRouteImport } from './routes/terms'
import { Route as Char91DotmcpChar93ListToolsRouteImport } from './routes/[.mcp]/list-tools'
import { Route as Char91DotwellKnownChar93OauthProtectedResourceRouteImport } from './routes/[.well-known]/oauth-protected-resource'
import { Route as ApiChatRouteImport } from './routes/api/chat'
import { Route as ApiExportPdfRouteImport } from './routes/api/export-pdf'
import { Route as BlogIndexRouteImport } from './routes/blog.index'
import { Route as BlogSlugRouteImport } from './routes/blog.$slug'
import { Route as ChatIndexRouteImport } from './routes/chat.index'
import { Route as ChatThreadIdRouteImport } from './routes/chat.$threadId'
import { Route as Char91DotmcpChar93InvokeToolToolRouteImport } from './routes/[.mcp]/invoke-tool/$tool'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const ChatRoute = ChatRouteImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRouteImport,
} as any)
const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const DisclaimerRoute = DisclaimerRouteImport.update({
  id: '/disclaimer',
  path: '/disclaimer',
  getParentRoute: () => rootRouteImport,
} as any)
const FaqRoute = FaqRouteImport.update({
  id: '/faq',
  path: '/faq',
  getParentRoute: () => rootRouteImport,
} as any)
const GoogleOauthVerificationRoute = GoogleOauthVerificationRouteImport.update({
  id: '/google-oauth-verification',
  path: '/google-oauth-verification',
  getParentRoute: () => rootRouteImport,
} as any)
const McpRoute = McpRouteImport.update({
  id: '/mcp',
  path: '/mcp',
  getParentRoute: () => rootRouteImport,
} as any)
const PrivacyRoute = PrivacyRouteImport.update({
  id: '/privacy',
  path: '/privacy',
  getParentRoute: () => rootRouteImport,
} as any)
const ResetPasswordRoute = ResetPasswordRouteImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRouteImport,
} as any)
const SitemapDotxmlRoute = SitemapDotxmlRouteImport.update({
  id: '/sitemap.xml',
  path: '/sitemap.xml',
  getParentRoute: () => rootRouteImport,
} as any)
const TermsRoute = TermsRouteImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => rootRouteImport,
} as any)
const Char91DotmcpChar93ListToolsRoute =
  Char91DotmcpChar93ListToolsRouteImport.update({
    id: '/.mcp/list-tools',
    path: '/.mcp/list-tools',
    getParentRoute: () => rootRouteImport,
  } as any)
const Char91DotwellKnownChar93OauthProtectedResourceRoute =
  Char91DotwellKnownChar93OauthProtectedResourceRouteImport.update({
    id: '/.well-known/oauth-protected-resource',
    path: '/.well-known/oauth-protected-resource',
    getParentRoute: () => rootRouteImport,
  } as any)
const ApiChatRoute = ApiChatRouteImport.update({
  id: '/api/chat',
  path: '/api/chat',
  getParentRoute: () => rootRouteImport,
} as any)
const ApiExportPdfRoute = ApiExportPdfRouteImport.update({
  id: '/api/export-pdf',
  path: '/api/export-pdf',
  getParentRoute: () => rootRouteImport,
} as any)
const BlogIndexRoute = BlogIndexRouteImport.update({
  id: '/blog/',
  path: '/blog/',
  getParentRoute: () => rootRouteImport,
} as any)
const BlogSlugRoute = BlogSlugRouteImport.update({
  id: '/blog/$slug',
  path: '/blog/$slug',
  getParentRoute: () => rootRouteImport,
} as any)
const ChatIndexRoute = ChatIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ChatRoute,
} as any)
const ChatThreadIdRoute = ChatThreadIdRouteImport.update({
  id: '/$threadId',
  path: '/$threadId',
  getParentRoute: () => ChatRoute,
} as any)
const Char91DotmcpChar93InvokeToolToolRoute =
  Char91DotmcpChar93InvokeToolToolRouteImport.update({
    id: '/.mcp/invoke-tool/$tool',
    path: '/.mcp/invoke-tool/$tool',
    getParentRoute: () => rootRouteImport,
  } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/chat': typeof ChatRouteWithChildren
  '/contact': typeof ContactRoute
  '/disclaimer': typeof DisclaimerRoute
  '/faq': typeof FaqRoute
  '/google-oauth-verification': typeof GoogleOauthVerificationRoute
  '/mcp': typeof McpRoute
  '/privacy': typeof PrivacyRoute
  '/reset-password': typeof ResetPasswordRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/terms': typeof TermsRoute
  '/.mcp/list-tools': typeof Char91DotmcpChar93ListToolsRoute
  '/.well-known/oauth-protected-resource': typeof Char91DotwellKnownChar93OauthProtectedResourceRoute
  '/api/chat': typeof ApiChatRoute
  '/api/export-pdf': typeof ApiExportPdfRoute
  '/blog/$slug': typeof BlogSlugRoute
  '/chat/$threadId': typeof ChatThreadIdRoute
  '/blog/': typeof BlogIndexRoute
  '/chat/': typeof ChatIndexRoute
  '/.mcp/invoke-tool/$tool': typeof Char91DotmcpChar93InvokeToolToolRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/contact': typeof ContactRoute
  '/disclaimer': typeof DisclaimerRoute
  '/faq': typeof FaqRoute
  '/google-oauth-verification': typeof GoogleOauthVerificationRoute
  '/mcp': typeof McpRoute
  '/privacy': typeof PrivacyRoute
  '/reset-password': typeof ResetPasswordRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/terms': typeof TermsRoute
  '/.mcp/list-tools': typeof Char91DotmcpChar93ListToolsRoute
  '/.well-known/oauth-protected-resource': typeof Char91DotwellKnownChar93OauthProtectedResourceRoute
  '/api/chat': typeof ApiChatRoute
  '/api/export-pdf': typeof ApiExportPdfRoute
  '/blog/$slug': typeof BlogSlugRoute
  '/chat/$threadId': typeof ChatThreadIdRoute
  '/blog': typeof BlogIndexRoute
  '/chat': typeof ChatIndexRoute
  '/.mcp/invoke-tool/$tool': typeof Char91DotmcpChar93InvokeToolToolRoute
}

export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/chat': typeof ChatRouteWithChildren
  '/contact': typeof ContactRoute
  '/disclaimer': typeof DisclaimerRoute
  '/faq': typeof FaqRoute
  '/google-oauth-verification': typeof GoogleOauthVerificationRoute
  '/mcp': typeof McpRoute
  '/privacy': typeof PrivacyRoute
  '/reset-password': typeof ResetPasswordRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/terms': typeof TermsRoute
  '/.mcp/list-tools': typeof Char91DotmcpChar93ListToolsRoute
  '/.well-known/oauth-protected-resource': typeof Char91DotwellKnownChar93OauthProtectedResourceRoute
  '/api/chat': typeof ApiChatRoute
  '/api/export-pdf': typeof ApiExportPdfRoute
  '/blog/$slug': typeof BlogSlugRoute
  '/chat/$threadId': typeof ChatThreadIdRoute
  '/blog/': typeof BlogIndexRoute
  '/chat/': typeof ChatIndexRoute
  '/.mcp/invoke-tool/$tool': typeof Char91DotmcpChar93InvokeToolToolRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/chat'
    | '/contact'
    | '/disclaimer'
    | '/faq'
    | '/google-oauth-verification'
    | '/mcp'
    | '/privacy'
    | '/reset-password'
    | '/sitemap.xml'
    | '/terms'
    | '/.mcp/list-tools'
    | '/.well-known/oauth-protected-resource'
    | '/api/chat'
    | '/api/export-pdf'
    | '/blog/$slug'
    | '/chat/$threadId'
    | '/blog/'
    | '/chat/'
    | '/.mcp/invoke-tool/$tool'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/contact'
    | '/disclaimer'
    | '/faq'
    | '/google-oauth-verification'
    | '/mcp'
    | '/privacy'
    | '/reset-password'
    | '/sitemap.xml'
    | '/terms'
    | '/.mcp/list-tools'
    | '/.well-known/oauth-protected-resource'
    | '/api/chat'
    | '/api/export-pdf'
    | '/blog/$slug'
    | '/chat/$threadId'
    | '/blog'
    | '/chat'
    | '/.mcp/invoke-tool/$tool'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/chat'
    | '/contact'
    | '/disclaimer'
    | '/faq'
    | '/google-oauth-verification'
    | '/mcp'
    | '/privacy'
    | '/reset-password'
    | '/sitemap.xml'
    | '/terms'
    | '/.mcp/list-tools'
    | '/.well-known/oauth-protected-resource'
    | '/api/chat'
    | '/api/export-pdf'
    | '/blog/$slug'
    | '/chat/$threadId'
    | '/blog/'
    | '/chat/'
    | '/.mcp/invoke-tool/$tool'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  ChatRoute: typeof ChatRouteWithChildren
  ContactRoute: typeof ContactRoute
  DisclaimerRoute: typeof DisclaimerRoute
  FaqRoute: typeof FaqRoute
  GoogleOauthVerificationRoute: typeof GoogleOauthVerificationRoute
  McpRoute: typeof McpRoute
  PrivacyRoute: typeof PrivacyRoute
  ResetPasswordRoute: typeof ResetPasswordRoute
  SitemapDotxmlRoute: typeof SitemapDotxmlRoute
  TermsRoute: typeof TermsRoute
  Char91DotmcpChar93ListToolsRoute: typeof Char91DotmcpChar93ListToolsRoute
  Char91DotwellKnownChar93OauthProtectedResourceRoute: typeof Char91DotwellKnownChar93OauthProtectedResourceRoute
  ApiChatRoute: typeof ApiChatRoute
  ApiExportPdfRoute: typeof ApiExportPdfRoute
  BlogSlugRoute: typeof BlogSlugRoute
  BlogIndexRoute: typeof BlogIndexRoute
  Char91DotmcpChar93InvokeToolToolRoute: typeof Char91DotmcpChar93InvokeToolToolRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/disclaimer': {
      id: '/disclaimer'
      path: '/disclaimer'
      fullPath: '/disclaimer'
      preLoaderRoute: typeof DisclaimerRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/faq': {
      id: '/faq'
      path: '/faq'
      fullPath: '/faq'
      preLoaderRoute: typeof FaqRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/google-oauth-verification': {
      id: '/google-oauth-verification'
      path: '/google-oauth-verification'
      fullPath: '/google-oauth-verification'
      preLoaderRoute: typeof GoogleOauthVerificationRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/mcp': {
      id: '/mcp'
      path: '/mcp'
      fullPath: '/mcp'
      preLoaderRoute: typeof McpRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/privacy': {
      id: '/privacy'
      path: '/privacy'
      fullPath: '/privacy'
      preLoaderRoute: typeof PrivacyRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/sitemap.xml': {
      id: '/sitemap.xml'
      path: '/sitemap.xml'
      fullPath: '/sitemap.xml'
      preLoaderRoute: typeof SitemapDotxmlRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/terms': {
      id: '/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof TermsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/.mcp/list-tools': {
      id: '/.mcp/list-tools'
      path: '/.mcp/list-tools'
      fullPath: '/.mcp/list-tools'
      preLoaderRoute: typeof Char91DotmcpChar93ListToolsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/.well-known/oauth-protected-resource': {
      id: '/.well-known/oauth-protected-resource'
      path: '/.well-known/oauth-protected-resource'
      fullPath: '/.well-known/oauth-protected-resource'
      preLoaderRoute: typeof Char91DotwellKnownChar93OauthProtectedResourceRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/api/chat': {
      id: '/api/chat'
      path: '/api/chat'
      fullPath: '/api/chat'
      preLoaderRoute: typeof ApiChatRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/api/export-pdf': {
      id: '/api/export-pdf'
      path: '/api/export-pdf'
      fullPath: '/api/export-pdf'
      preLoaderRoute: typeof ApiExportPdfRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/blog/': {
      id: '/blog/'
      path: '/blog'
      fullPath: '/blog/'
      preLoaderRoute: typeof BlogIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/blog/$slug': {
      id: '/blog/$slug'
      path: '/blog/$slug'
      fullPath: '/blog/$slug'
      preLoaderRoute: typeof BlogSlugRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/chat/': {
      id: '/chat/'
      path: '/'
      fullPath: '/chat/'
      preLoaderRoute: typeof ChatIndexRouteImport
      parentRoute: typeof ChatRoute
    }
    '/chat/$threadId': {
      id: '/chat/$threadId'
      path: '/$threadId'
      fullPath: '/chat/$threadId'
      preLoaderRoute: typeof ChatThreadIdRouteImport
      parentRoute: typeof ChatRoute
    }
    '/.mcp/invoke-tool/$tool': {
      id: '/.mcp/invoke-tool/$tool'
      path: '/.mcp/invoke-tool/$tool'
      fullPath: '/.mcp/invoke-tool/$tool'
      preLoaderRoute: typeof Char91DotmcpChar93InvokeToolToolRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

interface ChatRouteChildren {
  ChatThreadIdRoute: typeof ChatThreadIdRoute
  ChatIndexRoute: typeof ChatIndexRoute
}

const ChatRouteChildren: ChatRouteChildren = {
  ChatThreadIdRoute: ChatThreadIdRoute,
  ChatIndexRoute: ChatIndexRoute,
}

const ChatRouteWithChildren = ChatRoute._addFileChildren(ChatRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  ChatRoute: ChatRouteWithChildren,
  ContactRoute: ContactRoute,
  DisclaimerRoute: DisclaimerRoute,
  FaqRoute: FaqRoute,
  GoogleOauthVerificationRoute: GoogleOauthVerificationRoute,
  McpRoute: McpRoute,
  PrivacyRoute: PrivacyRoute,
  ResetPasswordRoute: ResetPasswordRoute,
  SitemapDotxmlRoute: SitemapDotxmlRoute,
  TermsRoute: TermsRoute,
  Char91DotmcpChar93ListToolsRoute: Char91DotmcpChar93ListToolsRoute,
  Char91DotwellKnownChar93OauthProtectedResourceRoute:
    Char91DotwellKnownChar93OauthProtectedResourceRoute,
  ApiChatRoute: ApiChatRoute,
  ApiExportPdfRoute: ApiExportPdfRoute,
  BlogSlugRoute: BlogSlugRoute,
  BlogIndexRoute: BlogIndexRoute,
  Char91DotmcpChar93InvokeToolToolRoute: Char91DotmcpChar93InvokeToolToolRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()