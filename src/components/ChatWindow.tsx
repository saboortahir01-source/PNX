import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef } from "react";
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
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ArrowUpRight, Gauge, Search, PenLine, Paperclip, X, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import pnxLogo from "@/assets/pnx-logo.png";

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

const SUGGESTIONS: { icon: typeof Gauge; label: string; prompt: string; tint: string }[] = [
  {
    icon: Gauge,
    label: "SEO Audit",
    prompt: "Run a full on-page SEO audit on https://example.com",
    tint: "from-indigo-500/15 to-blue-500/10 text-indigo-600 dark:text-indigo-300",
  },
  {
    icon: YoutubeIcon,
    label: "Optimised YouTube Channel",
    prompt: "Optimise my YouTube channel for SEO — give me title, description, tags and thumbnail strategy",
    tint: "from-red-500/15 to-rose-500/10 text-red-600 dark:text-red-400",
  },
  {
    icon: Search,
    label: "Keywords Research",
    prompt: "Give me 20 high-intent keywords for a project management SaaS, clustered by search intent",
    tint: "from-violet-500/15 to-purple-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    icon: PenLine,
    label: "Content Strategy",
    prompt: "Build a 3-month SEO content strategy for a yoga studio in Austin — topics, formats and cadence",
    tint: "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
  },
];

export function ChatWindow({ threadId, initialMessages, onMessagesChange }: Props) {
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onMessagesChange(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, threadId]);

  useEffect(() => {
    if (status !== "streaming") textareaRef.current?.focus();
  }, [status, threadId]);

  const handleSubmit = (msg: PromptInputMessage) => {
    const text = msg.text?.trim();
    const files = msg.files ?? [];
    if (!text && files.length === 0) return;
    sendMessage({ text: text ?? "", files });
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ backgroundImage: "var(--gradient-surface)" }}
    >
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-elegant)] ring-1 ring-border">
                <img src={pnxLogo} alt="PNX" className="size-12 object-contain drop-shadow" />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                How can{" "}
                <span className="bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2,oklch(0.7_0.16_305))] bg-clip-text text-transparent">
                  PNX
                </span>{" "}
                help you rank?
              </h1>
              <p className="mt-4 max-w-lg text-balance text-[15px] leading-relaxed text-muted-foreground">
                Your autonomous SEO co-pilot — audit pages, optimise channels, research keywords and craft winning content strategies.
              </p>
              <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.prompt}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card/80 p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand)]/40 hover:shadow-[var(--shadow-elegant)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-border/60", s.tint)}>
                          <Icon className="size-5" strokeWidth={2.2} />
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <div className="text-[13.5px] font-semibold tracking-tight text-foreground">
                        {s.label}
                      </div>
                      <div className="text-[12.5px] leading-snug text-muted-foreground">
                        {s.prompt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
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
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking...</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-4 pb-5 pt-3">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border/70 bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur transition-all focus-within:border-[color:var(--brand)]/40 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_12%,transparent)]"
            multiple
            maxFiles={5}
          >
            <PromptInputBody>
              <AttachmentChips />
              <PromptInputTextarea
                ref={textareaRef}
                placeholder="Ask SEO Questions"
                disabled={isBusy}
                className="min-h-14 text-[14px]"
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

