/**
 * LiteMetadata Barrel Export
 *
 * Pure metadata operations: asset identification, alias resolution, lineage,
 * quality rules, column classification, and glossary types.
 * 
 * Architecture:
 * - core/ — Pure deterministic functions (zero side effects)
 * - cache/ — In-memory caching with stats
 * - types/ — Shared types (errors, diagnostics)
 * - hooks/ — Instrumentation callbacks (optional)
 */

// Re-export everything from core (pure functions)
export * from './core';

// Re-export cache utilities
export {
    getAllCacheStats,
    memoize, Memoized, memoizeWith, NoOpCacheStore, TieredCache, type CacheOptions, type CacheSetOptions, type CacheStats, type CacheStore, type MemoizeOptions
} from './cache';

// Re-export instrumentation hooks
export {
    clearInstrumentationHooks, getInstrumentationHooks, Instrumented, isInstrumentationEnabled, setInstrumentationHooks, withInstrumentation, type CacheContext, type CallContext,
    type CallEndContext, type ErrorContext, type InstrumentationHooks
} from './hooks';

// Re-export resilience features
export {
    andThen, AssetTypeMismatchError, BatchOperationError, BudgetExceededError, CacheError, ClassificationError, classifyColumnsSafe, ConfigurationError, CpuBudgetTracker, DEFAULT_BUDGETS, formatError, getErrorContext, getUserMessage, InvalidAssetKeyError, isError, isErrorType, isLiteMetaError, isOk, LiteMetaError, mapResult, parseAssetKeySafe, unwrap,
    unwrapOr, ValidationError, withBudget, type CpuBudget,
    type Result
} from './resilience';

// Re-export batch operations
export {
    calculateOptimalChunkSize, classifyColumnsBatch, classifyColumnsBatchGrouped, classifyColumnsBatchPII, classifyColumnsBatchStats,
    classifyColumnsMulti, filterInChunks, groupByInChunks, parseAssetKeyBatch, parseAssetKeyBatchSeparate,
    parseAssetKeyBatchStats, parseAssetKeyBatchValid, processInChunks,
    processInChunksWithIndex, reduceInChunks, type BatchClassificationStats, type BatchParseStats, type ColumnClassificationResult, type ColumnInfo
} from './batch';

// Re-export shared types
export { ASSET_TYPE_PREFIXES } from './types';

