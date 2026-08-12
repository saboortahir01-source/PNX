import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Azure OpenAI provider factory. Endpoint and key must be provided
// from server-side environment variables only.
export const createAzureOpenAIProvider = (endpoint: string, apiKey: string) => {
  // Normalize endpoint: remove trailing slashes, then append the OpenAI-compatible path.
  const normalized = endpoint.replace(/\/+$/g, "");
  const baseURL = `${normalized}/openai/v1`;

  return createOpenAICompatible({
    name: "azure-openai",
    baseURL,
    headers: {
      // Azure OpenAI uses the "api-key" header for authentication
      "api-key": apiKey,
    },
  });
};
