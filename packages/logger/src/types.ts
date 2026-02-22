// ---------------------------------------------------------------------------
// Log levels (matches Pino, including 'silent')
// ---------------------------------------------------------------------------
export type LogLevel =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'info'
  | 'debug'
  | 'trace'
  | 'silent';

// ---------------------------------------------------------------------------
// Component names — extendable without editing this package
// ---------------------------------------------------------------------------
export type ComponentName =
  | 'crud'
  | 'workflow'
  | 'search'
  | 'audit'
  | 'storage'
  | 'auth'
  | 'kernel'
  | 'web'
  | 'jobs'
  | (string & {});

// ---------------------------------------------------------------------------
// ALS-backed request context (set once per request/job boundary)
// ---------------------------------------------------------------------------
export interface RequestContext {
  request_id: string;
  org_id?: string;
  actor_id?: string;
  actor_type?: 'user' | 'service' | 'system';
  service: string;
  component?: string;
}

// ---------------------------------------------------------------------------
// Audit log context — stable schema for channel:"audit" child loggers
// ---------------------------------------------------------------------------
export interface AuditLogContext {
  channel: 'audit';
  org_id: string;
  entity_type: string;
  entity_id: string;
  action_type: string;
  actor_id: string;
  actor_type: 'user' | 'service' | 'system';
  request_id: string;
}

// ---------------------------------------------------------------------------
// Logger configuration (env-aware, no deprecated prettyPrint)
// ---------------------------------------------------------------------------
export interface LoggerTransport {
  target: string;
  options?: Record<string, unknown>;
}

export interface LoggerConfig {
  name?: string;
  level?: LogLevel;
  timestamp?: boolean;
  transport?: LoggerTransport;
  base?: {
    pid?: boolean;
    hostname?: boolean;
    service?: string;
    version?: string;
  };
  redact?: {
    paths: string[];
    censor?: string;
  };
}

// ---------------------------------------------------------------------------
// Backward-compatible interfaces (used by existing middleware / helpers)
// ---------------------------------------------------------------------------
export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  service?: string;
  version?: string;
  environment?: string;
  [key: string]: unknown;
}

export interface LogMetadata {
  timestamp?: string;
  level?: string;
  hostname?: string;
  pid?: number;
}

export interface ChildLoggerOptions {
  component?: string;
  module?: string;
  [key: string]: unknown;
}

export interface RequestLoggerOptions extends LogContext {
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
}
