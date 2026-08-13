// @ts-nocheck
// Server-side Azure Monitor / Application Insights initialization (Phase 1)
// Imported first in src/server.ts so instrumentation registers before other modules.

// Keep this module cheap when telemetry is disabled: only load the Azure package
// at runtime when APPLICATIONINSIGHTS_CONNECTION_STRING is present.

const conn = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
if (conn && conn.trim() !== "") {
  if ((globalThis as any).__pnx_azure_monitor_initialized__) {
    // already initialized
  } else {
    (globalThis as any).__pnx_azure_monitor_initialized__ = true;

    (async () => {
      try {
        const mod = await import('@azure/monitor-opentelemetry');
        const useAzureMonitor = mod.useAzureMonitor ?? mod.default?.useAzureMonitor ?? mod.default;

        const options = {
          connectionString: conn,
          tracesPerSecond: 1,
          enableLiveMetrics: false,
          enablePerformanceCounters: false,
          enableTraceBasedSamplingForLogs: true,
          browserSdkLoaderOptions: { enabled: false },
          instrumentations: {
            http: true,
            console: false,
            mongodb: false,
            mysql: false,
            pgsql: false,
            redis: false,
          },
        };

        try {
          if (typeof useAzureMonitor === 'function') {
            // Primary call path
            useAzureMonitor(options);
          } else if (typeof mod.default === 'function') {
            // Fallbacks for possible different package exports
            mod.default(options);
          }
        } catch (e) {
          // Non-fatal: initialization may vary across package versions. Continue with best-effort redaction setup.
          try {
            if (typeof mod.useAzureMonitor === 'function') mod.useAzureMonitor(options);
          } catch (_e) {
            // swallow
          }
        }

        // Best-effort: register a span processor to redact query strings and sensitive attributes
        try {
          const otelApi = await import('@opentelemetry/api');

          const tracer = otelApi.trace;
          const provider = tracer.getTracerProvider && tracer.getTracerProvider();

          class RedactingSpanProcessor {
            onStart(_span, _context) {}
            onEnd(span) {
              try {
                // Helper getters/setters that tolerate multiple span implementations
                const getAttr = (k) => {
                  try { if (typeof span.getAttribute === 'function') return span.getAttribute(k); } catch {};
                  try { if (span.attributes && typeof span.attributes === 'object') return span.attributes[k]; } catch {};
                  try { if (span._span && span._span.attributes) return span._span.attributes[k]; } catch {};
                  return undefined;
                };

                const setAttr = (k, v) => {
                  try { if (typeof span.setAttribute === 'function') span.setAttribute(k, v); } catch {};
                  try { if (span.attributes && typeof span.attributes === 'object') span.attributes[k] = v; } catch {};
                  try { if (span._span && span._span.attributes) span._span.attributes[k] = v; } catch {};
                };

                const stripQuery = (s) => {
                  if (!s || typeof s !== 'string') return s;
                  const idx = s.indexOf('?');
                  if (idx === -1) return s;
                  return s.substring(0, idx);
                };

                const redactUrl = (raw) => {
                  if (!raw || typeof raw !== 'string') return raw;
                  try {
                    const u = new URL(raw);
                    if (u.search && u.search.length > 0) {
                      u.search = '';
                      return u.toString();
                    }
                    return raw;
                  } catch (e) {
                    const i = raw.indexOf('?');
                    if (i !== -1) return raw.substring(0, i);
                    return raw;
                  }
                };

                // Keys that must have query strings removed
                const keysToStrip = ['http.route', 'http.target', 'http.url', 'url.full'];
                for (const k of keysToStrip) {
                  const v = getAttr(k);
                  if (v && typeof v === 'string') {
                    const newVal = (k === 'http.route' || k === 'http.target') ? stripQuery(v) : redactUrl(v);
                    setAttr(k, newVal);
                  }
                }

                // Replace url.query with REDACTED when present
                if (getAttr('url.query') !== undefined) {
                  setAttr('url.query', 'REDACTED');
                }

                // Redact commonly-sensitive attribute names and values
                const sensitiveNamePatterns = [/authorization/i, /cookie/i, /set-cookie/i, /x-api-key/i, /api[_-]?key/i, /access[_-]?token/i, /id[_-]?token/i, /token/i, /password/i, /secret/i, /env/i, /prompt/i, /ai[_-]?response/i, /connector/i];

                try {
                  const attrs = span.attributes || (span._span && span._span.attributes) || {};
                  if (attrs && typeof attrs === 'object') {
                    for (const k of Object.keys(attrs)) {
                      try {
                        for (const pat of sensitiveNamePatterns) {
                          if (pat.test(k)) {
                            setAttr(k, 'REDACTED');
                            break;
                          }
                        }

                        const val = attrs[k];
                        if (typeof val === 'string') {
                          if (val.includes('InstrumentationKey=') || val.includes('AppInsights=') || val.includes('Endpoint=')) {
                            setAttr(k, 'REDACTED');
                          }
                        }
                      } catch (e) {
                        // ignore per-attribute failures
                      }
                    }
                  }
                } catch (e) {
                  // ignore
                }

              } catch (e) {
                // swallow
              }
            }
            shutdown() { return Promise.resolve(); }
            forceFlush() { return Promise.resolve(); }
          }

          const processor = new RedactingSpanProcessor();

          if (provider && typeof provider.addSpanProcessor === 'function') {
            provider.addSpanProcessor(processor);
          } else if ((globalThis as any).otelGlobalProvider && typeof (globalThis as any).otelGlobalProvider.addSpanProcessor === 'function') {
            (globalThis as any).otelGlobalProvider.addSpanProcessor(processor);
          } else {
            // Best-effort: some package variants expose a global SDK instance
            try {
              const alt = (mod && (mod.sdk || mod.defaultSdk || (mod as any).monitor) ) || null;
              if (alt && typeof alt.addSpanProcessor === 'function') alt.addSpanProcessor(processor);
            } catch (e) {
              // swallow
            }
          }
        } catch (err) {
          // Non-fatal; redaction is best-effort
          try { console.error('azure-monitor: redaction setup failed', err); } catch {}
        }

      } catch (err) {
        // Do not print the connection string. Only surface the error.
        try { console.error('azure-monitor: failed to initialize telemetry', err); } catch {}
      }
    })();
  }
} else {
  // Telemetry disabled; intentionally do nothing.
}
