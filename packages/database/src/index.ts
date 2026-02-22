// ============================================================================
// DATABASE SESSION (v2.6 Architecture - Single Entrypoint)
// ============================================================================
// ✅ NEW: Use DbSession for all database access
export { createDbSession, createWorkerSession, isDbSession } from './db-session';
export type { AuthContext, DbOrTransaction, DbSession, DbTransaction, QueryShapeKey, TransactionOptions } from './types/session';

// Auth context helpers
export { setAuthContext, validateAuthContext, withAuthContext } from './auth-context';

// Query monitoring and observability
export { getQueryShapeStats, queryMonitor, runQuery } from './observability/query-monitor';
export { QUERY_SHAPES, getHotPathShapes, getQueryShape, isValidShapeKey } from './observability/query-shapes';
export type { QueryShape } from './observability/query-shapes';

// ============================================================================
// DEPRECATED: Direct Database Access
// ============================================================================
// ⚠️ DEPRECATED: Direct db/dbRo access will be removed in v3.0.0
// Use createDbSession() instead for proper auth context and read routing
// 
// Migration guide:
// Before: const data = await db.select().from(table);
// After:  const session = createDbSession({ orgId, userId });
//         const data = await session.ro(tx => tx.select().from(table));
//
// These exports are maintained for backward compatibility only.
// They will be removed in the next major version.
/**
 * @deprecated Use createDbSession() instead. Direct db access will be removed in v3.0.0
 */
export { db, dbRo, getDb } from './db';
/**
 * @deprecated Import from 'drizzle-orm' directly instead
 */
export type { DbInstance } from './db';

// ============================================================================
// SCHEMA EXPORTS (No Changes)
// ============================================================================
export * from './schema/index';

// Table Registry (v2.6 - Schema Taxonomy)
export {
    TABLE_REGISTRY,
    TAXONOMY_RULES, getTableMetadata,
    getTablesByKind, validateRegistry, validateTableMetadata, type TableKind,
    type TableMetadata
} from './schema/_registry';

// DDL Helpers (v2.6 - Safe DDL Generation)
export {
    columnList,
    isValidIdentifier, qIdent, qIdents, qSchemaIdent, sanitizeIdent
} from './ddl/ident';

export {
    customPolicySql, dropPolicySql, enableRlsSql, evidenceRlsSetup,
    projectionRlsSetup, rolePolicySql, standardRlsSetup, tenantPolicySql, validatePolicyClause, workerBypassPolicySql
} from './ddl/rls';

// Query Plan Analyzer (v2.6 - PLAN-01 Gate)
export {
    formatValidationResult, validateQueryPlan, type PlanIssue, type PlanNode, type PlanValidationResult, type QueryPlan
} from './query-plan/analyzer';

// ============================================================================
// HELPER EXPORTS
// ============================================================================

// Column helpers (spread into pgTable)
export { baseEntityColumns } from './helpers/base-entity';
export { docEntityColumns } from './helpers/doc-entity';
export { docStatusEnum } from './helpers/doc-status';
export { erpEntityColumns } from './helpers/erp-entity';
export {
    addressJsonb, baseAmountMinor, companyRef, contactRef, currencyCode, currencyCodeStrict, docNumber, emailColumn, fxRate, moneyMinor, phoneColumn, qty, siteRef, statusColumn, tagsArray, uomRef
} from './helpers/field-types';

// Tenant isolation helpers
export { tenantFk, tenantFkIndex, tenantFkPattern, tenantPk } from './helpers/tenant-pk';
export { ownerPolicy, tenantPolicy } from './helpers/tenant-policy';

// Standard index helpers (PK + indexes + CHECK + RLS in one call)
export { docIndexes, erpIndexes } from './helpers/standard-indexes';

// ── DB Retry Utilities (Phase 3) ─────────────────────────
export { getDbTimeoutCode, isDbTimeoutError, withDbRetry } from './helpers/db-retry';

// ── Schema-Derived Allowlist Helper (Phase 3) ────────────
export { getWritableColumnNames, pickWritable } from './helpers/pick-writable';

// ── Batch Query Helper (Phase 3) ─────────────────────────
export { batch } from './helpers/batch';

// ── Entity Registry API (Phase 3) ────────────────────────
export { ENTITY_TABLE_MAP, getTableForEntityType, isKnownEntityType, listEntityTypes } from './registry-api';

// ============================================================================
// DRIZZLE OPERATORS (Deprecated - Import from drizzle-orm directly)
// ============================================================================
/**
 * @deprecated Import from 'drizzle-orm' directly instead of re-exporting from database package
 * This re-export will be removed in v3.0.0
 */
export { and, asc, desc, eq, ilike, inArray, isNotNull, isNull, like, notInArray, or, sql } from 'drizzle-orm';

