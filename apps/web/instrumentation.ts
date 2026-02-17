function parseOtelHeaders(headersEnv: string | undefined): Record<string, string> | undefined {
  if (!headersEnv) return undefined;
  
  try {
    // Try parsing as JSON first (OpenTelemetry standard format)
    return JSON.parse(headersEnv);
  } catch {
    // Fall back to key=value format (e.g., "Authorization=Bearer xxx")
    const headers: Record<string, string> = {};
    const pairs = headersEnv.split(',');
    
    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split('=');
      if (key && valueParts.length > 0) {
        headers[key.trim()] = valueParts.join('=').trim();
      }
    }
    
    return Object.keys(headers).length > 0 ? headers : undefined;
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { flushLogger } = await import('afenda-logger');
    const { initializeObservability } = await import('afenda-observability');

    // Initialize OpenTelemetry and Sentry
    await initializeObservability({
      tracing: {
        serviceName: process.env.OTEL_SERVICE_NAME || 'afenda-web',
        serviceVersion: process.env.OTEL_SERVICE_VERSION || '0.1.0',
        environment: process.env.NODE_ENV || 'development',
        otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        otlpHeaders: parseOtelHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
        samplingRate: process.env.OTEL_TRACES_SAMPLER_ARG
          ? parseFloat(process.env.OTEL_TRACES_SAMPLER_ARG)
          : undefined,
      },
      sentry: process.env.SENTRY_DSN
        ? {
            dsn: process.env.SENTRY_DSN,
            environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
            tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
              ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE)
              : 0.1,
            profilesSampleRate: process.env.SENTRY_PROFILES_SAMPLE_RATE
              ? parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE)
              : 0.1,
            release: process.env.SENTRY_RELEASE,
          }
        : undefined,
    });

    // Flush buffered Pino logs on graceful shutdown to prevent data loss
    process.on('beforeExit', () => {
      flushLogger();
    });

    process.on('SIGTERM', () => {
      flushLogger();
    });

    process.on('SIGINT', () => {
      flushLogger();
    });
  }
}

