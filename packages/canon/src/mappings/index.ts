/**
 * Mappings Barrel Export
 *
 * Source-type mappings: Postgres types, CSV type inference, type compatibility matrix
 */

// Postgres Types
export {
    CONFIDENCE_SEMANTICS, mapPostgresColumn, mapPostgresType, normalizePgType, POSTGRES_TO_CANON, type MapPostgresColumnInput,
    type MapPostgresColumnOutput
} from './postgres-types';

// Type Compatibility
export {
    getCompatLevel,
    isCompatible,
    requiresTransform, TYPE_COMPAT_MATRIX, type CompatLevel
} from './type-compat';

// CSV Type Inference
export { inferCsvColumnType } from './csv-types';

// Reason Codes
export { buildReasonCodes, type MappingReasonCode, type PrimaryReasonCode } from './reason-codes';

// Warnings
export type { MappingWarning } from './warnings';

// Cache
export {
    clearGlobalCache, createMappingContext, encodeCacheKey, getCachedMapping,
    setCachedMapping, withMappingContext, type CachedMapping
} from './cache';

// Telemetry
export {
    recordMappingEvent, setMappingTelemetry, type MappingTelemetryEvent,
    type TelemetryCallback
} from './telemetry';

// Policy
export {
    applyUnknownTypePolicy,
    DEFAULT_UNKNOWN_TYPE_POLICY, type PolicyMappingResult, type UnknownTypePolicy
} from './policy';

// Registry
export {
    createTypeMappingRegistry, ScopedTypeMappingRegistry, type CustomTypeMapping,
    type MappingSource
} from './registry';

