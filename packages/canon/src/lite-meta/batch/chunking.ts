/**
 * Chunking Utilities for Batch Operations
 * 
 * Pure utility functions for processing large arrays in chunks
 * to avoid blocking the event loop.
 */

/**
 * Process an array in chunks
 * 
 * Pure function that processes items in chunks and collects results.
 * Useful for avoiding event loop blocking on large datasets.
 * 
 * @param items - Array of items to process
 * @param processor - Function to process each item
 * @param chunkSize - Number of items per chunk (default: 100)
 * @returns Array of processed results in same order as input
 */
export function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 100
): R[] {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    for (const item of chunk) {
      results.push(processor(item));
    }
  }
  
  return results;
}

/**
 * Process an array in chunks with index
 * 
 * @param items - Array of items to process
 * @param processor - Function to process each item with its index
 * @param chunkSize - Number of items per chunk (default: 100)
 * @returns Array of processed results in same order as input
 */
export function processInChunksWithIndex<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  chunkSize = 100
): R[] {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    for (let j = 0; j < chunk.length; j++) {
      const globalIndex = i + j;
      results.push(processor(chunk[j]!, globalIndex));
    }
  }
  
  return results;
}

/**
 * Filter an array in chunks
 * 
 * @param items - Array of items to filter
 * @param predicate - Function to test each item
 * @param chunkSize - Number of items per chunk (default: 100)
 * @returns Array of items that pass the predicate
 */
export function filterInChunks<T>(
  items: T[],
  predicate: (item: T) => boolean,
  chunkSize = 100
): T[] {
  const results: T[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    for (const item of chunk) {
      if (predicate(item)) {
        results.push(item);
      }
    }
  }
  
  return results;
}

/**
 * Reduce an array in chunks
 * 
 * @param items - Array of items to reduce
 * @param reducer - Function to reduce items
 * @param initialValue - Initial accumulator value
 * @param chunkSize - Number of items per chunk (default: 100)
 * @returns Final accumulated value
 */
export function reduceInChunks<T, R>(
  items: T[],
  reducer: (acc: R, item: T) => R,
  initialValue: R,
  chunkSize = 100
): R {
  let accumulator = initialValue;
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    for (const item of chunk) {
      accumulator = reducer(accumulator, item);
    }
  }
  
  return accumulator;
}

/**
 * Group items by key in chunks
 * 
 * @param items - Array of items to group
 * @param keySelector - Function to extract grouping key
 * @param chunkSize - Number of items per chunk (default: 100)
 * @returns Map of key to array of items
 */
export function groupByInChunks<T, K>(
  items: T[],
  keySelector: (item: T) => K,
  chunkSize = 100
): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    for (const item of chunk) {
      const key = keySelector(item);
      const existing = groups.get(key) ?? [];
      existing.push(item);
      groups.set(key, existing);
    }
  }
  
  return groups;
}

/**
 * Calculate optimal chunk size based on item count
 * 
 * Pure function that suggests a chunk size based on total items.
 * Balances between too many small chunks and too few large chunks.
 * 
 * @param itemCount - Total number of items to process
 * @param minChunkSize - Minimum chunk size (default: 10)
 * @param maxChunkSize - Maximum chunk size (default: 1000)
 * @returns Suggested chunk size
 */
export function calculateOptimalChunkSize(
  itemCount: number,
  minChunkSize = 10,
  maxChunkSize = 1000
): number {
  if (itemCount <= minChunkSize) {
    return itemCount;
  }
  
  // Target ~10-20 chunks for good balance
  const targetChunks = 15;
  const calculatedSize = Math.ceil(itemCount / targetChunks);
  
  // Clamp to min/max
  return Math.max(minChunkSize, Math.min(maxChunkSize, calculatedSize));
}
