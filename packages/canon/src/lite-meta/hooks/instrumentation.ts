/**
 * Instrumentation Hooks for LiteMeta
 * 
 * Lightweight callback-based instrumentation with zero overhead when disabled.
 * Enables observability without forcing dependencies on logging/metrics libraries.
 */

/**
 * Context for function call hooks
 */
export interface CallContext {
  /**
   * Function name being called
   */
  functionName: string;

  /**
   * Input arguments (sanitized for logging)
   */
  args: unknown[];

  /**
   * Timestamp when call started (milliseconds)
   */
  startTime: number;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Context for function completion hooks
 */
export interface CallEndContext extends CallContext {
  /**
   * Duration in milliseconds
   */
  duration: number;

  /**
   * Whether the call succeeded
   */
  success: boolean;

  /**
   * Result value (if successful)
   */
  result?: unknown;

  /**
   * Error (if failed)
   */
  error?: Error;
}

/**
 * Context for cache operation hooks
 */
export interface CacheContext {
  /**
   * Cache operation type
   */
  operation: 'hit' | 'miss' | 'set' | 'evict' | 'clear';

  /**
   * Cache key
   */
  key: string;

  /**
   * Cache name/identifier
   */
  cacheName: string;

  /**
   * Timestamp
   */
  timestamp: number;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Context for error hooks
 */
export interface ErrorContext {
  /**
   * Error that occurred
   */
  error: Error;

  /**
   * Function where error occurred
   */
  functionName: string;

  /**
   * Input arguments that caused the error
   */
  args: unknown[];

  /**
   * Timestamp
   */
  timestamp: number;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Instrumentation hooks interface
 * 
 * All hooks are optional and have zero overhead when not set.
 */
export interface InstrumentationHooks {
  /**
   * Called when a function starts execution
   */
  onCallStart?(context: CallContext): void;

  /**
   * Called when a function completes (success or failure)
   */
  onCallEnd?(context: CallEndContext): void;

  /**
   * Called when an error occurs
   */
  onError?(context: ErrorContext): void;

  /**
   * Called on cache hit
   */
  onCacheHit?(context: CacheContext): void;

  /**
   * Called on cache miss
   */
  onCacheMiss?(context: CacheContext): void;

  /**
   * Called when a value is set in cache
   */
  onCacheSet?(context: CacheContext): void;

  /**
   * Called when a value is evicted from cache
   */
  onCacheEvict?(context: CacheContext): void;

  /**
   * Called when cache is cleared
   */
  onCacheClear?(context: CacheContext): void;
}

/**
 * Global instrumentation hooks registry
 * 
 * Set hooks once at application startup.
 */
let globalHooks: InstrumentationHooks | null = null;

/**
 * Set global instrumentation hooks
 * 
 * @example
 * ```typescript
 * setInstrumentationHooks({
 *   onCallStart: (ctx) => console.log(`Starting ${ctx.functionName}`),
 *   onCallEnd: (ctx) => console.log(`Finished ${ctx.functionName} in ${ctx.duration}ms`),
 *   onCacheHit: (ctx) => console.log(`Cache hit: ${ctx.key}`),
 * });
 * ```
 */
export function setInstrumentationHooks(hooks: InstrumentationHooks | null): void {
  globalHooks = hooks;
}

/**
 * Get current instrumentation hooks
 */
export function getInstrumentationHooks(): InstrumentationHooks | null {
  return globalHooks;
}

/**
 * Clear all instrumentation hooks
 */
export function clearInstrumentationHooks(): void {
  globalHooks = null;
}

/**
 * Check if instrumentation is enabled
 */
export function isInstrumentationEnabled(): boolean {
  return globalHooks !== null;
}

/**
 * Emit call start event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCallStart(
  functionName: string,
  args: unknown[],
  metadata?: Record<string, unknown>
): CallContext | null {
  if (!globalHooks?.onCallStart) return null;

  const context: CallContext = {
    functionName,
    args,
    startTime: performance.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCallStart(context);
  } catch {
    // Swallow hook errors to prevent breaking application
  }

  return context;
}

/**
 * Emit call end event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCallEnd(
  startContext: CallContext | null,
  success: boolean,
  resultOrError?: unknown
): void {
  if (!globalHooks?.onCallEnd || !startContext) return;

  const context: CallEndContext = {
    ...startContext,
    duration: performance.now() - startContext.startTime,
    success,
    ...(success ? { result: resultOrError } : { error: resultOrError as Error }),
  };

  try {
    globalHooks.onCallEnd(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit error event
 * 
 * Zero overhead when hooks not set.
 */
export function emitError(
  functionName: string,
  error: Error,
  args: unknown[],
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onError) return;

  const context: ErrorContext = {
    error,
    functionName,
    args,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onError(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit cache hit event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCacheHit(
  key: string,
  cacheName: string,
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onCacheHit) return;

  const context: CacheContext = {
    operation: 'hit',
    key,
    cacheName,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCacheHit(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit cache miss event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCacheMiss(
  key: string,
  cacheName: string,
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onCacheMiss) return;

  const context: CacheContext = {
    operation: 'miss',
    key,
    cacheName,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCacheMiss(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit cache set event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCacheSet(
  key: string,
  cacheName: string,
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onCacheSet) return;

  const context: CacheContext = {
    operation: 'set',
    key,
    cacheName,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCacheSet(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit cache evict event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCacheEvict(
  key: string,
  cacheName: string,
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onCacheEvict) return;

  const context: CacheContext = {
    operation: 'evict',
    key,
    cacheName,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCacheEvict(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Emit cache clear event
 * 
 * Zero overhead when hooks not set.
 */
export function emitCacheClear(
  cacheName: string,
  metadata?: Record<string, unknown>
): void {
  if (!globalHooks?.onCacheClear) return;

  const context: CacheContext = {
    operation: 'clear',
    key: '', // No specific key for clear
    cacheName,
    timestamp: Date.now(),
    ...(metadata !== undefined ? { metadata } : {}),
  };

  try {
    globalHooks.onCacheClear(context);
  } catch {
    // Swallow hook errors
  }
}

/**
 * Decorator to instrument a function with hooks
 * 
 * @example
 * ```typescript
 * class MyClass {
 *   @Instrumented('myMethod')
 *   myMethod(arg: string): string {
 *     return `processed: ${arg}`;
 *   }
 * }
 * ```
 */
export function Instrumented(functionName?: string) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error('@Instrumented can only be applied to methods');
    }

    const name = functionName || propertyKey;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const startContext = emitCallStart(name, args);

      try {
        const result = originalMethod.apply(this, args);
        emitCallEnd(startContext, true, result);
        return result;
      } catch (error) {
        emitCallEnd(startContext, false, error);
        emitError(name, error as Error, args);
        throw error;
      }
    } as T;

    return descriptor;
  };
}

/**
 * Wrap a function with instrumentation
 * 
 * @example
 * ```typescript
 * const instrumentedFn = withInstrumentation(
 *   'myFunction',
 *   (x: number) => x * 2
 * );
 * ```
 */
export function withInstrumentation<TArgs extends unknown[], TReturn>(
  functionName: string,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    const startContext = emitCallStart(functionName, args);

    try {
      const result = fn(...args);
      emitCallEnd(startContext, true, result);
      return result;
    } catch (error) {
      emitCallEnd(startContext, false, error);
      emitError(functionName, error as Error, args);
      throw error;
    }
  };
}
