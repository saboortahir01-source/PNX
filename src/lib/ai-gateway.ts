import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const createLovableAiGatewayProvider = (lovableApiKey: string) =>
  createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });

// Direct Google Gemini via its OpenAI-compatible endpoint.
// Primary path — cheaper/faster than routing through the gateway.
export const createGeminiDirectProvider = (geminiApiKey: string) =>
  createOpenAICompatible({
    name: "gemini-direct",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: {
      Authorization: `Bearer ${geminiApiKey}`,
    },
  });

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