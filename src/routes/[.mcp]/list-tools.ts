import { createFileRoute } from "@tanstack/react-router";
import { createTanStackListToolsHandler } from "@lovable.dev/mcp-js/stacks/tanstack";
import mcp from "../../lib/mcp/index";

export const Route = createFileRoute("/.mcp/list-tools")({
  server: {
    handlers: {
      ANY: createTanStackListToolsHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true }),
    },
  },
});