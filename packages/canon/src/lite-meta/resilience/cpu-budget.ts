/**
 * CPU Budget System
 * 
 * Prevents runaway operations by enforcing hard limits on:
 * - Maximum iterations
 * - Maximum execution time
 * - Maximum memory usage (approximate)
 * 
 * Throws BudgetExceededError when limits are exceeded.
 */

/**
 * CPU budget configuration
 */
export interface CpuBudget {
  /**
   * Maximum number of iterations (default: 10000)
   */
  maxIterations?: number;

  /**
   * Maximum execution time in milliseconds (default: 5000)
   */
  maxTimeMs?: number;

  /**
   * Maximum memory usage in bytes (default: 100MB)
   * Note: This is approximate and not enforced on all platforms
   */
  maxMemoryBytes?: number;

  /**
   * Operation name for error messages
   */
  operationName?: string;
}

/**
 * Budget exceeded error
 */
export class BudgetExceededError extends Error {
  constructor(
    public readonly budgetType: 'iterations' | 'time' | 'memory',
    public readonly limit: number,
    public readonly actual: number,
    public readonly operationName: string
  ) {
    super(
      `CPU budget exceeded: ${budgetType} limit of ${limit} exceeded (actual: ${actual}) in ${operationName}`
    );
    this.name = 'BudgetExceededError';
  }
}

/**
 * CPU budget tracker
 * 
 * Tracks iterations, time, and memory usage during an operation.
 */
export class CpuBudgetTracker {
  private iterations = 0;
  private readonly startTime: number;
  private readonly startMemory: number;
  private readonly maxIterations: number;
  private readonly maxTimeMs: number;
  private readonly maxMemoryBytes: number;
  private readonly operationName: string;

  constructor(budget: CpuBudget = {}) {
    this.maxIterations = budget.maxIterations ?? 10000;
    this.maxTimeMs = budget.maxTimeMs ?? 5000;
    this.maxMemoryBytes = budget.maxMemoryBytes ?? 100 * 1024 * 1024; // 100MB
    this.operationName = budget.operationName ?? 'operation';
    this.startTime = performance.now();
    this.startMemory = this.getMemoryUsage();
  }

  /**
   * Check budget before each iteration
   * Throws BudgetExceededError if any limit is exceeded
   */
  check(): void {
    // Check iterations
    this.iterations++;
    if (this.iterations > this.maxIterations) {
      throw new BudgetExceededError(
        'iterations',
        this.maxIterations,
        this.iterations,
        this.operationName
      );
    }

    // Check time
    const elapsed = performance.now() - this.startTime;
    if (elapsed > this.maxTimeMs) {
      throw new BudgetExceededError(
        'time',
        this.maxTimeMs,
        Math.round(elapsed),
        this.operationName
      );
    }

    // Check memory (approximate, not all platforms support this)
    const currentMemory = this.getMemoryUsage();
    const memoryUsed = currentMemory - this.startMemory;
    if (memoryUsed > this.maxMemoryBytes) {
      throw new BudgetExceededError(
        'memory',
        this.maxMemoryBytes,
        memoryUsed,
        this.operationName
      );
    }
  }

  /**
   * Get current iteration count
   */
  getIterations(): number {
    return this.iterations;
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedMs(): number {
    return performance.now() - this.startTime;
  }

  /**
   * Get memory usage (approximate)
   * Returns 0 if not supported on platform
   */
  private getMemoryUsage(): number {
    // Node.js
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }

    // Browser (if supported)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }

    // Not supported
    return 0;
  }

  /**
   * Get budget statistics
   */
  getStats(): {
    iterations: number;
    elapsedMs: number;
    memoryBytes: number;
    limits: {
      maxIterations: number;
      maxTimeMs: number;
      maxMemoryBytes: number;
    };
  } {
    return {
      iterations: this.iterations,
      elapsedMs: this.getElapsedMs(),
      memoryBytes: this.getMemoryUsage() - this.startMemory,
      limits: {
        maxIterations: this.maxIterations,
        maxTimeMs: this.maxTimeMs,
        maxMemoryBytes: this.maxMemoryBytes,
      },
    };
  }
}

/**
 * Execute a function with CPU budget enforcement
 * 
 * @param fn - Function to execute
 * @param budget - CPU budget configuration
 * @returns Result of the function
 * @throws BudgetExceededError if budget is exceeded
 * 
 * @example
 * ```typescript
 * const result = withBudget(() => {
 *   // Your operation here
 *   return processLargeDataset(data);
 * }, {
 *   maxIterations: 1000,
 *   maxTimeMs: 1000,
 *   operationName: 'processLargeDataset',
 * });
 * ```
 */
export function withBudget<T>(
  fn: (tracker: CpuBudgetTracker) => T,
  budget: CpuBudget = {}
): T {
  const tracker = new CpuBudgetTracker(budget);
  return fn(tracker);
}

/**
 * Default CPU budgets for common operations
 */
export const DEFAULT_BUDGETS = {
  /**
   * Fast operations (< 100ms)
   */
  fast: {
    maxIterations: 1000,
    maxTimeMs: 100,
    maxMemoryBytes: 10 * 1024 * 1024, // 10MB
  },

  /**
   * Normal operations (< 1s)
   */
  normal: {
    maxIterations: 10000,
    maxTimeMs: 1000,
    maxMemoryBytes: 50 * 1024 * 1024, // 50MB
  },

  /**
   * Slow operations (< 5s)
   */
  slow: {
    maxIterations: 50000,
    maxTimeMs: 5000,
    maxMemoryBytes: 100 * 1024 * 1024, // 100MB
  },

  /**
   * Batch operations (< 30s)
   */
  batch: {
    maxIterations: 100000,
    maxTimeMs: 30000,
    maxMemoryBytes: 500 * 1024 * 1024, // 500MB
  },
} as const;
