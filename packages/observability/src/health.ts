/**
 * Health check utilities for afenda services
 *
 * @module health
 */

import { createLogger } from 'afenda-logger';
import type { HealthCheckConfig, HealthCheckResult, HealthCheckStatus } from './types';

const logger = createLogger({ name: 'observability:health' });

const startTime = Date.now();

/**
 * Create a health check instance
 *
 * @example
 * ```ts
 * const health = createHealthCheck({
 *   name: 'afenda-api',
 *   checks: {
 *     database: async () => {
 *       const isHealthy = await db.ping();
 *       return { healthy: isHealthy };
 *     },
 *     cache: async () => {
 *       const isHealthy = await redis.ping();
 *       return { healthy: isHealthy, message: 'Redis connection OK' };
 *     },
 *   },
 *   timeout: 5000,
 * });
 *
 * const result = await health.check();
 * ```
 */
export function createHealthCheck(config: HealthCheckConfig) {
  const { name, checks, timeout = 5000 } = config;

  return {
    /**
     * Run all health checks
     */
    async check(): Promise<HealthCheckResult> {
      const results: Record<string, HealthCheckStatus> = {};
      const checkPromises = Object.entries(checks).map(async ([checkName, checkFn]) => {
        const startTime = Date.now();

        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Health check timeout: ${checkName}`)), timeout),
          );

          const result = await Promise.race([checkFn(), timeoutPromise]);
          const responseTime = Date.now() - startTime;

          results[checkName] = {
            ...result,
            responseTime,
          };
        } catch (error) {
          const responseTime = Date.now() - startTime;
          results[checkName] = {
            healthy: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            responseTime,
          };
          logger.error({ error }, `Health check failed: ${checkName}`);
        }
      });

      await Promise.all(checkPromises);

      const allHealthy = Object.values(results).every((r) => r.healthy);

      return {
        healthy: allHealthy,
        name,
        checks: results,
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
      };
    },

    /**
     * Check readiness (all critical checks pass)
     */
    async ready(): Promise<boolean> {
      const result = await this.check();
      return result.healthy;
    },

    /**
     * Check liveness (process is alive)
     */
    async alive(): Promise<boolean> {
      return true;
    },
  };
}

/**
 * Common health check functions
 */
export const HealthChecks = {
  /**
   * Database health check
   */
  database: (pingFn: () => Promise<boolean>) => async (): Promise<HealthCheckStatus> => {
    try {
      const isHealthy = await pingFn();
      return {
        healthy: isHealthy,
        message: isHealthy ? 'Database connection OK' : 'Database connection failed',
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  },

  /**
   * Redis/Cache health check
   */
  cache: (pingFn: () => Promise<boolean>) => async (): Promise<HealthCheckStatus> => {
    try {
      const isHealthy = await pingFn();
      return {
        healthy: isHealthy,
        message: isHealthy ? 'Cache connection OK' : 'Cache connection failed',
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Cache check failed',
      };
    }
  },

  /**
   * External API health check
   */
  externalApi:
    (url: string, timeoutMs = 3000) =>
    async (): Promise<HealthCheckStatus> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const isHealthy = response.ok;
        return {
          healthy: isHealthy,
          message: isHealthy ? 'API reachable' : `API returned ${response.status}`,
          metadata: { statusCode: response.status },
        };
      } catch (error) {
        return {
          healthy: false,
          message: error instanceof Error ? error.message : 'API check failed',
        };
      }
    },

  /**
   * Memory usage health check
   */
  memory: (thresholdMB = 512) => async (): Promise<HealthCheckStatus> => {
    const usage = process.memoryUsage();
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const isHealthy = usedMB < thresholdMB;

    return {
      healthy: isHealthy,
      message: `Memory usage: ${usedMB}MB / ${thresholdMB}MB`,
      metadata: {
        heapUsedMB: usedMB,
        heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
        rssMB: Math.round(usage.rss / 1024 / 1024),
      },
    };
  },

  /**
   * Disk space health check (Node.js doesn't have built-in disk checks)
   * This is a placeholder - implement with a library like 'diskusage'
   */
  disk: () => async (): Promise<HealthCheckStatus> => {
    return {
      healthy: true,
      message: 'Disk check not implemented',
    };
  },
} as const;

/**
 * Simple uptime tracker
 */
export function getUptime(): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

/**
 * Get system information
 */
export function getSystemInfo() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: getUptime(),
    memory: {
      heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };
}
