/**
 * Schemas Barrel Export
 * 
 * Zod schemas for runtime validation and type inference.
 */

// ── Schema Utilities ────────────────────────────────────────
// Cache
export { clearSchemaCache, getSchemaCacheStats, memoizeSchema } from './cache';

// Error Codes
export { SCHEMA_ERROR_CODES, isSchemaErrorCode } from './error-codes';
export type { SchemaErrorCode } from './error-codes';

// Safe Parse
export { SchemaValidationError, parseOrThrow, safeParse } from './safe-parse';
export type { ParseResult } from './safe-parse';

// Common Fields
export { commonFields } from './fields';

// Schema Builders
export { SchemaBuilder, createSchemaBuilder } from './builders';

// ── Schema Definitions ──────────────────────────────────────
// Action Schemas
export { actionFamilySchema, actionTypeSchema } from './action';

// Branded ID Schemas (Phase 1)
export {
    auditLogIdSchema, batchIdSchema, entityIdSchema, mutationIdSchema, orgIdSchema,
    userIdSchema
} from './branded';

// Data Type Schemas
export { TYPE_CONFIG_SCHEMAS, getTypeConfigSchema, validateTypeConfig } from './data-types';
export type { TypeConfigSchemas } from './data-types';

// Entity Schema
export { entityRefSchema, entityTypeSchema } from './entity';

// Envelope Schema
export { apiResponseSchema } from './envelope';

// Error Schemas
export { errorCodeSchema, kernelErrorSchema } from './errors';

// Schema Helpers (Phase 1)
export {
    createEnumSchema, primitives, withMeta
} from './helpers';

// JSON Value Schema
export { jsonValueSchema } from './json-value';

// LiteMetadata Schemas (Zod v4)
export {
    assetDescriptorSchema, assetKeyInputSchema, assetKeySchema, parsedAssetKeySchema,
    qualityDimensionSchema,
    qualityRuleSchema,
    qualityRuleTypeSchema
} from './lite-meta';

// Mutation Schema
export { mutationSpecSchema } from './mutation';

// Audit Schema
export { auditLogEntrySchema } from './audit';

// Receipt Schema
export { mutationReceiptSchema, receiptSchema, receiptStatusSchema, retryableReasonSchema } from './receipt';

// Capability Schemas
export {
    capabilityDescriptorSchema, capabilityDomainSchema, capabilityExceptionSchema,
    capabilityExceptionsFileSchema, capabilityKindSchema, capabilityNamespaceSchema,
    capabilityRiskSchema, capabilityScopeSchema, capabilityStatusSchema,
    exceptionScopeSchema, rbacScopeSchema, rbacTierSchema
} from './capability';
export type { CapabilityException, ExceptionScope } from './capability';

// ── Schema Catalog (Phase 3) ────────────────────────────────
// Frozen catalog and discovery API
export {
    CANON_SCHEMAS, CANON_SCHEMA_BY_CATEGORY,
    CANON_SCHEMA_MAP
} from './catalog';

export {
    findSchemas,
    getSchema, getSchemaMeta, getSchemasByCategory, hasSchema,
    listSchemas
} from './catalog/discovery';

export {
    extractOpenApiSeeds,
    getOpenApiSeed
} from './catalog/openapi';

export type { OpenApiSchemaSeed } from './catalog/openapi';
export type {
    CanonSchemaItem,
    OpenApiSeed,
    SchemaCategory,
    SchemaFilters,
    SchemaId,
    SchemaMeta,
    SchemaTag
} from './catalog/types';

