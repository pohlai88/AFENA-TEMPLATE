import { createComponentLogger, createLogger, getLogger } from 'afena-logger';

// Base singleton — initialized once with service context
const base = createLogger({
  service: 'web',
  environment: process.env.NODE_ENV || 'development',
});

// Component-scoped logger for general web app usage
export const logger = createComponentLogger(base, 'web');

/**
 * ALS-aware logger — returns a child bound to the current request context.
 * Use this inside API route handlers where middleware has set ALS context.
 */
export { getLogger };

export default logger;
