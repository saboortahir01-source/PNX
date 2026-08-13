import { useAzureMonitor } from "@azure/monitor-opentelemetry";

const connectionString =
  process.env.APPLICATIONINSIGHTS_CONNECTION_STRING?.trim();

const telemetryState = globalThis as typeof globalThis & {
  __pnxAzureMonitorInitialized?: boolean;
};

const QUERY_STRING_ATTRIBUTES = [
  "http.route",
  "http.target",
  "http.url",
  "url.full",
] as const;

type TelemetrySpan = {
  attributes?: Record<string, unknown>;
};

function stripQueryString(value: unknown): string {
  const text = String(value ?? "");
  const queryStart = text.indexOf("?");
  return queryStart === -1 ? text : text.slice(0, queryStart);
}

class RedactQueryStringsProcessor {
  onStart(): void {}

  onEnd(span: TelemetrySpan): void {
    const attributes = span.attributes;
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

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}

if (
  connectionString &&
  !telemetryState.__pnxAzureMonitorInitialized
) {
  try {
    useAzureMonitor({
      azureMonitorExporterOptions: {
        connectionString,
      },
      tracesPerSecond: 1,
      enableLiveMetrics: false,
      enablePerformanceCounters: false,
      enableTraceBasedSamplingForLogs: true,
      browserSdkLoaderOptions: {
        enabled: false,
      },
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
  } catch {
    console.error(
      "[PNX monitoring] Azure Monitor initialization failed."
    );
  }
}
