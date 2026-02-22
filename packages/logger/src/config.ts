import type { LoggerConfig, LogLevel } from './types';

// ---------------------------------------------------------------------------
// Shared defaults
// ---------------------------------------------------------------------------
const redactPaths = [
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'cookie',
  'req.headers.cookie',
  'req.headers.authorization',
];

const defaultConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'info',
  timestamp: true,
  base: {
    pid: true,
    hostname: true,
    ...(process.env.SERVICE_NAME && { service: process.env.SERVICE_NAME }),
    ...(process.env.APP_VERSION && { version: process.env.APP_VERSION }),
  },
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
};

// ---------------------------------------------------------------------------
// Environment-specific configs
// ---------------------------------------------------------------------------

/** prod: JSON logs, level info (overridable via LOG_LEVEL), no transport */
export const productionConfig: LoggerConfig = {
  ...defaultConfig,
  level: (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'info',
};

/** dev: pretty logs, level debug */
export const developmentConfig: LoggerConfig = {
  ...defaultConfig,
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

/** test: silent — no log output during test runs */
export const testConfig: LoggerConfig = {
  ...defaultConfig,
  level: 'silent',
  base: {
    pid: false,
    hostname: false,
    service: 'test',
    version: '0.1.0',
  },
};

// ---------------------------------------------------------------------------
// Config resolver
// ---------------------------------------------------------------------------
export function getConfig(): LoggerConfig {
  const env = process.env.NODE_ENV ?? 'development';

  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    default:
      return developmentConfig;
  }
}
