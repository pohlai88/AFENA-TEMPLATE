/**
 * Client-side logger — dev-only console wrapper.
 *
 * This is the ONLY file in the codebase allowed to use console.*.
 * All client-side logging must go through this module.
 *
 * In production builds, all methods are no-ops.
 *
 * INVARIANT-11: Client bundles MUST NOT import packages/logger (Pino).
 */

const isDev = process.env.NODE_ENV === 'development';

/* eslint-disable no-console */
export const clientLogger = {
  debug: (...args: unknown[]) => { if (isDev) console.debug('[afena]', ...args); },
  info: (...args: unknown[]) => { if (isDev) console.info('[afena]', ...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn('[afena]', ...args); },
  error: (...args: unknown[]) => { if (isDev) console.error('[afena]', ...args); },
} as const;
/* eslint-enable no-console */
