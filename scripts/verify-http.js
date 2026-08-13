#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import process from 'process';
import { setTimeout as wait } from 'timers/promises';

const SERVER_ENTRY = '.output/server/index.mjs';
const HOST = '127.0.0.1';
const PORT = process.env.PORT || '8080';
const BASE = `http://${HOST}:${PORT}`;

function log(...args) {
  console.log('[verify-http]', ...args);
}

function fail(msg) {
  console.error('[verify-http] FAILED:', msg);
  process.exitCode = 1;
}

async function main() {
  if (!fs.existsSync(SERVER_ENTRY)) {
    fail(`Missing server entry at ${SERVER_ENTRY}`);
    process.exit(2);
  }

  log('Starting production server for verification...');

  const child = spawn(process.execPath, ['--enable-source-maps', SERVER_ENTRY], {
    env: { ...process.env, PORT, NODE_ENV: 'production', NITRO_HOST: '0.0.0.0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (d) => process.stdout.write(`[server stdout] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[server stderr] ${d}`));

  let exited = false;
  child.on('exit', (code, sig) => {
    exited = true;
    log(`Server process exited with code=${code} sig=${sig}`);
  });

  try {
    // Wait for server to be reachable
    const timeoutMs = 30000;
    const start = Date.now();
    let lastErr = null;
    while (Date.now() - start < timeoutMs) {
      try {
        const resp = await fetch(BASE + '/');
        if (resp.ok) {
          log('Server reachable, GET / returned', resp.status);
          break;
        } else {
          lastErr = `GET / returned ${resp.status}`;
        }
      } catch (err) {
        lastErr = err;
      }
      if (exited) throw new Error('Server process exited unexpectedly');
      await wait(500);
    }

    if (Date.now() - start >= timeoutMs) {
      throw new Error(`Server did not become reachable within ${timeoutMs}ms: ${String(lastErr)}`);
    }

    // Fetch root HTML
    const rootResp = await fetch(BASE + '/');
    const html = await rootResp.text();
    if (!rootResp.ok) {
      throw new Error(`GET / failed: ${rootResp.status}`);
    }

    const contentType = rootResp.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      throw new Error(`GET / returned unexpected content-type: ${contentType}`);
    }

    log('Parsing HTML and extracting asset URLs...');

    const assetUrls = new Set();

    // Extract <link rel="stylesheet" href="...">
    const linkRe = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      assetUrls.add(m[1]);
    }

    // Extract <script src= or <script type="module" src=>
    const scriptRe = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((m = scriptRe.exec(html)) !== null) {
      assetUrls.add(m[1]);
    }

    // Extract images
    const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((m = imgRe.exec(html)) !== null) {
      assetUrls.add(m[1]);
    }

    // Also try <link rel="icon" href=...>
    const iconRe = /<link[^>]+rel=["']icon["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    while ((m = iconRe.exec(html)) !== null) {
      assetUrls.add(m[1]);
    }

    // Normalize URLs and prioritize at least one CSS and one JS
    const abs = (u) => {
      if (!u) return null;
      if (u.startsWith('http://') || u.startsWith('https://')) return u;
      if (u.startsWith('//')) return 'http:' + u;
      if (u.startsWith('/')) return BASE + u;
      return BASE + '/' + u;
    };

    const normalized = Array.from(assetUrls).map((u) => abs(u)).filter(Boolean);

    log('Discovered asset URLs from HTML:', normalized.slice(0, 20));

    // Find one CSS and one JS among normalized
    const cssCandidates = normalized.filter((u) => u.endsWith('.css'));
    const jsCandidates = normalized.filter((u) => u.endsWith('.js'));
    const pnxCandidates = normalized.filter((u) => /pnx/i.test(u));

    // Add required public files
    const requiredPaths = new Set();
    if (cssCandidates.length) requiredPaths.add(cssCandidates[0]);
    if (jsCandidates.length) requiredPaths.add(jsCandidates[0]);
    if (pnxCandidates.length) requiredPaths.add(pnxCandidates[0]);

    requiredPaths.add(BASE + '/favicon.png');
    requiredPaths.add(BASE + '/manifest.webmanifest');
    requiredPaths.add(BASE + '/saboor-tahir.png');

    log('Final required verification URLs:');
    for (const u of requiredPaths) log(' -', u);

    // Perform requests and validate content types/status codes
    let allOk = true;
    for (const url of requiredPaths) {
      try {
        const res = await fetch(url);
        const status = res.status;
        const ct = res.headers.get('content-type') || '';
        let ok = res.ok;

        // Validate based on extension
        if (url.endsWith('.css')) {
          ok = ok && ct.includes('text/css');
        } else if (url.endsWith('.js')) {
          ok = ok && (ct.includes('javascript') || ct.includes('ecmascript'));
        } else if (url.endsWith('.png')) {
          ok = ok && ct.includes('image/png');
        } else if (url.endsWith('.webmanifest') || url.endsWith('.json')) {
          ok = ok && (ct.includes('json') || ct.includes('manifest') || ct.includes('application/manifest'));
        }

        if (!ok) {
          allOk = false;
          console.error(`[verify-http] FAIL: ${url} => ${status} (content-type: ${ct})`);
        } else {
          console.log(`[verify-http] OK: ${url} => ${status} (content-type: ${ct})`);
        }
      } catch (err) {
        allOk = false;
        console.error(`[verify-http] ERROR fetching ${url}:`, err);
      }
    }

    if (!allOk) throw new Error('One or more HTTP checks failed');

    log('All HTTP checks passed. Shutting down server.');
    child.kill('SIGTERM');
    // wait for child to exit
    const exitStart = Date.now();
    while (!exited && Date.now() - exitStart < 5000) {
      await wait(100);
    }
    process.exit(0);
  } catch (err) {
    console.error('[verify-http] ERROR:', err);
    try {
      child.kill('SIGTERM');
    } catch (e) {}
    process.exit(1);
  }
}

main();
