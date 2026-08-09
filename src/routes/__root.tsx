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
      // Hreflang for international SEO — x-default catches all languages/regions
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
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}