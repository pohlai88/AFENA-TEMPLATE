import type { CompiledWorkflow, WorkflowNode } from './types';

/**
 * Cache entry for a compiled workflow.
 */
interface CacheEntry {
  compiled: CompiledWorkflow;
  compiledHash: string;
  compilerVersion: string;
  nodesJson: WorkflowNode[];
  cachedAt: number;
}

/**
 * Compiled workflow cache — TTL by (definition_id, version).
 *
 * PRD § Compiled Cache:
 * - Key: `${definitionId}:${version}`
 * - Validates compiled_hash on every hit (WF-07)
 * - TTL-based eviction (default 5 minutes)
 * - Thread-safe for single-process (Map-based)
 */
export class CompiledWorkflowCache {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(options?: { ttlMs?: number; maxEntries?: number }) {
    this.ttlMs = options?.ttlMs ?? 5 * 60 * 1000; // 5 minutes default
    this.maxEntries = options?.maxEntries ?? 100;
  }

  /**
   * Build cache key from definition ID and version.
   */
  private key(definitionId: string, version: number): string {
    return `${definitionId}:${String(version)}`;
  }

  /**
   * Get a compiled workflow from cache.
   * Returns null if not cached, expired, or hash mismatch.
   */
  get(
    definitionId: string,
    version: number,
    expectedHash?: string,
  ): {
    compiled: CompiledWorkflow;
    compiledHash: string;
    compilerVersion: string;
    nodesJson: WorkflowNode[];
  } | null {
    const k = this.key(definitionId, version);
    const entry = this.cache.get(k);

    if (!entry) return null;

    // TTL check
    if (Date.now() - entry.cachedAt > this.ttlMs) {
      this.cache.delete(k);
      return null;
    }

    // Hash verification (WF-07)
    if (expectedHash && entry.compiledHash !== expectedHash) {
      this.cache.delete(k);
      return null;
    }

    return {
      compiled: entry.compiled,
      compiledHash: entry.compiledHash,
      compilerVersion: entry.compilerVersion,
      nodesJson: entry.nodesJson,
    };
  }

  /**
   * Store a compiled workflow in cache.
   */
  set(
    definitionId: string,
    version: number,
    value: {
      compiled: CompiledWorkflow;
      compiledHash: string;
      compilerVersion: string;
      nodesJson: WorkflowNode[];
    },
  ): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxEntries) {
      this.evictOldest();
    }

    const k = this.key(definitionId, version);
    this.cache.set(k, {
      ...value,
      cachedAt: Date.now(),
    });
  }

  /**
   * Invalidate a specific cache entry.
   */
  invalidate(definitionId: string, version: number): void {
    this.cache.delete(this.key(definitionId, version));
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size.
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Evict the oldest entry by cachedAt timestamp.
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.cachedAt < oldestTime) {
        oldestTime = entry.cachedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
}
