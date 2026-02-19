/**
 * Custom Type Mapping Registry
 *
 * Scoped registry for custom PostgreSQL type mappings.
 * Supports conflict detection with priority-based resolution.
 */

import type { DataType } from '../enums/data-types';
import type { MappingReasonCode } from './reason-codes';

/**
 * Source of custom type mapping
 */
export type MappingSource = 'org' | 'migration' | 'system';

/**
 * Custom type mapping entry
 */
export interface CustomTypeMapping {
  pgType: string;
  canonType: DataType;
  confidence: number;
  reasonCodes: MappingReasonCode[];
  source: MappingSource;
  priority: number;
  allowOverride: boolean;
}

/**
 * Source rank for deterministic tie-breaking
 * Higher rank wins in case of equal priority
 */
const SOURCE_RANK: Record<MappingSource, number> = {
  system: 3,
  org: 2,
  migration: 1,
};

/**
 * Scoped type mapping registry
 * Manages custom PostgreSQL type mappings with conflict resolution
 */
export class ScopedTypeMappingRegistry {
  private mappings = new Map<string, CustomTypeMapping>();

  /**
   * Register a custom type mapping
   * 
   * Conflict resolution rules:
   * 1. If existing mapping has allowOverride=false, throw error
   * 2. If new mapping has lower priority than existing, throw error
   * 3. If equal priority, use source rank for deterministic tie-break
   * 
   * @param mapping - Custom type mapping to register
   * @throws Error if override is not allowed or priority is insufficient
   */
  register(mapping: CustomTypeMapping): void {
    const key = mapping.pgType.toLowerCase();
    const existing = this.mappings.get(key);

    if (existing) {
      // Rule 1: Only existing.allowOverride matters
      if (!existing.allowOverride) {
        throw new Error(
          `Cannot override mapping for '${mapping.pgType}' (source: ${existing.source}, allowOverride=false)`
        );
      }

      // Rule 2: Compare priority (higher wins)
      if (mapping.priority < existing.priority) {
        throw new Error(
          `Cannot override higher-priority mapping for '${mapping.pgType}' (existing: ${existing.priority}, new: ${mapping.priority})`
        );
      }

      // Rule 3: Tie-break by source rank (deterministic)
      if (mapping.priority === existing.priority) {
        if (SOURCE_RANK[mapping.source] <= SOURCE_RANK[existing.source]) {
          throw new Error(
            `Cannot override equal-priority mapping for '${mapping.pgType}' (tie-break: ${mapping.source} <= ${existing.source})`
          );
        }
      }
    }

    this.mappings.set(key, mapping);
  }

  /**
   * Resolve a custom type mapping
   * 
   * @param pgType - PostgreSQL type to resolve
   * @returns Custom mapping if registered, undefined otherwise
   */
  resolve(pgType: string): CustomTypeMapping | undefined {
    return this.mappings.get(pgType.toLowerCase());
  }

  /**
   * List all registered mappings
   * 
   * @returns Array of all custom mappings
   */
  list(): CustomTypeMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * Clear all registered mappings
   */
  clear(): void {
    this.mappings.clear();
  }

  /**
   * Check if a type has a custom mapping
   * 
   * @param pgType - PostgreSQL type to check
   * @returns True if custom mapping exists
   */
  has(pgType: string): boolean {
    return this.mappings.has(pgType.toLowerCase());
  }

  /**
   * Get count of registered mappings
   * 
   * @returns Number of custom mappings
   */
  get size(): number {
    return this.mappings.size;
  }
}

/**
 * Create a new scoped registry
 * 
 * @returns New registry instance
 */
export function createTypeMappingRegistry(): ScopedTypeMappingRegistry {
  return new ScopedTypeMappingRegistry();
}
