import "./lib/azure-monitor.server";
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// Static asset serving fallback. Prefer Nitro's native static handling, but if
// Nitro did not register some assets (common when files are copied after the
// server build), this layer will serve files directly from candidate
// directories. It is small, secure, and only applies to GET/HEAD requests for
// public/static assets. All other requests are forwarded to the SSR handler.
const STATIC_DIRS = [
  path.resolve(process.cwd(), ".output/public"),
  path.resolve(process.cwd(), "dist/client"),
  path.resolve(process.cwd(), "dist"),
  path.resolve(process.cwd(), "public"),
  path.resolve(process.cwd(), "src/assets"),
];

function getMimeType(ext: string) {
  switch (ext) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".mjs":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".webmanifest":
      return "application/manifest+json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function isLikelyImmutableAsset(pathname: string) {
  // Very common Vite pattern: /assets/name.<hash>.<ext>
  // If the URL is under /assets, treat it as immutable by default.
  if (pathname.startsWith("/assets/")) return true;
  // Also consider long hex hashes anywhere in the filename
  return /[.-][a-f0-9]{8,}\.[^/.]+$/i.test(pathname);
}

async function tryServeStatic(request: Request): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return null;
  }

  const rawPath = decodeURIComponent(url.pathname);
  // Disallow path traversal attempts
  if (rawPath.includes("..")) return null;

  // Candidate order: prefer the server's .output/public, then dist outputs,
  // then repo public and src/assets for development fallbacks.
  for (const base of STATIC_DIRS) {
    try {
      const candidate = path.join(base, rawPath.replace(/^\//, ""));
      const resolved = path.resolve(candidate);
      if (!resolved.startsWith(base)) continue; // out-of-bounds

      // Check existence
      if (!fsSync.existsSync(resolved)) continue;
      const stat = fsSync.statSync(resolved);
      if (!stat.isFile()) continue;

      // Prepare headers
      const ext = path.extname(resolved).toLowerCase();
      const mime = getMimeType(ext);
      const headers: Record<string, string> = { "content-type": mime };

      if (isLikelyImmutableAsset(rawPath)) {
        headers["cache-control"] = "public, max-age=31536000, immutable";
      } else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
        headers["cache-control"] = "public, max-age=3600";
      } else if (ext === ".webmanifest" || ext === ".json" || ext === ".ico") {
        headers["cache-control"] = "public, max-age=3600";
      } else {
        headers["cache-control"] = "public, max-age=3600";
      }

      if (request.method === "HEAD") {
        return new Response(null, { status: 200, headers });
      }

      const data = await fs.readFile(resolved);
      return new Response(data, { status: 200, headers });
    } catch (err) {
      // swallow and try next candidate directory
      continue;
    }
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // 1) Quick static attempt: serve directly from common public/client dirs
      const staticResponse = await tryServeStatic(request);
      if (staticResponse) return staticResponse;

      // 2) Fallback to the normal SSR handler
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
