import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact PNX — Free SEO Tool Support by Saboor Tahir" },
      { name: "description", content: "Contact Saboor Tahir and the PNX team. Questions, feedback or partnership ideas about the free agentic SEO tool — we respond personally." },
      { property: "og:title", content: "Contact PNX" },
      { property: "og:description", content: "Reach Saboor Tahir & the PNX team." },
      { property: "og:url", content: "https://pnx.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://pnx.lovable.app/contact" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: "https://pnx.lovable.app/contact",
        mainEntity: { "@type": "Organization", name: "PNX", email: "hello@pnx.lovable.app" },
      }),
    }],
  }),
});

function ContactPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">We read every message. Real humans, real replies.</p>

        <div className="glass-card mt-10 p-6 sm:p-8 grid sm:grid-cols-[160px_1fr] gap-6 items-center">
          <img src="/saboor-tahir.png" alt="Saboor Tahir" width={160} height={160} className="rounded-2xl object-cover size-40 border" />
          <div>
            <h2 className="text-xl font-semibold">Saboor Tahir</h2>
            <p className="text-sm text-muted-foreground">Founder, PNX</p>
            <a href="mailto:hello@pnx.lovable.app" className="cta-glass mt-4 inline-flex"><Mail size={16}/> hello@pnx.lovable.app</a>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Send a message</h2>
        <form action="mailto:hello@pnx.lovable.app" method="post" encType="text/plain" className="mt-4 glass-card p-6 grid gap-3">
          <input required name="name" placeholder="Your name" className="rounded-lg border bg-background px-3 py-2"/>
          <input required type="email" name="email" placeholder="Your email" className="rounded-lg border bg-background px-3 py-2"/>
          <textarea required name="message" placeholder="How can we help?" rows={5} className="rounded-lg border bg-background px-3 py-2"/>
          <button type="submit" className="cta-glass self-start">Send →</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
