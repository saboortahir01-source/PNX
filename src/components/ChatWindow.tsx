import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  usePromptInputAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { ChatProgress } from "@/components/ChatProgress";
import { createPortal } from "react-dom";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ArrowUpRight, Gauge, Search, PenLine, Paperclip, X, Copy, RefreshCw, Share2, ThumbsUp, ThumbsDown, Download, Radar, Wrench, Sparkles, ChevronDown, AlertTriangle, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import pnxLogo from "@/assets/pnx-logo.png";
import { ConversationTimeline } from "@/components/ConversationTimeline";

const YoutubeIcon = (props: LucideProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={(props.size as number) ?? 20}
    height={(props.size as number) ?? 20}
    className={props.className as string}
    aria-hidden="true"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

type Props = {
  threadId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (messages: UIMessage[]) => void;
};

const SUGGESTIONS: { icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>; label: string; prompt: string; tint: string }[] = [
  {
    icon: Gauge,
    label: "SEO Audit Tool",
    prompt: "Run a full on-page SEO audit on https://example.com",
    tint: "from-indigo-500/15 to-blue-500/10 text-indigo-600 dark:text-indigo-300",
  },
  {
    icon: YoutubeIcon,
    label: "YouTube SEO Optimisation",
    prompt: "Optimise my YouTube channel for SEO — give me title, description, tags and thumbnail strategy",
    tint: "from-red-500/15 to-rose-500/10 text-red-600 dark:text-red-400",
  },
  {
    icon: Search,
    label: "Keyword Research Tool",
    prompt: "Give me 20 high-intent keywords for a project management SaaS, clustered by search intent",
    tint: "from-violet-500/15 to-purple-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    icon: PenLine,
    label: "AI Content Strategy",
    prompt: "Build a 3-month SEO content strategy for a yoga studio in Austin — topics, formats and cadence",
    tint: "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
  },
];

export function ChatWindow({ threadId, initialMessages, onMessagesChange }: Props) {
  type SonarMode = "auto" | "technical" | "strategic";
  const [mode, setMode] = useState<SonarMode>("auto");
  const modeRef = useRef<SonarMode>(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const [errorInfo, setErrorInfo] = useState<{ title: string; hint: string } | null>(null);
  const { messages, sendMessage, status, regenerate } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // Attach current PNX Sonar mode to every request body.
      body: () => ({ mode: modeRef.current }),
    }),
    onError: (err) => {
      const raw = (err instanceof Error && err.message ? err.message : "").toLowerCase();
      let info = {
        title: "PNX hit a snag",
        hint: "The agent couldn't finish that reply. Give it another go — most one-off blips clear on retry.",
      };
      if (raw.includes("rate") || raw.includes("429")) {
        info = { title: "You're going a bit fast for the free tier", hint: "The upstream model is rate-limiting us. Wait ~30 seconds and retry — no data was lost." };
      } else if (raw.includes("bad request") || raw.includes("400")) {
        info = { title: "That request confused the model", hint: "Usually a stray character or empty tool result. Rephrase your prompt or try again — the fix is almost always a retry." };
      } else if (raw.includes("unauthor") || raw.includes("401") || raw.includes("403") || raw.includes("key")) {
        info = { title: "The AI provider key needs attention", hint: "PNX couldn't authenticate with its model provider. If you're the owner, check GEMINI_API_KEY / ZAI_API_KEY / LOVABLE_API_KEY in Cloud secrets." };
      } else if (raw.includes("network") || raw.includes("fetch") || raw.includes("timeout")) {
        info = { title: "Network hiccup between you and PNX", hint: "Check your connection and hit retry — your message is still here." };
      }
      setErrorInfo(info);
      toast.error(info.title, { description: info.hint });
    },
  });

  // Clear the inline error banner as soon as a new turn starts.
  useEffect(() => {
    if (status === "submitted" || status === "streaming") setErrorInfo(null);
  }, [status]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onMessagesChange(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, threadId]);

  // Auto-focus the composer only on non-touch devices. On phones, re-focusing
  // after every reply pops the keyboard back up and steals the screen.
  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) textareaRef.current?.focus();
  }, [status, threadId]);

  const handleSubmit = (msg: PromptInputMessage) => {
    const text = msg.text?.trim();
    const files = msg.files ?? [];
    if (!text && files.length === 0) return;
    sendMessage({ text: text ?? "", files });
    // Dismiss the mobile keyboard so the reply is visible immediately.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      textareaRef.current?.blur();
    }
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isBusy = status === "submitted" || status === "streaming";

  const getMessageText = (m: UIMessage) =>
    m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  const handleCopy = async (m: UIMessage) => {
    try {
      await navigator.clipboard.writeText(getMessageText(m));
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleShare = async (m: UIMessage) => {
    const text = getMessageText(m);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "PNX SEO insight", text, url: window.location.href });
        return;
      } catch {
        /* fallthrough to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n\n— via PNX ${window.location.href}`);
      toast.success("Link & message copied — share anywhere");
    } catch {
      toast.error("Share failed");
    }
  };

  const handleFeedback = (kind: "up" | "down") => {
    toast.success(kind === "up" ? "Thanks for the feedback!" : "Got it — we'll improve.");
  };

  const handleDownloadPdf = async (m: UIMessage) => {
    const content = getMessageText(m);
    if (!content.trim()) {
      toast.error("Nothing to export");
      return;
    }
    const firstUser = messages.find((x) => x.role === "user");
    const titleSource = firstUser ? getMessageText(firstUser) : "PNX SEO Report";
    const title = titleSource.slice(0, 120).replace(/\s+/g, " ").trim() || "PNX SEO Report";
    const t = toast.loading("Generating PDF…");
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.slice(0, 50)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded", { id: t });
    } catch {
      toast.error("PDF export failed", { id: t });
    }
  };

  return (
    <div
      className="chat-shell flex min-h-0 flex-col relative"
      style={{ backgroundImage: "var(--gradient-surface)" }}
    >
      <ConversationTimeline messages={messages} />
      <Conversation className="flex-1">
        <ConversationContent className="prose-img-rounded mx-auto w-full max-w-3xl px-3 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-2 py-10 text-center sm:py-16">
              <div className="glass mb-6 flex size-16 items-center justify-center rounded-2xl shadow-[var(--shadow-elegant)]">
                <img src={pnxLogo} alt="PNX AI SEO platform" className="size-12 object-contain drop-shadow" loading="eager" />
              </div>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-[2.6rem] sm:leading-[1.15]">
                PNX —{" "}
                <span className="bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2,oklch(0.7_0.16_305))] bg-clip-text text-transparent">
                  Agentic SEO Co-Pilot
                </span>
                . AI Audits, Keyword Research &amp; SERP Analysis.
              </h1>
              <p className="mt-3 max-w-xl text-balance text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                Autonomous on-page SEO audits, AI keyword clustering, competitor SERP analysis,
                and content strategy — all in one free SEO AI agent.
              </p>
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 sm:mt-10">
                Start with an AI SEO Tool
              </h2>
              <div className="mt-3 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.prompt}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="glass group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-4 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand)]/40 hover:shadow-[var(--shadow-elegant)] active:translate-y-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-border/60", s.tint)}>
                          <Icon className="size-5" strokeWidth={2.2} />
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <h3 className="text-[13.5px] font-semibold tracking-tight text-foreground">
                        {s.label}
                      </h3>
                      <p className="text-[12.5px] leading-snug text-muted-foreground">
                        {s.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <Message key={m.id} from={m.role} id={`msg-${m.id}`}>
                <MessageContent>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : (
                        <div key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </div>
                      );
                    }
                    if (part.type?.startsWith("tool-")) {
                      const toolPart = part as unknown as {
                        type: string;
                        state: "input-streaming" | "input-available" | "output-available" | "output-error" | "approval-requested" | "approval-responded" | "output-denied";
                        input?: unknown;
                        output?: unknown;
                        errorText?: string;
                      };
                      return (
                        <Tool key={i} defaultOpen={false}>
                          <ToolHeader
                            type={toolPart.type as `tool-${string}`}
                            state={toolPart.state}
                          />
                          <ToolContent>
                            <ToolInput input={toolPart.input} />
                            <ToolOutput
                              output={
                                toolPart.output ? (
                                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs">
                                    {typeof toolPart.output === "string"
                                      ? toolPart.output
                                      : JSON.stringify(toolPart.output, null, 2)}
                                  </pre>
                                ) : undefined
                              }
                              errorText={toolPart.errorText}
                            />
                          </ToolContent>
                        </Tool>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
                {m.role === "assistant" && !isBusy && (
                  <div className="mt-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      onClick={() => handleCopy(m)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Copy"
                      title="Copy"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    {idx === messages.length - 1 && (
                      <button
                        onClick={() => regenerate()}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                        aria-label="Regenerate"
                        title="Regenerate"
                      >
                        <RefreshCw className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(m)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Share"
                      title="Share"
                    >
                      <Share2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(m)}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Download as PDF"
                      title="Download as PDF"
                    >
                      <Download className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback("up")}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Helpful"
                      title="Helpful"
                    >
                      <ThumbsUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback("down")}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Not helpful"
                      title="Not helpful"
                    >
                      <ThumbsDown className="size-3.5" />
                    </button>
                  </div>
                )}
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <ChatProgress
                  status="submitted"
                  variant={isResearchTurn(messages) ? "detailed" : "simple"}
                />
              </MessageContent>
            </Message>
          )}
          {status === "error" && errorInfo && (
            <div
              role="alert"
              className="glass mx-auto my-3 flex w-full max-w-2xl items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{errorInfo.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{errorInfo.hint}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => { setErrorInfo(null); regenerate(); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background transition hover:opacity-90"
                  >
                    <RefreshCw className="size-3" /> Try again
                  </button>
                  <button
                    onClick={() => setErrorInfo(null)}
                    className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 sm:px-4 sm:pb-5 sm:pt-3">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={handleSubmit}
            className="glass rounded-3xl shadow-[var(--shadow-elegant)] transition-all focus-within:border-border focus-within:shadow-[var(--shadow-elegant)]"
            multiple
            maxFiles={5}
          >
            <PromptInputBody>
              <AttachmentChips />
              <PromptInputTextarea
                ref={textareaRef}
                placeholder="Ask SEO Questions"
                disabled={isBusy}
                className="min-h-14 text-[15px] sm:text-[16px]"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-between">
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger aria-label="Attach">
                    <Paperclip className="size-4" />
                  </PromptInputActionMenuTrigger>
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments label="Attach files or images" />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <SonarModePicker mode={mode} onChange={setMode} />
              </PromptInputTools>
              <PromptInputSubmit status={status} disabled={isBusy} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
            PNX can make mistakes — verify critical SEO decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function AttachmentChips() {
  const a = usePromptInputAttachments();
  if (a.files.length === 0) return null;
  const a = usePromptInputAttachments();
  if (a.files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-3">
      {a.files.map((f) => (
        <div
          key={f.id}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] text-secondary-foreground"
        >
          <Paperclip className="size-3 opacity-60" />
          <span className="max-w-[160px] truncate">{f.filename ?? "file"}</span>
          <button
            type="button"
            onClick={() => a.remove(f.id)}
            className="rounded-full p-0.5 opacity-60 hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
            aria-label="Remove attachment"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// PNX Sonar mode picker — sits inline in the composer footer next to the
// attach button. Kept minimal (ChatGPT-style dropdown) so users pick a lane
// without reading a wall of copy.
const SONAR_MODES: {
  id: "auto" | "technical" | "strategic";
  label: string;
  short: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "auto", label: "Auto", short: "Auto", desc: "PNX picks the right agent for your task", Icon: Sparkles },
  { id: "technical", label: "Sonar 01", short: "Sonar 01", desc: "Technical & on-page audits — schema, headings, Core Web Vitals", Icon: Wrench },
  { id: "strategic", label: "Sonar 02", short: "Sonar 02", desc: "Strategic content plays — SERP intel, humanized long-form", Icon: Radar },
];

function SonarModePicker({
  mode,
  onChange,
}: {
  mode: "auto" | "technical" | "strategic";
  onChange: (m: "auto" | "technical" | "strategic") => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ left: number; bottom: number; width: number } | null>(null);
  const current = SONAR_MODES.find((m) => m.id === mode) ?? SONAR_MODES[0];
  const Icon = current.Icon;

  // The composer is a rounded, clipped glass surface, so an absolutely
  // positioned menu gets cut off. Render it in a portal with fixed
  // coordinates instead so it always floats clear of the input.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const width = Math.min(288, window.innerWidth - 24);
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

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
          mode === "auto"
            ? "border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground"
            : "border-[color:var(--brand)]/50 bg-gradient-to-r from-[color:var(--brand)]/15 to-[color:var(--brand,#667eea)]/5 text-[color:var(--brand)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--brand,#667eea)_30%,transparent)]",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Pick PNX Sonar mode"
      >
        <Icon className="size-3.5" />
        <span>{current.short}</span>
        <ChevronDown className={cn("size-3 opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && createPortal(
        <div
          role="menu"
          style={{ left: pos.left, bottom: pos.bottom, width: pos.width }}
          className="glass fixed z-[100] overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-1 shadow-[var(--shadow-elegant)] backdrop-blur-xl"
        >
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            PNX Sonar agents
          </div>
          {SONAR_MODES.map((m) => {
            const MIcon = m.Icon;
            const active = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(m.id); setOpen(false); }}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-accent",
                  active && "bg-gradient-to-r from-[color:var(--brand)]/15 to-transparent",
                )}
              >
                <span className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-[color:var(--brand)]/20 text-[color:var(--brand)]" : "bg-muted text-muted-foreground",
                )}>
                  <MIcon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-foreground">{m.label}</span>
                    {active && <span className="rounded-full bg-[color:var(--brand)]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[color:var(--brand)]">Active</span>}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">{m.desc}</span>
                </span>
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

