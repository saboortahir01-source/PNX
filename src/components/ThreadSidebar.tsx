import { Link, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Thread } from "@/lib/threads";
import { cn } from "@/lib/utils";
import pnxLogo from "@/assets/pnx-logo.png";

type Props = {
  threads: Thread[];
  activeId: string;
  onNew: () => void;
  onDelete: (id: string) => void;
};

// Google Material Symbols icon — assumes the Material Symbols Outlined
// stylesheet is loaded in the root route head.
function MSym({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none", className)}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function relativeDay(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.floor((startOfDay(today) - startOfDay(d)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type FolderMap = Record<string, string[]>; // folderName -> threadIds

const FOLDERS_KEY = "pnx-folders-v1";
function loadFolders(): FolderMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    return raw ? (JSON.parse(raw) as FolderMap) : {};
  } catch {
    return {};
  }
}
function saveFolders(f: FolderMap) {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(f));
  } catch {
    /* ignore */
  }
}

const SETTINGS_KEY = "pnx-settings-v1";
type Settings = { notifications: boolean; incognito: boolean };
function loadSettings(): Settings {
  if (typeof window === "undefined") return { notifications: true, incognito: false };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { notifications: true, incognito: false, ...JSON.parse(raw) } : { notifications: true, incognito: false };
  } catch {
    return { notifications: true, incognito: false };
  }
}
function saveSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function ThreadSidebar({ threads, activeId, onNew, onDelete }: Props) {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<FolderMap>({});
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState<Settings>({ notifications: true, incognito: false });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    setFolders(loadFolders());
    setSettings(loadSettings());
  }, []);

  const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  const recent7 = sorted.slice(0, 7);

  const toggleFolder = (name: string) =>
    setOpenFolders((o) => ({ ...o, [name]: !o[name] }));

  const addFolder = () => {
    const name = newFolderName.trim();
    if (!name || folders[name]) {
      setCreatingFolder(false);
      setNewFolderName("");
      return;
    }
    const next = { ...folders, [name]: [] };
    setFolders(next);
    saveFolders(next);
    setOpenFolders((o) => ({ ...o, [name]: true }));
    setCreatingFolder(false);
    setNewFolderName("");
  };

  const deleteFolder = (name: string) => {
    const next = { ...folders };
    delete next[name];
    setFolders(next);
    saveFolders(next);
  };

  const updateSetting = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    const next = { ...settings, [k]: v };
    setSettings(next);
    saveSettings(next);
  };

  return (
    <aside
      className="pnx-sidebar relative flex h-full w-[280px] flex-col overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "8px 0 24px -12px rgba(102,126,234,0.15), 1px 0 0 #e0e0e0",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#333333",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid #e0e0e0" }}>
        <Link to="/" className="flex items-center gap-2.5" aria-label="PNX home">
          <div
            className="flex size-9 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg,#667eea,#4285f4)", boxShadow: "0 4px 10px -2px rgba(102,126,234,0.4)" }}
          >
            <img src={pnxLogo} alt="PNX" className="size-6 object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight" style={{ color: "#333333" }}>PNX</span>
            <span className="text-[9px] font-medium uppercase tracking-[0.18em]" style={{ color: "#666666" }}>SEO Intelligence</span>
          </div>
        </Link>
      </div>

      {/* NEW AUDIT */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={onNew}
          className="pnx-cta group flex w-full items-center justify-center gap-2 rounded"
          style={{
            height: "44px",
            background: "linear-gradient(135deg,#667eea,#4285f4)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: 0,
            cursor: "pointer",
            transition: "all 300ms ease",
          }}
          aria-label="Start a new SEO audit (Ctrl+N)"
        >
          <MSym name="add_circle" style={{ fontSize: 22 }} />
          New Audit
        </button>
      </div>

      {/* Scroll region */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* LIBRARY */}
        <SectionHeader icon="library_books" label="Library" />
        <nav className="px-2">
          {sorted.length === 0 && (
            <p className="px-3 py-2 text-[13px]" style={{ color: "#999999" }}>No audits yet.</p>
          )}
          {sorted.map((t) => (
            <ItemRow
              key={t.id}
              icon="search"
              label={t.title}
              active={t.id === activeId}
              onClick={() =>
                navigate({ to: "/chat/$threadId", params: { threadId: t.id } })
              }
              onDelete={
                threads.length > 1
                  ? () => {
                      onDelete(t.id);
                      if (t.id === activeId) {
                        const next = threads.find((x) => x.id !== t.id);
                        if (next)
                          navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
                      }
                    }
                  : undefined
              }
            />
          ))}
        </nav>

        {/* RECENT AUDITS */}
        <SectionHeader icon="history" label="Recent Audits (Last 7)" />
        <nav className="px-2">
          {recent7.map((t) => (
            <button
              key={t.id}
              onClick={() =>
                navigate({ to: "/chat/$threadId", params: { threadId: t.id } })
              }
              className="pnx-row group flex w-full items-center gap-3 rounded px-3 text-left"
              style={{ minHeight: 44, transition: "all 300ms ease" }}
            >
              <MSym name="timeline" style={{ fontSize: 20, color: "#666666" }} />
              <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: "#666666" }}>
                <span style={{ fontWeight: 600, color: "#333333" }}>{relativeDay(t.updatedAt)}:</span>{" "}
                {t.title}
              </span>
            </button>
          ))}
          {recent7.length === 0 && (
            <p className="px-3 py-2 text-[13px]" style={{ color: "#999999" }}>No recent activity.</p>
          )}
        </nav>

        {/* MY REPORTS */}
        <SectionHeader
          icon="folder"
          label="My Reports (Folders)"
          action={
            <button
              onClick={() => setCreatingFolder(true)}
              className="pnx-add rounded p-1"
              style={{ transition: "all 300ms ease" }}
              aria-label="New folder"
            >
              <MSym name="create_new_folder" style={{ fontSize: 18, color: "#667eea" }} />
            </button>
          }
        />
        <div className="px-2">
          {creatingFolder && (
            <div className="mb-1 flex items-center gap-2 px-3 py-2">
              <MSym name="folder_open" style={{ fontSize: 20, color: "#667eea" }} />
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={addFolder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addFolder();
                  if (e.key === "Escape") {
                    setCreatingFolder(false);
                    setNewFolderName("");
                  }
                }}
                placeholder="Folder name…"
                className="min-w-0 flex-1 rounded border px-2 py-1 text-[13px] outline-none"
                style={{ borderColor: "#667eea", color: "#333333" }}
              />
            </div>
          )}
          {Object.keys(folders).length === 0 && !creatingFolder && (
            <p className="px-3 py-2 text-[13px]" style={{ color: "#999999" }}>
              No folders yet. Click{" "}
              <MSym name="create_new_folder" style={{ fontSize: 14, color: "#667eea", verticalAlign: "middle" }} />{" "}
              to create one.
            </p>
          )}
          {Object.entries(folders).map(([name, ids]) => {
            const open = !!openFolders[name];
            const children = ids
              .map((id) => threads.find((t) => t.id === id))
              .filter(Boolean) as Thread[];
            return (
              <div key={name} className="mb-0.5">
                <div
                  className="pnx-row group flex items-center gap-2 rounded px-3"
                  style={{ minHeight: 40, transition: "all 300ms ease", cursor: "pointer" }}
                  onClick={() => toggleFolder(name)}
                >
                  <MSym
                    name={open ? "expand_more" : "chevron_right"}
                    style={{ fontSize: 20, color: "#666666", transition: "transform 300ms ease" }}
                  />
                  <MSym name={open ? "folder_open" : "folder"} style={{ fontSize: 20, color: "#667eea" }} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium" style={{ color: "#333333" }}>
                    {name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(name);
                    }}
                    className="pnx-del rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Delete folder ${name}`}
                  >
                    <Trash2 className="size-3.5" style={{ color: "#999999" }} />
                  </button>
                </div>
                {open && (
                  <div className="ml-6 mt-0.5 border-l pl-2" style={{ borderColor: "#e0e0e0" }}>
                    {children.length === 0 && (
                      <p className="px-3 py-1 text-[12px]" style={{ color: "#999999" }}>Empty</p>
                    )}
                    {children.map((t) => (
                      <ItemRow
                        key={t.id}
                        icon="search"
                        label={t.title}
                        active={t.id === activeId}
                        onClick={() =>
                          navigate({ to: "/chat/$threadId", params: { threadId: t.id } })
                        }
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SETTINGS */}
        <SectionHeader
          icon="settings"
          label="Settings"
          action={
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className="pnx-add rounded p-1"
              style={{ transition: "all 300ms ease" }}
              aria-label="Toggle settings"
            >
              <MSym
                name="expand_more"
                style={{
                  fontSize: 18,
                  color: "#666666",
                  transform: settingsOpen ? "rotate(180deg)" : "none",
                  transition: "transform 300ms ease",
                }}
              />
            </button>
          }
        />
        {settingsOpen && (
          <div className="px-2">
            <SettingRow
              icon="notifications"
              label="Notifications"
              value={settings.notifications}
              onToggle={(v) => updateSetting("notifications", v)}
            />
            <SettingRow
              icon="security"
              label="Incognito Mode"
              value={settings.incognito}
              onToggle={(v) => updateSetting("incognito", v)}
            />
            <button
              className="pnx-row flex w-full items-center gap-3 rounded px-3 text-left"
              style={{ minHeight: 40, transition: "all 300ms ease" }}
              onClick={() => {
                if (typeof window !== "undefined")
                  window.alert("Keyboard shortcuts:\n\n⌘/Ctrl+N — New audit\n⌘/Ctrl+I — Toggle incognito\n⌘/Ctrl+/ — This help");
              }}
            >
              <MSym name="keyboard" style={{ fontSize: 20, color: "#666666" }} />
              <span className="text-[13px]" style={{ color: "#333333" }}>Keyboard Shortcuts</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: "#e0e0e0" }}>
        <span
          className="size-1.5 rounded-full"
          style={{ background: "linear-gradient(135deg,#667eea,#4285f4)", boxShadow: "0 0 8px rgba(102,126,234,0.6)" }}
        />
        <span className="text-[11px]" style={{ color: "#666666" }}>
          Private · saved locally
        </span>
      </div>

      <style>{`
        .pnx-sidebar .pnx-row {
          color: #333333;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        .pnx-sidebar .pnx-row:hover {
          background: rgba(102,126,234,0.06);
          box-shadow: 0 0 0 2px rgba(102,126,234,0.3);
        }
        .pnx-sidebar .pnx-row.is-active {
          background: linear-gradient(135deg, rgba(102,126,234,0.10), rgba(66,133,244,0.10));
          box-shadow: inset 3px 0 0 0 #667eea;
        }
        .pnx-sidebar .pnx-cta:hover {
          box-shadow: 0 0 0 2px rgba(102,126,234,0.35), 0 8px 20px -6px rgba(66,133,244,0.5);
          transform: translateY(-1px);
        }
        .pnx-sidebar .pnx-add:hover {
          background: rgba(102,126,234,0.1);
        }
      `}</style>
    </aside>
  );
}

function SectionHeader({ icon, label, action }: { icon: string; label: string; action?: React.ReactNode }) {
  return (
    <div
      className="mt-1 flex items-center justify-between px-4 py-3"
      style={{ borderTop: "1px solid #e0e0e0" }}
    >
      <div className="flex items-center gap-2">
        <MSym name={icon} style={{ fontSize: 18, color: "#667eea" }} />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "#333333" }}
        >
          {label}
        </span>
      </div>
      {action}
    </div>
  );
}

function ItemRow({
  icon,
  label,
  active,
  onClick,
  onDelete,
  small,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  small?: boolean;
}) {
  return (
    <div
      className={cn("pnx-row group relative mb-0.5 flex items-center gap-2 rounded px-3", active && "is-active")}
      style={{ minHeight: small ? 36 : 44, transition: "all 300ms ease" }}
    >
      <button
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-2.5 bg-transparent text-left"
        style={{ border: 0, cursor: "pointer" }}
      >
        <MSym name={icon} style={{ fontSize: small ? 16 : 18, color: active ? "#667eea" : "#666666" }} />
        <span
          className="truncate"
          style={{
            fontSize: small ? 12.5 : 13,
            color: "#333333",
            fontWeight: active ? 600 : 400,
          }}
        >
          {label}
        </span>
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Delete"
        >
          <Trash2 className="size-3.5" style={{ color: "#999999" }} />
        </button>
      )}
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: string;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onToggle(!value)}
      className="pnx-row flex w-full items-center gap-3 rounded px-3 text-left"
      style={{ minHeight: 40, transition: "all 300ms ease" }}
    >
      <MSym name={icon} style={{ fontSize: 20, color: value ? "#667eea" : "#666666" }} />
      <span className="flex-1 text-[13px]" style={{ color: "#333333" }}>{label}</span>
      <span
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
        style={{
          background: value ? "linear-gradient(135deg,#667eea,#4285f4)" : "#e0e0e0",
        }}
      >
        <span
          className="inline-block size-4 rounded-full bg-white transition-transform"
          style={{ transform: value ? "translateX(18px)" : "translateX(2px)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        />
      </span>
    </button>
  );
}