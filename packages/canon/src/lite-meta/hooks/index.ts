/**
 * Instrumentation Hooks Module
 * 
 * Lightweight callback-based instrumentation with zero overhead when disabled.
 */

export {
  setInstrumentationHooks,
  getInstrumentationHooks,
  clearInstrumentationHooks,
  isInstrumentationEnabled,
  emitCallStart,
  emitCallEnd,
  emitError,
  emitCacheHit,
  emitCacheMiss,
  emitCacheSet,
  emitCacheEvict,
  emitCacheClear,
  Instrumented,
  withInstrumentation,
  type InstrumentationHooks,
  type CallContext,
  type CallEndContext,
  type CacheContext,
  type ErrorContext,
} from './instrumentation';
