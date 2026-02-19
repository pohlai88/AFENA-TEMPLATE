/**
 * Mapping Cache
 *
 * LRU cache for type mapping operations with deterministic key encoding.
 * Supports scoped contexts for batch jobs to prevent test contamination.
 */

import { LRUCache } from 'lru-cache';
import type { DataType } from '../enums/data-types';
import type { MappingReasonCode } from './reason-codes';

/**
 * Canonical pg type aliases (normalize before caching)
 */
const PG_TYPE_ALIASES: Record<string, string> = {
  int2: 'smallint',
  int4: 'integer',
  int8: 'bigint',
  float4: 'real',
  float8: 'double precision',
  bool: 'boolean',
  timestamptz: 'timestamp with time zone',
  'character varying': 'varchar',
};

/**
 * Normalize PostgreSQL type for cache key
 * Strips array suffixes and applies alias normalization
 */
function normalizePgTypeForCache(pgType: string): string {
  const lower = pgType.toLowerCase().trim();
  // Strip array suffix for base type
  const base = lower.replace(/\[\]$/, '').replace(/^_/, '');
  // Apply alias normalization
  return PG_TYPE_ALIASES[base] ?? base;
}

/**
 * Encode deterministic cache key
 * Format: pgType|mode|maxLen|precision|scale
 */
export function encodeCacheKey(
  pgType: string,
  meta?: { maxLength?: number; precision?: number; scale?: number },
  mode?: 'strict' | 'loose'
): string {
  const normalized = normalizePgTypeForCache(pgType);
  const m = mode ?? 'strict';
  const len = meta?.maxLength ?? '';
  const prec = meta?.precision ?? '';
  const scale = meta?.scale ?? '';
  return `${normalized}|${m}|${len}|${prec}|${scale}`;
}

/**
 * Cached mapping result
 */
export interface CachedMapping {
  canonType: DataType;
  confidence: number;
  reasonCodes: MappingReasonCode[];
  warnings: Array<{
    code: MappingReasonCode;
    message: string;
    pgType?: string;
    fallbackType?: DataType;
  }>;
  notes?: string;
}

/**
 * Context-scoped cache for batch jobs
 */
export class MappingContext {
  private cache = new LRUCache<string, CachedMapping>({
    max: 500,
    ttl: 1000 * 60 * 60, // 1 hour
  });

  get(key: string): CachedMapping | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: CachedMapping): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Global cache (module-level)
 */
const globalCache = new LRUCache<string, CachedMapping>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

/**
 * Current context (null = use global cache)
 */
let currentContext: MappingContext | null = null;

/**
 * Create a new mapping context for batch operations
 */
export function createMappingContext(): MappingContext {
  return new MappingContext();
}

/**
 * Run function with a specific mapping context
 */
export function withMappingContext<T>(ctx: MappingContext, fn: () => T): T {
  const prev = currentContext;
  currentContext = ctx;
  try {
    return fn();
  } finally {
    currentContext = prev;
  }
}

/**
 * Get cached mapping (uses current context or global cache)
 */
export function getCachedMapping(key: string): CachedMapping | undefined {
  return currentContext ? currentContext.get(key) : globalCache.get(key);
}

/**
 * Set cached mapping (uses current context or global cache)
 */
export function setCachedMapping(key: string, value: CachedMapping): void {
  if (currentContext) {
    currentContext.set(key, value);
  } else {
    globalCache.set(key, value);
  }
}

/**
 * Clear global cache (for testing)
 */
export function clearGlobalCache(): void {
  globalCache.clear();
}
