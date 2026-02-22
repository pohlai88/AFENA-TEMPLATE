export * from './config';
export * from './context';
export * from './logger';
export * from './middleware';
export * from './types';

// Re-export pino types
export type { Logger } from 'pino';

// Re-export pino for advanced usage
export { pino } from 'pino';

/**
 * Default logger instance for convenience imports.
 * Usage: `import { logger } from 'afenda-logger';`
 */
import { createLogger } from './logger';
export const logger = createLogger();
