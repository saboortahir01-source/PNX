/**
 * PNX v2.0 — Shared Agent State events.
 *
 * These are the only agent-state facts that ever cross the wire to the
 * browser: phase changes, human-readable execution logs, the plan, the
 * research assets and the final confidence score. Nothing about where the
 * knowledge cache lives, how it is keyed, or what it contains internally is
 * ever emitted — the cache is an invisible speed layer.
 */

export type PnxPhase = "planning" | "researching" | "analyzing" | "composing" | "done";

export type PnxLogLevel = "ok" | "warn" | "info" | "error";

export type PnxResearchAsset = {
  url: string;
  domain: string;
  title: string;
  credibility: number;
  trusted: boolean;
};

export type PnxEvent =
  | { kind: "phase"; phase: PnxPhase }
  | { kind: "log"; level: PnxLogLevel; text: string }
  | {
      kind: "plan";
      intent: string;
      taskType: string;
      steps: string[];
      awaitingApproval: boolean;
    }
  | { kind: "research"; assets: PnxResearchAsset[] }
  | { kind: "note"; text: string }
  | { kind: "confidence"; score: number; basis: string };

export const PNX_EVENT_PART = "data-pnx" as const;

/** Narrow an arbitrary UI message part to a PNX agent event. */
export function isPnxEventPart(part: { type?: string }): part is { type: string; data: PnxEvent } {
  return part.type === PNX_EVENT_PART;
}

export const PHASE_LABEL: Record<PnxPhase, string> = {
  planning: "Planning",
  researching: "Researching",
  analyzing: "Analyzing",
  composing: "Composing",
  done: "Complete",
};