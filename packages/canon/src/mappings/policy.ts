/**
 * Mapping Policy
 *
 * Policy-driven fallback behavior for unknown types.
 * Simplified: fallback always emits warnings (no emitWarning flag).
 */

import type { DataType } from '../enums/data-types';
import type { MappingWarning } from './warnings';
import type { MappingReasonCode } from './reason-codes';

/**
 * Unknown type policy
 * Controls behavior when encountering unknown PostgreSQL types
 */
export interface UnknownTypePolicy {
  /**
   * Action to take on unknown types
   * - 'throw': Throw error immediately (strict mode)
   * - 'warn_and_fallback': Emit warning and use fallback type
   * - 'fallback_only': Use fallback type silently (not recommended)
   */
  action: 'throw' | 'warn_and_fallback' | 'fallback_only';
  
  /**
   * Fallback type to use when action is not 'throw'
   */
  fallbackType: DataType;
}

/**
 * Default policy: strict mode (throw on unknown types)
 */
export const DEFAULT_UNKNOWN_TYPE_POLICY: UnknownTypePolicy = {
  action: 'throw',
  fallbackType: 'long_text',
};

/**
 * Mapping result with policy application
 */
export interface PolicyMappingResult {
  canonType: DataType;
  confidence: number;
  reasonCodes: MappingReasonCode[];
  warnings: MappingWarning[];
  notes?: string;
}

/**
 * Apply policy to handle unknown type errors
 * 
 * @param error - Error thrown by core mapping function
 * @param pgType - PostgreSQL type that caused the error
 * @param policy - Policy to apply
 * @returns Mapping result with fallback or re-throws error
 */
export function applyUnknownTypePolicy(
  error: Error,
  pgType: string,
  policy: UnknownTypePolicy
): PolicyMappingResult {
  if (policy.action === 'throw') {
    throw error;
  }

  // Fallback ALWAYS emits warning (simplified from original plan)
  const warning: MappingWarning = {
    code: 'UNKNOWN_PG_TYPE',
    message: `Unknown type '${pgType}', falling back to ${policy.fallbackType}: ${error.message}`,
    pgType,
    fallbackType: policy.fallbackType,
  };

  return {
    canonType: policy.fallbackType,
    confidence: 0.4, // LOSSY_FALLBACK
    reasonCodes: ['LOSSY_FALLBACK', 'UNKNOWN_PG_TYPE'],
    warnings: [warning],
    notes: warning.message,
  };
}
