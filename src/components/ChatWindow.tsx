import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import { Globe, Sparkles, ListTree, FileText, ArrowUpRight } from "lucide-react";

type Props = {
  threadId: string;
  initialMessages: UIMessage[];
  onMessagesChange: (messages: UIMessage[]) => void;
};

const SUGGESTIONS: { icon: typeof Globe; label: string; prompt: string }[] = [
  {
    icon: Globe,
    label: "On-page audit",
    prompt: "Audit https://example.com for on-page SEO",
  },
  {
    icon: ListTree,
    label: "Keyword clusters",
    prompt: "Give me 10 keyword ideas for a project management tool, grouped by intent",
  },
  {
    icon: Sparkles,
    label: "SERP analysis",
    prompt: "Analyze top 3 results for 'best running shoes for flat feet' and tell me how to win",
  },
  {
    icon: FileText,
    label: "Title + meta",
    prompt: "Write 5 SEO title + meta description options for a yoga studio in Austin",
  },
];

export function ChatWindow({ threadId, initialMessages, onMessagesChange }: Props) {
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages whenever they change
  useEffect(() => {
    onMessagesChange(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, threadId]);

  // Focus textarea
  useEffect(() => {
    if (status !== "streaming") textareaRef.current?.focus();
  }, [status, threadId]);

  const handleSubmit = (msg: PromptInputMessage) => {
    const text = msg.text?.trim();
    if (!text) return;
    sendMessage({ text });
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
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full" style={{ background: "var(--gradient-brand)" }} />
                SEO Intelligence
              </div>
              <h1 className="font-serif text-5xl tracking-tight text-foreground sm:text-6xl">
                How can I help you <em className="italic text-[color:var(--brand)]">rank</em> today?
              </h1>
              <p className="mt-4 max-w-lg text-balance text-[15px] leading-relaxed text-muted-foreground">
                Audit pages, generate optimized content, cluster keywords, and reverse-engineer the SERPs that matter.
              </p>
              <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.prompt}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card/80 p-4 text-left shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand)]/40 hover:shadow-[var(--shadow-elegant)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-[color:var(--brand)]">
                          <Icon className="size-4" />
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                        {s.label}
                      </div>
                      <div className="text-[13px] leading-snug text-card-foreground">
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
            className="rounded-2xl border-border bg-card/90 shadow-[var(--shadow-elegant)] backdrop-blur"
          >
            <PromptInputBody>
              <PromptInputTextarea
                ref={textareaRef}
                placeholder="Ask anything about SEO — paste a URL, request keywords, or analyze a SERP..."
                disabled={isBusy}
                className="text-[14px]"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isBusy} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
            Atlas can make mistakes — verify critical SEO decisions.
          </p>
        </div>
      </div>
    </div>
  );
}