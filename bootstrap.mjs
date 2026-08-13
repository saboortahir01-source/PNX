// bootstrap.mjs
// Initialize Azure Monitor (if configured) before importing the Nitro/PNX server
// - Read APPLICATIONINSIGHTS_CONNECTION_STRING only from process.env
// - Dynamically import useAzureMonitor from @azure/monitor-opentelemetry
// - Preserve existing options and the query-string redaction processor

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  ? process.env.APPLICATIONINSIGHTS_CONNECTION_STRING.trim()
  : undefined;

const telemetryState = globalThis;

const QUERY_STRING_ATTRIBUTES = [
  "http.route",
  "http.target",
  "http.url",
  "url.full",
];

function stripQueryString(value) {
  const text = String(value ?? "");
  const queryStart = text.indexOf("?");
  return queryStart === -1 ? text : text.slice(0, queryStart);
}

class RedactQueryStringsProcessor {
  onStart() {}

  onEnd(span) {
    const attributes = span && span.attributes;
    if (!attributes) return;

    for (const attribute of QUERY_STRING_ATTRIBUTES) {
      if (typeof attributes[attribute] === "string") {
        attributes[attribute] = stripQueryString(attributes[attribute]);
      }
    }

    if ("url.query" in attributes) {
      attributes["url.query"] = "[REDACTED]";
    }
  }

  forceFlush() {
    return Promise.resolve();
  }

  shutdown() {
    return Promise.resolve();
  }
}

// Initialize Azure Monitor only if a connection string is present.
// Fail-open: on any error, log a safe message and continue to start PNX.
if (connectionString && !telemetryState.__pnxAzureMonitorInitialized) {
  try {
    const mod = await import("@azure/monitor-opentelemetry");
    const useAzureMonitor = mod?.useAzureMonitor ?? mod?.default;

    if (typeof useAzureMonitor === "function") {
      try {
        useAzureMonitor({
          azureMonitorExporterOptions: {
            connectionString,
          },
          tracesPerSecond: 1,
          enableLiveMetrics: false,
          enablePerformanceCounters: false,
          enableTraceBasedSamplingForLogs: true,
          browserSdkLoaderOptions: { enabled: false },
          spanProcessors: [new RedactQueryStringsProcessor()],
          instrumentationOptions: {
            http: { enabled: true },
            azureSdk: { enabled: false },
            console: { enabled: false },
            mongoDb: { enabled: false },
            mySql: { enabled: false },
            postgreSql: { enabled: false },
            redis: { enabled: false },
            redis4: { enabled: false },
          },
        });

        telemetryState.__pnxAzureMonitorInitialized = true;
        // Must log exactly this on success
        console.log("[PNX monitoring] Azure Monitor initialized.");
      } catch (err) {
        // Fail open: do not crash the server if initialization fails.
        console.error("[PNX monitoring] Azure Monitor initialization failed.");
      }
    }
  } catch (err) {
    console.error("[PNX monitoring] Azure Monitor initialization failed.");
  }
}

// Finally, start the built Nitro server
await import("./.output/server/index.mjs");
