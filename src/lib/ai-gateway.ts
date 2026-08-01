import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const createLovableAiGatewayProvider = (lovableApiKey: string) =>
  createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });

// Direct Google Gemini via the NATIVE Google provider.
// The OpenAI-compatible endpoint drops Gemini 3's `thought_signature`
// on tool-call round-trips, which makes every multi-step (tool-using)
// request fail with a 400 after the first tool result. The native
// provider round-trips signatures correctly.
export const createGeminiDirectProvider = (geminiApiKey: string) =>
  createGoogleGenerativeAI({ apiKey: geminiApiKey });

// z.ai (Zhipu / GLM) — OpenAI-compatible endpoint. Used as PNX Sonar's
// Strategic-mode brain (PER 2.0): humanization, social listening synthesis,
// and content-opportunity strategy. Free-tier GLM-4.5-Flash keeps calls cheap.
export const createZaiProvider = (zaiApiKey: string) =>
  createOpenAICompatible({
    name: "zai",
    baseURL: "https://api.z.ai/api/paas/v4",
    headers: {
      Authorization: `Bearer ${zaiApiKey}`,
    },
  });