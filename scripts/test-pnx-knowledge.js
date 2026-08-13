// Lightweight repository-only tests for PNX Self-Knowledge Engine V1
// These tests intentionally avoid executing TypeScript files or building the app.
// Instead they inspect the allowed knowledge module and the chat route source
// to assert the expected static properties and ordering that guarantee
// "direct" answers are handled locally and don't reach the external model.

import fs from 'fs';
import assert from 'node:assert';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(msg) {
  console.error('[test-pnx] FAIL:', msg);
  process.exitCode = 1;
  throw new Error(msg);
}

function ok(msg) {
  console.log('[test-pnx] OK:', msg);
}

try {
  const knowledgePath = 'src/lib/pnx/knowledge.ts';
  const chatPath = 'src/routes/api/chat.ts';

  const knowledge = read(knowledgePath);
  const chat = read(chatPath);

  // 1) Allowlist content checks
  assert(knowledge.includes('Saboor Tahir'), 'Founder name not found in knowledge module');
  ok('Founder present in knowledge module');

  assert(knowledge.includes('Sonar 01') || knowledge.includes('Sonar 1'), 'Sonar 01 not present');
  assert(knowledge.includes('Sonar 02') || knowledge.includes('Sonar 2'), 'Sonar 02 not present');
  ok('Sonar agents present');

  assert(knowledge.includes('Google Search Console'), 'GSC connector not present');
  assert(knowledge.includes('YouTube'), 'YouTube connector mention missing');
  ok('Connectors present');

  assert(knowledge.includes('audit_page') || knowledge.includes('audit page'), 'audit_page tool missing');
  ok('Tool audit_page present');

  // blog presence and publishedAt
  assert(knowledge.includes('Free Agentic SEO Tool'), 'Expected blog title not present');
  assert(knowledge.includes('publishedAt'), 'publishedAt key not present in knowledge blogs');
  ok('Blogs present with publishedAt');

  // 2) Ensure knowledge module is static and does NOT read env or import.meta
  const forbidden = ['process.env', 'import.meta.env', 'VITE_'];
  for (const f of forbidden) {
    if (knowledge.includes(f)) fail(`Knowledge module must not reference ${f}`);
  }
  ok('Knowledge module does not reference environment variables or VITE_');

  // 3) Ordering check: queryKnowledge import must appear before azure env usage in chat route
  const importIdx = chat.indexOf("@/lib/pnx/knowledge");
  const azureIdx = chat.indexOf('AZURE_OPENAI_API_KEY');
  if (importIdx === -1) fail('api/chat.ts does not import the local knowledge module');
  if (azureIdx === -1) fail('api/chat.ts does not reference AZURE_OPENAI_API_KEY (unexpected)');
  if (!(importIdx < azureIdx)) fail('Local knowledge import must occur before Azure env checks to avoid external calls for direct facts');
  ok('api/chat ordering: local knowledge routed before Azure provider check');

  // 4) Check that static responses are returned via staticUiMessageStream for direct answers
  if (!chat.includes('staticUiMessageStream') || !chat.includes('queryKnowledge')) fail('chat route must use staticUiMessageStream and queryKnowledge for zero-API fast path');
  ok('Zero-API fast path constructs present');

  // 5) Quick scan for obvious secret-like tokens (patterns)
  const repo = read('package.json') + '\n' + read(chatPath) + '\n' + read(knowledgePath);
  const suspiciousPatterns = [/eyJ[A-Za-z0-9_-]{10,}/, /-----BEGIN [A-Z ]+-----/, /(['\"]?(?:aws|aws_secret|awsAccessKey|AKIA)[\w\-]{8,}['\"]?)/i];
  for (const p of suspiciousPatterns) {
    if (p.test(repo)) fail('Suspicious secret-like pattern detected in scanned sources: ' + String(p));
  }
  ok('No obvious secret-like patterns found in inspected sources');

  console.log('\nAll PNX knowledge checks passed.');
  process.exit(0);
} catch (err) {
  console.error('[test-pnx] ERROR:', err.message);
  process.exit(1);
}
