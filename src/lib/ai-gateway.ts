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