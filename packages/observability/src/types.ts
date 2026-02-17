/**
 * Type definitions for observability utilities
 */

export interface TracingConfig {
  /** Service name for tracing (e.g., 'afenda-web') */
  serviceName: string;
  /** Service version */
  serviceVersion: string;
  /** Environment (development, staging, production) */
  environment: string;
  /** OTLP collector endpoint */
  otlpEndpoint?: string;
  /** OTLP headers for authentication */
  otlpHeaders?: Record<string, string>;
  /** Sampling rate (0.0 to 1.0) */
  samplingRate?: number;
  /** Enable auto-instrumentation */
  autoInstrumentation?: boolean;
}

export interface SentryConfig {
  /** Sentry DSN */
  dsn: string;
  /** Environment name */
  environment: string;
  /** Sample rate for traces (0.0 to 1.0) */
  tracesSampleRate?: number;
  /** Sample rate for profiles (0.0 to 1.0) */
  profilesSampleRate?: number;
  /** Enable debug mode */
  debug?: boolean;
  /** Release version */
  release?: string;
}

export interface MetricLabels {
  [key: string]: string | number;
}

export interface HealthCheckResult {
  /** Overall health status */
  healthy: boolean;
  /** Health check name */
  name: string;
  /** Individual check results */
  checks: Record<string, HealthCheckStatus>;
  /** Timestamp */
  timestamp: string;
  /** Uptime in seconds */
  uptime: number;
}

export interface HealthCheckStatus {
  /** Check passed */
  healthy: boolean;
  /** Optional message */
  message?: string;
  /** Response time in ms */
  responseTime?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface HealthCheckConfig {
  /** Service name */
  name: string;
  /** Health check functions */
  checks: Record<string, () => Promise<Omit<HealthCheckStatus, 'healthy'> & { healthy: boolean }>>;
  /** Timeout for each check (ms) */
  timeout?: number;
}

export interface CorrelationIdConfig {
  /** Header name for correlation ID */
  headerName?: string;
  /** Generate correlation ID if not present */
  generateIfMissing?: boolean;
  /** Correlation ID generator function */
  generator?: () => string;
}

export interface SpanAttributes {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}
