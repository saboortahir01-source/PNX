import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT || 8080);
const HOST = '0.0.0.0';

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'text/javascript; charset=utf-8';
    case '.mjs': return 'text/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    case '.pdf': return 'application/pdf';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    default: return 'application/octet-stream';
  }
}

async function fileExists(filePath) {
  try {
    const stat = await fs.promises.stat(filePath);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}

async function streamFile(res, filePath) {
  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    res.writeHead(500);
    res.end('Internal Server Error');
  });
  stream.pipe(res);
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function tryServeStatic(urlPath, res) {
  // Serve files from dist/client (Vite build output)
  const clientDir = path.join(process.cwd(), 'dist', 'client');
  // Normalize and prevent path traversal
  let relPath = decodeURIComponent(urlPath);
  if (relPath.startsWith('/')) relPath = relPath.slice(1);
  if (!relPath || relPath.endsWith('/')) relPath = path.posix.join(relPath, 'index.html');
  const filePath = path.join(clientDir, relPath);

  if (await fileExists(filePath)) {
    const contentType = getContentType(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    await streamFile(res, filePath);
    return true;
  }

  // Also try serving dist/<path> (some setups output client at dist/)
  const altClient = path.join(process.cwd(), 'dist', relPath);
  if (await fileExists(altClient)) {
    const contentType = getContentType(altClient);
    res.writeHead(200, { 'Content-Type': contentType });
    await streamFile(res, altClient);
    return true;
  }

  return false;
}

async function loadServerEntry() {
  // Try common Vite SSR server entry locations
  const candidates = [
    path.join(process.cwd(), 'dist', 'server', 'entry.mjs'),
    path.join(process.cwd(), 'dist', 'server', 'index.mjs'),
    path.join(process.cwd(), 'dist', 'server', 'entry.js'),
    path.join(process.cwd(), 'dist', 'server', 'index.js'),
    path.join(process.cwd(), 'dist', 'entry.mjs'),
    path.join(process.cwd(), 'dist', 'entry.js'),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return import(candidate).then((m) => m.default ?? m);
    }
  }

  throw new Error('Could not find server entry in dist. Make sure you ran the production build (vite build).');
}

(async () => {
  let serverEntry;
  try {
    serverEntry = await loadServerEntry();
  } catch (err) {
    console.error('Failed to load server entry:', err);
    process.exit(1);
  }

  const httpServer = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

      // Try static file first
      const staticServed = await tryServeStatic(url.pathname, res);
      if (staticServed) return;

      // Build a Web API Request from Node request
      const rawBody = await readRequestBody(req);
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          headers.set(key, value.join(','));
        } else if (value !== undefined) {
          headers.set(key, value);
        }
      }

      const requestInit = {
        method: req.method,
        headers,
        body: rawBody.length ? rawBody : undefined,
      };

      const fetchRequest = new Request(url.toString(), requestInit);

      // Call the server entry's fetch handler
      const result = await serverEntry.fetch(fetchRequest, {}, {});

      // Pipe response
      res.writeHead(result.status, Object.fromEntries(result.headers));
      const body = await result.arrayBuffer();
      res.end(Buffer.from(body));
    } catch (err) {
      console.error('Server error handling request:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    }
  });

  httpServer.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
  });
})();
