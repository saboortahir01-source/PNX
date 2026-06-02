import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

const EMAIL = "saboortahir01@gmail.com";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact PNX — Free SEO Tool Support by Saboor Tahir" },
      { name: "description", content: "Contact Saboor Tahir and the PNX team about the free agentic SEO tool, Google API integrations, or partnership ideas — we reply personally." },
      { property: "og:title", content: "Contact PNX" },
      { property: "og:description", content: "Reach Saboor Tahir & the PNX team." },
      { property: "og:url", content: "https://pnx.lovable.app/contact" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en-US", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en-CA", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en-AU", href: "https://pnx.lovable.app/contact" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://pnx.lovable.app/contact" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: "https://pnx.lovable.app/contact",
        mainEntity: { "@type": "Organization", name: "PNX", email: EMAIL },
      }),
    }],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const email = String(data.get("email") || "").trim().slice(0, 200);
    const message = String(data.get("message") || "").trim().slice(0, 2000);
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`PNX contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">We read every message. Real humans, real replies.</p>

        <div className="glass-card mt-10 p-6 sm:p-8 grid sm:grid-cols-[160px_1fr] gap-6 items-center">
          <img src="/saboor-tahir.png" alt="Saboor Tahir, founder of PNX" width={160} height={160} className="rounded-2xl object-cover size-40 border" />
          <div>
            <h2 className="text-xl font-semibold">Saboor Tahir</h2>
            <p className="text-sm text-muted-foreground">Founder, PNX</p>
            <a
              href={`mailto:${EMAIL}`}
              rel="noopener"
              className="cta-glass mt-4 inline-flex"
              aria-label="Email Saboor Tahir directly"
            >
              <Mail size={16}/> {EMAIL}
            </a>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Send a secure message</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Served over HTTPS. Your message opens in your own email app — nothing is stored or transmitted to a third-party server.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 glass-card p-6 grid gap-3" noValidate>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Your name</span>
            <input
              required
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              placeholder="Jane Doe"
              className="rounded-lg border bg-background px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Your email</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={200}
              placeholder="you@example.com"
              className="rounded-lg border bg-background px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">How can we help?</span>
            <textarea
              required
              name="message"
              autoComplete="off"
              maxLength={2000}
              placeholder="Your message…"
              rows={5}
              className="rounded-lg border bg-background px-3 py-2"
            />
          </label>
          <button type="submit" className="cta-glass self-start">Send →</button>
          {sent && (
            <p className="text-xs text-emerald-600">
              Opening your email app… If nothing happens, write to{" "}
              <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          )}
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}