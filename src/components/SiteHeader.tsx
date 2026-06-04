import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import pnxLogo from "@/assets/pnx-logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src={pnxLogo} alt="PNX AI SEO platform" width={28} height={28} className="rounded-md" />
          <span className="text-base">PNX</span>
          <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground ml-1 rounded-full border px-2 py-0.5">Free · No limits</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-1.5 rounded-md hover:bg-accent text-foreground/80 hover:text-foreground" activeProps={{ className: "px-3 py-1.5 rounded-md bg-accent text-foreground font-medium" }}>{n.label}</Link>
          ))}
          <Link to="/chat" className="ml-2 cta-glass !py-1.5 !px-4 !text-sm" aria-label="Launch PNX Chat — free AI SEO agent">Launch PNX Chat</Link>
        </nav>
        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t glass">
          <nav className="px-4 py-3 flex flex-col gap-1 text-sm">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-accent">{n.label}</Link>
            ))}
            <Link to="/chat" onClick={() => setOpen(false)} className="cta-glass mt-2 self-start" aria-label="Launch PNX Chat — free AI SEO agent">Launch PNX Chat</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
