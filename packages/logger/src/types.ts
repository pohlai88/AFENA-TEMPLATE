export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  service?: string;
  version?: string;
  environment?: string;
  [key: string]: any;
}

export interface LogMetadata {
  timestamp?: string;
  level?: string;
  hostname?: string;
  pid?: number;
}

export interface LoggerConfig {
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  prettyPrint?: boolean;
  timestamp?: boolean;
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

export interface ChildLoggerOptions {
  component?: string;
  module?: string;
  [key: string]: any;
}

export interface RequestLoggerOptions extends LogContext {
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
}
