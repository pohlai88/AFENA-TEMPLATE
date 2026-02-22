/**
 * Resilience Module
 * 
 * Provides resilience features for LiteMeta:
 * - CPU budget enforcement (hard limits)
 * - Typed error taxonomy
 * - Safe wrapper functions (Result type)
 */

// CPU Budget
export {
  CpuBudgetTracker,
  BudgetExceededError,
  withBudget,
  DEFAULT_BUDGETS,
  type CpuBudget,
} from './cpu-budget';

// Errors
export {
  LiteMetaError,
  InvalidAssetKeyError,
  AssetTypeMismatchError,
  ClassificationError,
  BatchOperationError,
  CacheError,
  ValidationError,
  ConfigurationError,
  isLiteMetaError,
  isErrorType,
  getErrorContext,
  formatError,
  getUserMessage,
} from './errors';

// Safe Wrappers
export {
  parseAssetKeySafe,
  classifyColumnsSafe,
  unwrap,
  unwrapOr,
  mapResult,
  andThen,
  isOk,
  isError,
  type Result,
} from './safe-wrappers';
