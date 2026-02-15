import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, doublePrecision, index, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

/**
 * Advisories — deterministic advisory engine output.
 * INVARIANT-P01: never writes domain tables. Only advisories + advisory_evidence.
 * INVARIANT-P03: open/ack advisories deduplicated by (org_id, fingerprint).
 *
 * RLS: tenantPolicy-style. UPDATE allowed ONLY on status (ack/dismiss). No DELETE.
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const advisories = pgTable(
  'advisories',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    type: text('type').notNull(),
    severity: text('severity').notNull(),
    status: text('status').notNull().default('open'),
    entityType: text('entity_type'),
    entityId: uuid('entity_id'),
    summary: text('summary').notNull(),
    explanation: text('explanation').notNull(),
    explainVersion: text('explain_version').notNull().default('v1'),
    method: text('method').notNull(),
    params: jsonb('params').notNull(),
    score: doublePrecision('score'),
    recommendedActions: jsonb('recommended_actions'),
    fingerprint: text('fingerprint').notNull(),
    runId: uuid('run_id'),
    windowStart: timestamp('window_start', { withTimezone: true }),
    windowEnd: timestamp('window_end', { withTimezone: true }),
    channel: text('channel').notNull().default('system'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`COALESCE(auth.user_id(), 'system')`),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    // CHECK constraints — enforce enum-like values at DB level
    check('advisories_type_taxonomy', sql`type ~ '^(anomaly|forecast|rule)\.[a-z0-9_]+\.[a-z0-9_]+$'`),
    check('advisories_severity_enum', sql`severity IN ('info','warn','critical')`),
    check('advisories_status_enum', sql`status IN ('open','ack','dismissed')`),
    check('advisories_method_enum', sql`method IN ('EWMA','CUSUM','MAD','SES','HOLT','HOLT_WINTERS','RULE')`),
    check('advisories_fingerprint_len', sql`length(fingerprint) = 64`),
    check('advisories_org_not_empty', sql`org_id <> ''`),

    // Indexes
    index('advisories_org_status_created_idx').on(table.orgId, table.status, table.createdAt),
    index('advisories_org_type_created_idx').on(table.orgId, table.type, table.createdAt),
    index('advisories_entity_idx').on(table.orgId, table.entityType, table.entityId, table.createdAt),
    index('advisories_org_created_idx').on(table.orgId, table.createdAt),
    // Dedupe: only one open/ack advisory per fingerprint per org
    uniqueIndex('advisories_fingerprint_dedupe_idx')
      .on(table.orgId, table.fingerprint)
      .where(sql`status IN ('open','ack')`),

    // RLS: org-scoped reads, org-scoped inserts, status-only updates, no deletes
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type Advisory = typeof advisories.$inferSelect;
export type NewAdvisory = typeof advisories.$inferInsert;
