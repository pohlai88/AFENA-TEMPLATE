import type { LoggerConfig } from './types';

export const defaultConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') || 'info',
  timestamp: true,
  base: {
    pid: true,
    hostname: true,
    ...(process.env.SERVICE_NAME && { service: process.env.SERVICE_NAME }),
    ...(process.env.APP_VERSION && { version: process.env.APP_VERSION }),
  },
  redact: {
    paths: [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'req.headers.cookie',
      'req.headers.authorization',
    ],
    censor: '[REDACTED]',
  },
};

export const developmentConfig: LoggerConfig = {
  ...defaultConfig,
  level: 'debug',
  ...(process.env.NODE_ENV === 'development' && { prettyPrint: true }),
};

export const productionConfig: LoggerConfig = {
  ...defaultConfig,
  level: (process.env.LOG_LEVEL as 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal') || 'warn',
  prettyPrint: false,
};

export const testConfig: LoggerConfig = {
  ...defaultConfig,
  level: 'info', // Changed from 'silent' to 'info' since 'silent' is not a valid level
  prettyPrint: false,
  base: {
    pid: false,
    hostname: false,
    service: 'test',
    version: '0.1.0',
  },
};

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
