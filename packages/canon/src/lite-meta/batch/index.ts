/**
 * Batch Operations Module
 * 
 * Pure, synchronous batch operations for processing multiple items.
 * Uses chunking to avoid blocking the event loop on large batches.
 */

// Batch Parser
export {
  parseAssetKeyBatch,
  parseAssetKeyBatchValid,
  parseAssetKeyBatchSeparate,
  parseAssetKeyBatchStats,
  type BatchParseStats,
} from './batch-parser';

// Batch Classifier
export {
  classifyColumnsBatch,
  classifyColumnsBatchPII,
  classifyColumnsBatchGrouped,
  classifyColumnsBatchStats,
  classifyColumnsMulti,
  type ColumnInfo,
  type ColumnClassificationResult,
  type BatchClassificationStats,
} from './batch-classifier';

// Chunking Utilities
export {
  processInChunks,
  processInChunksWithIndex,
  filterInChunks,
  reduceInChunks,
  groupByInChunks,
  calculateOptimalChunkSize,
} from './chunking';
