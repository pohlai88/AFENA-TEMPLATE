/**
 * Query Performance Monitoring
 * 
 * Provides observability for database queries:
 * - Slow query detection and logging
 * - Query duration tracking
 * - Shape-based query identification
 * - Production-safe logging (no PII/secrets)
 * 
 * Enforces:
 * - INV-OBS-01: No PII/secret leakage in logs
 * - INV-OBS-02: Production logs only shapeIds (no raw SQL)
 * - INV-OBS-03: All production calls MUST be tagged with shapeId
 */

import { QUERY_SHAPES, type QueryShapeKey } from './query-shapes';

/**
 * Query execution context for logging
 */
interface QueryContext {
  shapeId: string;
  duration: number;
  threshold: number;
  paramCount?: number;
  orgId?: string;
}

/**
 * Query monitor instance
 * 
 * Provides methods for tracking query performance and logging slow queries.
 */
export const queryMonitor = {
  /**
   * Create a slow query logger with configurable threshold
   * 
   * @param threshold - Milliseconds threshold for slow query warning (default: 1000ms)
   * @returns Logger instance with logQuery method
   */
  logSlowQueries: (threshold = 1000) => ({
    /**
     * Log a query execution
     * 
     * Returns a function to call when query completes.
     * Logs warning if duration exceeds threshold.
     * 
     * @param shapeKey - Query shape identifier from QUERY_SHAPES
     * @param paramCount - Number of parameters in query
     * @returns End function to call when query completes
     * 
     * @example
     * ```typescript
     * const end = queryMonitor.logSlowQueries().logQuery('invoices.list', 2);
     * try {
     *   const result = await db.select().from(invoices);
     *   return result;
     * } finally {
     *   end();
     * }
     * ```
     */
    logQuery(shapeKey: QueryShapeKey, paramCount: number) {
      const start = Date.now();
      const shape = QUERY_SHAPES[shapeKey];

      return () => {
        const duration = Date.now() - start;
        
        if (duration > threshold) {
          const context: QueryContext = {
            shapeId: shape.id,
            duration,
            threshold,
            paramCount,
          };

          console.warn('[QueryMonitor] Slow query detected', context);
        }
      };
    },
  }),

  /**
   * Log query error
   * 
   * @param shapeKey - Query shape identifier
   * @param error - Error that occurred
   * @param context - Additional context (orgId, etc.)
   */
  logError(
    shapeKey: QueryShapeKey,
    error: unknown,
    context?: { orgId?: string }
  ): void {
    const shape = QUERY_SHAPES[shapeKey];
    
    console.error('[QueryMonitor] Query failed', {
      shapeId: shape.id,
      error: error instanceof Error ? error.message : String(error),
      ...context,
    });
  },

  /**
   * Log query success with metrics
   * 
   * @param shapeKey - Query shape identifier
   * @param duration - Query duration in milliseconds
   * @param rowCount - Number of rows returned
   */
  logSuccess(
    shapeKey: QueryShapeKey,
    duration: number,
    rowCount?: number
  ): void {
    const shape = QUERY_SHAPES[shapeKey];

    // Only log if duration exceeds shape-specific threshold
    const threshold = shape.warnMs || 1000;
    if (duration > threshold) {
      console.warn('[QueryMonitor] Query exceeded threshold', {
        shapeId: shape.id,
        duration,
        threshold,
        rowCount,
      });
    }
  },
};

/**
 * Mandatory query wrapper with shape IDs
 * 
 * Wraps query execution with automatic monitoring.
 * All production queries should use this wrapper.
 * 
 * @param shapeKey - Query shape identifier from QUERY_SHAPES
 * @param paramCount - Number of parameters in query
 * @param fn - Query function to execute
 * @returns Result from query function
 * 
 * @example
 * ```typescript
 * // In packages/database/src/queries/invoices.ts
 * export async function listInvoices(orgId: string, limit: number) {
 *   return runQuery('invoices.list', 2, () =>
 *     db.select().from(invoices)
 *       .where(eq(invoices.orgId, orgId))
 *       .limit(limit)
 *   );
 * }
 * ```
 */
export async function runQuery<T>(
  shapeKey: QueryShapeKey,
  paramCount: number,
  fn: () => Promise<T>
): Promise<T> {
  const end = queryMonitor.logSlowQueries().logQuery(shapeKey, paramCount);
  
  try {
    return await fn();
  } finally {
    end();
  }
}

/**
 * Query fingerprint for development debugging
 * 
 * Creates a hash of SQL query for identification.
 * ONLY used in development - never log raw SQL in production.
 * 
 * @param query - SQL query string
 * @returns Fingerprint hash (first 16 chars of SHA-256)
 */
export function queryFingerprint(query: string): string {
  // Simple hash for development (not cryptographic)
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Development-only query logger
 * 
 * Logs raw SQL queries in development for debugging.
 * Automatically disabled in production.
 * 
 * @param query - SQL query string
 * @param params - Query parameters
 */
export function logQueryDev(query: string, params?: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[QueryMonitor] Query', {
      fingerprint: queryFingerprint(query),
      query: query.substring(0, 200), // Truncate long queries
      paramCount: params?.length || 0,
    });
  }
}

/**
 * Get query shape statistics
 * 
 * Returns summary of all registered query shapes.
 * Useful for documentation and monitoring setup.
 */
export function getQueryShapeStats() {
  const shapes = Object.values(QUERY_SHAPES);
  
  return {
    total: shapes.length,
    hot: shapes.filter(s => s.hot).length,
    cold: shapes.filter(s => !s.hot).length,
    avgWarnMs: Math.round(
      shapes.reduce((sum, s) => sum + (s.warnMs || 1000), 0) / shapes.length
    ),
  };
}
