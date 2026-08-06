import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { loadConnectors, parseGscCsv, saveConnectors, type ConnectorState } from "@/lib/connectors";

type Props = {
  state: ConnectorState;
  onChange: (next: ConnectorState) => void;
};

/**
 * Left-side composer control. Lets the user attach their own Google Search
 * Console data so PNX can advise on real impressions, clicks and positions
 * instead of generic best practice.
 */
export function ConnectorsMenu({ state, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ left: number; bottom: number; width: number } | null>(null);
  const [property, setProperty] = useState(state.gsc?.property ?? "");

  useEffect(() => setProperty(state.gsc?.property ?? ""), [state.gsc?.property]);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.min(340, window.innerWidth - 24);
      const left = Math.max(12, Math.min(r.left, window.innerWidth - width - 12));
      setPos({ left, bottom: window.innerHeight - r.top + 8, width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  const connected = Boolean(state.gsc);

  const handleFile = async (file: File) => {
    try {
      const rows = parseGscCsv(await file.text());
      if (rows.length === 0) {
        toast.error("Couldn't read that file", {
          description: "Export ▸ CSV from Search Console and pick the Queries.csv inside the zip.",
        });
        return;
      }
      const next: ConnectorState = {
        ...state,
        gsc: {
          property: property.trim() || state.gsc?.property || "my site",
          importedAt: new Date().toISOString(),
          rows,
        },
      };
      saveConnectors(next);
      onChange(next);
      toast.success(`Search Console connected — ${rows.length} queries imported`);
      setOpen(false);
    } catch {
      toast.error("Import failed");
    }
  };

  const disconnect = () => {
    const next: ConnectorState = { ...state, gsc: null };
    saveConnectors(next);
    onChange(next);
    toast.success("Search Console disconnected");
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Connectors"
        title="Connect your data"
        className={cn(
          "inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-all",
          connected
            ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        <span className="material-symbols-rounded text-[16px] leading-none" aria-hidden>
          {connected ? "cloud_done" : "hub"}
        </span>
        <span className="hidden sm:inline">{connected ? "Connected" : "Connectors"}</span>
      </button>

      {open &&
        pos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[99]" onClick={() => setOpen(false)} aria-hidden />
            <div
              role="dialog"
              aria-label="Connectors"
              style={{ left: pos.left, bottom: pos.bottom, width: pos.width }}
              className="glass fixed z-[100] overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-3 shadow-[var(--shadow-elegant)] backdrop-blur-xl"
            >
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                Connect your data
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/25 p-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-[18px] leading-none text-[color:var(--brand)]" aria-hidden>
                    query_stats
                  </span>
                  <span className="text-[13.5px] font-semibold text-foreground">Google Search Console</span>
                  {connected && (
                    <span className="ml-auto rounded-full bg-emerald-500/15 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Live
                    </span>
                  )}
                </div>

                {connected ? (
                  <>
                    <p className="mt-2 text-[12.5px] font-light leading-snug text-muted-foreground">
                      {state.gsc!.rows.length} queries from <strong className="font-medium text-foreground/85">{state.gsc!.property}</strong>.
                      PNX reads these on every reply and grounds its advice in your real clicks, impressions and positions.
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-border/70 px-3 text-[12.5px] font-medium text-foreground/85 hover:bg-accent"
                      >
                        Update data
                      </button>
                      <button
                        type="button"
                        onClick={disconnect}
                        className="inline-flex min-h-[34px] items-center rounded-full px-3 text-[12.5px] font-medium text-muted-foreground hover:text-destructive"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-[12.5px] font-light leading-snug text-muted-foreground">
                      Open Search Console ▸ Performance ▸ <strong className="font-medium text-foreground/85">Export ▸ CSV</strong>, then drop the
                      Queries file here. Your data stays in this browser — it is never uploaded to a PNX server.
                    </p>
                    <input
                      value={property}
                      onChange={(e) => setProperty(e.target.value)}
                      placeholder="yoursite.com"
                      className="mt-2.5 w-full rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-[13px] outline-none placeholder:text-muted-foreground/60 focus:border-[color:var(--brand)]/50"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="mt-2 inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-full bg-[color:var(--brand)] px-3 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <span className="material-symbols-rounded text-[16px] leading-none" aria-hidden>
                        upload_file
                      </span>
                      Import Search Console CSV
                    </button>
                  </>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) void handleFile(f);
                  }}
                />
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
