import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { advisories } from './advisories';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

/**
 * Advisory evidence — append-only ledger of data that produced an advisory.
 * INVARIANT-P02: No UPDATE, no DELETE. Ever.
 *
 * org_id is duplicated from parent advisory for simple RLS (no join inheritance).
 * Optional DB trigger validates org_id consistency with parent advisory.
 */
export const advisoryEvidence = pgTable(
  'advisory_evidence',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    advisoryId: uuid('advisory_id')
      .notNull(),
    evidenceType: text('evidence_type').notNull(),
    source: text('source').notNull(),
    payload: jsonb('payload').notNull(),
    hash: text('hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'advisory', table.advisoryId, advisories),
    tenantFkIndex(table, 'advisory', table.advisoryId),
    // CHECK constraints
    check('advisory_evidence_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('advisory_evidence_type_enum', sql`evidence_type IN ('query','snapshot','metric_series','calculation')`),

    // Indexes
    index('advisory_evidence_advisory_idx').on(table.advisoryId),
    index('advisory_evidence_org_created_idx').on(table.orgId, table.createdAt),

    // RLS: SELECT + INSERT only (INVARIANT-P02: append-only)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      modify: sql`(select auth.org_id()::uuid = ${table.orgId})`,
    }),
  ]
);

export type AdvisoryEvidence = typeof advisoryEvidence.$inferSelect;
export type NewAdvisoryEvidence = typeof advisoryEvidence.$inferInsert;
