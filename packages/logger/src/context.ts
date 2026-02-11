import type { RequestContext } from './types';
import type { Logger } from 'pino';

// ---------------------------------------------------------------------------
// AsyncLocalStorage-backed request context (Edge-safe)
//
// node:async_hooks is not available in Edge Runtime. We lazily
// resolve AsyncLocalStorage so this module can be imported anywhere.
// In Edge, all functions gracefully degrade (no context binding).
// ---------------------------------------------------------------------------

interface ALS<T> {
  run<R>(store: T, fn: () => R): R;
  getStore(): T | undefined;
}

let als: ALS<RequestContext> | null = null;

function getALS(): ALS<RequestContext> | null {
  if (als) return als;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AsyncLocalStorage } = require('node:async_hooks') as {
      AsyncLocalStorage: new <T>() => ALS<T>;
    };
    als = new AsyncLocalStorage<RequestContext>();
    return als;
  } catch {
    // Edge Runtime — AsyncLocalStorage not available
    return null;
  }
}

/**
 * Run a function within a request/job context.
 * All logs emitted inside `fn` will automatically include the context fields.
 * In Edge Runtime, runs `fn` directly without context.
 */
export function runWithContext<T>(ctx: RequestContext, fn: () => T): T {
  const store = getALS();
  if (store) {
    return store.run(ctx, fn);
  }
  return fn();
}

/**
 * Get the current request context (if inside a `runWithContext` scope).
 * Returns `undefined` outside of any context scope or in Edge Runtime.
 */
export function getContext(): RequestContext | undefined {
  return getALS()?.getStore();
}

/**
 * Bind a base logger to the current ALS context.
 * If context exists, returns `base.child(ctx)`.
 * If no context (or Edge Runtime), returns the base logger unchanged.
 */
export function bindLogger(base: Logger): Logger {
  const ctx = getALS()?.getStore();
  if (ctx) {
    return base.child(ctx);
  }
  return base;
}
