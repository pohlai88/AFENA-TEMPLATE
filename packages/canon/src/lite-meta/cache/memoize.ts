/**
 * Memoization Decorator for Pure Functions
 * 
 * Provides function-level memoization using the enhanced LRU cache.
 * Only use on pure, deterministic functions.
 */

import { EnhancedLRU } from './lru-enhanced';

/**
 * Memoization options
 */
export interface MemoizeOptions {
  /**
   * Maximum number of cached results (default: 100)
   */
  maxSize?: number;

  /**
   * Time-to-live in milliseconds (optional)
   */
  ttlMs?: number;

  /**
   * Custom key generator function
   * Default: JSON.stringify(args)
   */
  keyGenerator?: (...args: unknown[]) => string;

  /**
   * Custom size estimator for cache entries
   */
  estimateSize?: (value: unknown) => number;
}

/**
 * Create a cache key from function arguments
 * Default implementation uses JSON.stringify
 */
function defaultKeyGenerator(...args: unknown[]): string {
  try {
    return JSON.stringify(args);
  } catch {
    // Fallback for non-serializable args
    return args.map((arg) => String(arg)).join('|');
  }
}

/**
 * Memoize a pure function
 * 
 * Creates a cached version of the function that stores results
 * in an LRU cache. Subsequent calls with the same arguments
 * return the cached result.
 * 
 * **IMPORTANT**: Only use on pure, deterministic functions.
 * Do not use on functions with side effects.
 * 
 * @example
 * ```typescript
 * const expensiveFunction = (x: number, y: number) => {
 *   // Complex computation
 *   return x * y + Math.sqrt(x);
 * };
 * 
 * const memoized = memoize(expensiveFunction, { maxSize: 50 });
 * 
 * memoized(5, 10); // Computed
 * memoized(5, 10); // Cached (instant)
 * ```
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: MemoizeOptions = {}
): (...args: TArgs) => TReturn {
  const {
    maxSize = 100,
    ttlMs,
    keyGenerator = defaultKeyGenerator,
    estimateSize,
  } = options;

  // Create cache for this function
  const cache = new EnhancedLRU<string, TReturn>({
    maxSize,
    ...(ttlMs !== undefined ? { ttlMs } : {}),
    ...(estimateSize !== undefined ? { estimateSize } : {}),
  });

  // Return memoized function
  const memoized = (...args: TArgs): TReturn => {
    const key = keyGenerator(...args);

    // Check cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Compute and cache
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  // Attach cache stats method
  (memoized as typeof memoized & { getStats: typeof cache.getStats }).getStats = () =>
    cache.getStats();

  // Attach cache clear method
  (memoized as typeof memoized & { clear: typeof cache.clear }).clear = () =>
    cache.clear();

  return memoized;
}

/**
 * Memoize a method on a class
 * 
 * Decorator for class methods. Creates a per-instance cache.
 * 
 * **IMPORTANT**: Only use on pure, deterministic methods.
 * 
 * @example
 * ```typescript
 * class Calculator {
 *   @Memoized({ maxSize: 50 })
 *   expensiveCalculation(x: number, y: number): number {
 *     return x * y + Math.sqrt(x);
 *   }
 * }
 * ```
 */
export function Memoized(options: MemoizeOptions = {}) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error('@Memoized can only be applied to methods');
    }

    // Store cache per instance using WeakMap
    const cacheMap = new WeakMap<object, EnhancedLRU<string, unknown>>();

    descriptor.value = function (this: object, ...args: unknown[]) {
      // Get or create cache for this instance
      let cache = cacheMap.get(this);
      if (!cache) {
        cache = new EnhancedLRU({
          maxSize: options.maxSize ?? 100,
          ...(options.ttlMs !== undefined ? { ttlMs: options.ttlMs } : {}),
          ...(options.estimateSize !== undefined ? { estimateSize: options.estimateSize } : {}),
        });
        cacheMap.set(this, cache);
      }

      // Generate cache key
      const keyGenerator = options.keyGenerator ?? defaultKeyGenerator;
      const key = keyGenerator(...args);

      // Check cache
      const cached = cache.get(key);
      if (cached !== undefined) {
        return cached as ReturnType<T>;
      }

      // Compute and cache
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result as ReturnType<T>;
    } as T;

    return descriptor;
  };
}

/**
 * Create a memoized version with custom key generation
 * 
 * Useful when default JSON.stringify is not suitable
 * (e.g., for objects with circular references)
 * 
 * @example
 * ```typescript
 * const memoized = memoizeWith(
 *   (user) => user.id, // Key by user.id only
 *   (user) => fetchUserData(user),
 *   { maxSize: 50 }
 * );
 * ```
 */
export function memoizeWith<TArgs extends unknown[], TReturn>(
  keyGenerator: (...args: TArgs) => string,
  fn: (...args: TArgs) => TReturn,
  options: Omit<MemoizeOptions, 'keyGenerator'> = {}
): (...args: TArgs) => TReturn {
  return memoize(fn, { ...options, keyGenerator: keyGenerator as (...args: unknown[]) => string });
}
