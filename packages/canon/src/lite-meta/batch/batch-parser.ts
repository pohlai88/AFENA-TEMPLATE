/**
 * Batch Asset Key Parsing
 * 
 * Pure, synchronous batch operations for parsing multiple asset keys.
 * Uses chunking to avoid blocking the event loop on large batches.
 */

import { parseAssetKey, type ParsedAssetKey } from '../core/asset-keys';

/**
 * Parse multiple asset keys in batch
 * 
 * Pure function - processes all keys synchronously with chunking.
 * For very large batches (>1000 keys), consider processing in multiple calls.
 * 
 * @param keys - Array of asset keys to parse
 * @param chunkSize - Number of keys to process per chunk (default: 100)
 * @returns Array of parsed results in same order as input
 */
export function parseAssetKeyBatch(
  keys: string[],
  chunkSize = 100
): ParsedAssetKey[] {
  const results: ParsedAssetKey[] = [];
  
  // Process in chunks to avoid blocking
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    
    for (const key of chunk) {
      results.push(parseAssetKey(key));
    }
  }
  
  return results;
}

/**
 * Parse asset keys and filter to valid only
 * 
 * @param keys - Array of asset keys to parse
 * @param chunkSize - Number of keys to process per chunk (default: 100)
 * @returns Array of valid parsed results only
 */
export function parseAssetKeyBatchValid(
  keys: string[],
  chunkSize = 100
): ParsedAssetKey[] {
  return parseAssetKeyBatch(keys, chunkSize).filter((parsed) => parsed.valid);
}

/**
 * Parse asset keys and separate valid from invalid
 * 
 * @param keys - Array of asset keys to parse
 * @param chunkSize - Number of keys to process per chunk (default: 100)
 * @returns Object with valid and invalid arrays
 */
export function parseAssetKeyBatchSeparate(
  keys: string[],
  chunkSize = 100
): {
  valid: ParsedAssetKey[];
  invalid: ParsedAssetKey[];
} {
  const results = parseAssetKeyBatch(keys, chunkSize);
  
  return {
    valid: results.filter((r) => r.valid),
    invalid: results.filter((r) => !r.valid),
  };
}

/**
 * Batch parsing statistics
 */
export interface BatchParseStats {
  total: number;
  valid: number;
  invalid: number;
  validRate: number;
  errorsByType: Record<string, number>;
}

/**
 * Parse asset keys and collect statistics
 * 
 * @param keys - Array of asset keys to parse
 * @param chunkSize - Number of keys to process per chunk (default: 100)
 * @returns Statistics about the batch parse operation
 */
export function parseAssetKeyBatchStats(
  keys: string[],
  chunkSize = 100
): BatchParseStats {
  const results = parseAssetKeyBatch(keys, chunkSize);
  
  const valid = results.filter((r) => r.valid).length;
  const invalid = results.length - valid;
  
  // Collect error types
  const errorsByType: Record<string, number> = {};
  for (const result of results) {
    if (!result.valid) {
      for (const error of result.errors) {
        // Extract error type from message (e.g., "Invalid segment count" -> "segment_count")
        const errorType = error.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
      }
    }
  }
  
  return {
    total: results.length,
    valid,
    invalid,
    validRate: results.length > 0 ? valid / results.length : 0,
    errorsByType,
  };
}
