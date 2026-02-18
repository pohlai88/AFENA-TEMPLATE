/**
 * Mappings Barrel Export
 *
 * Source-type mappings: Postgres types, CSV type inference, type compatibility matrix
 */

// Postgres Types
export {
    CONFIDENCE_SEMANTICS, POSTGRES_TO_CANON, mapPostgresColumn, mapPostgresType, normalizePgType, type MapPostgresColumnInput,
    type MapPostgresColumnOutput
} from './postgres-types';

// Type Compatibility
export {
    TYPE_COMPAT_MATRIX,
    getCompatLevel,
    isCompatible,
    requiresTransform, type CompatLevel
} from './type-compat';

// CSV Type Inference
export { inferCsvColumnType } from './csv-types';
