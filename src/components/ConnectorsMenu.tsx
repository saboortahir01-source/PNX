import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  BarChart3, 
  Sparkles, 
  Check, 
  X, 
  Upload, 
  Trash2, 
  LineChart, 
  FileText, 
  HardDrive,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { loadConnectors, saveConnectors } from "@/lib/connectors";
import { toast } from "sonner";

const Youtube = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

interface ConnectorsMenuProps {
  buttonText?: string;
  className?: string;
}

export const ConnectorsMenu: React.FC<ConnectorsMenuProps> = ({
  buttonText = "Connectors",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectors, setConnectors] = useState(() => loadConnectors());
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portalPos, setPortalPos] = useState({ bottom: 0, left: 0, width: 380 });

  useEffect(() => {
    setConnectors(loadConnectors());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.min(Math.max(window.innerWidth - 32, 320), 420);
      let left = rect.left;
      
      if (left + width > window.innerWidth - 16) {
        left = window.innerWidth - width - 16;
      }
      if (left < 16) {
        left = 16;
      }

      setPortalPos({
        bottom: window.innerHeight - rect.top + 8,
        left,
        width,
      });
    }
  }, [isOpen]);

  const isGscConnected = Boolean(connectors.gsc?.siteUrl || connectors.gsc?.rowCount);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const rowCount = lines.length - 1;
      const fileName = file.name;

      const updated = {
        ...connectors,
        gsc: {
          connected: true,
          siteUrl: fileName.replace(/\.[^/.]+$/, ""),
          connectedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rowCount: rowCount > 0 ? rowCount : 100,
        },
      };

      saveConnectors(updated);
      setConnectors(updated);
      toast.success("Google Search Console data connected successfully!");
    };

    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleDisconnectGsc = () => {
    const updated = {
      ...connectors,
      gsc: { connected: false },
    };
    saveConnectors(updated);
    setConnectors(updated);
    toast.info("Google Search Console disconnected");
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
          isGscConnected
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            : "border-border/60 bg-muted/40 hover:bg-muted/80 text-foreground"
        } ${className}`}
      >
        <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
        <span>{buttonText}</span>
        {isGscConnected ? (
          <span className="flex h-2 w-2 relative ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-400 font-semibold border border-indigo-500/20">
            1
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end sm:items-auto pointer-events-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
              style={{
                bottom: `${portalPos.bottom}px`,
                left: `${portalPos.left}px`,
                width: `${portalPos.width}px`,
              }}
              className="fixed z-50 rounded-2xl border border-border/80 bg-background/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      Connect Your Data
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <ShieldCheck className="w-3 h-3" /> Secure
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Connect trusted data sources to unlock smarter SEO insights, reporting, and automated agent workflows.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Connector 1: Google Search Console */}
              <div className="mb-4">
                <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                  isGscConnected
                    ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-background to-background"
                    : "border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-background to-background shadow-xs"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Google Search Console Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border shadow-xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                            stroke="#4285F4"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7 16L11 11L14 14L18 8"
                            stroke="#EA4335"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 8H15"
                            stroke="#FBBC05"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M18 8V11"
                            stroke="#34A853"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            Google Search Console
                          </h4>
                          {isGscConnected ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <Check className="w-3 h-3" /> Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                              Available Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {isGscConnected
                            ? `Active source: ${connectors.gsc?.siteUrl || "Search Performance CSV"}`
                            : "Import Search Console CSV export for real ranking queries & CTR wins."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Connected State */}
                  <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                    {isGscConnected ? (
                      <>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {connectors.gsc?.rowCount ? `${connectors.gsc.rowCount.toLocaleString()} queries indexed` : "Ready for audit"}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                          >
                            <Upload className="w-3 h-3 text-muted-foreground" />
                            <span>Update CSV</span>
                          </button>
                          <button
                            onClick={handleDisconnectGsc}
                            className="inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Disconnect Google Search Console"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-muted-foreground">
                          Google Search Console ▸ Performance ▸ Export ▸ CSV
                        </span>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all duration-200"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Connect CSV</span>
                        </button>
                      </>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Upcoming Integrations Grid */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Roadmap & Upcoming Integrations
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 font-mono">
                    Phase 2
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* YouTube */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                        <Youtube className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                        Coming Soon
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground">YouTube</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Video SEO & tags</div>
                  </div>

                  {/* Google Analytics 4 */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <LineChart className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                        Coming Soon
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground">Google Analytics 4</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Traffic & conversions</div>
                  </div>

                  {/* Blogger */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                        Coming Soon
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground">Blogger</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Auto-publish drafts</div>
                  </div>

                  {/* Google Drive */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <HardDrive className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                        Coming Soon
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground">Google Drive</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Export & report sync</div>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Processed locally in-memory
                </span>
                <a
                  href="/google-oauth-verification"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-0.5 text-xs font-medium text-indigo-400"
                >
                  Privacy & OAuth <ArrowRight className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};