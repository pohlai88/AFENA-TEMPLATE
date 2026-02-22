/**
 * Accounting Mapping Versions Table
 *
 * Versioned rule sets for accounting mappings. Each version contains
 * the actual derivation rules (conditions → account assignments).
 * New versions are created on rule changes; old versions are kept
 * for audit trail and deterministic replay.
 * Accounting Hub spine table — Phase 3, step 12.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const acctMappingVersions = pgTable(
  'acct_mapping_versions',
  {
    ...erpEntityColumns,

    /** FK to acct_mappings */
    mappingId: uuid('mapping_id').notNull(),
    /** Version number (monotonically increasing per mapping) */
    versionNumber: integer('version_number').notNull(),
    /** When this version becomes effective */
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).notNull(),
    /** When this version expires (null = current) */
    effectiveTo: timestamp('effective_to', { withTimezone: true }),
    /** The derivation rules as structured JSON */
    rules: jsonb('rules').notNull(),
    /** SHA-256 hash of the rules JSON for integrity verification */
    rulesHash: text('rules_hash').notNull(),
    /** Whether this is the current active version */
    isCurrent: boolean('is_current').notNull().default(true),
    /** Who published this version */
    publishedBy: text('published_by'),
    /** When published */
    publishedAt: timestamp('published_at', { withTimezone: true }),
    /** Change notes describing what changed in this version */
    changeNotes: text('change_notes'),
  },
  (table) => [
    tenantPk(table),
    index('amv_org_id_idx').on(table.orgId, table.id),
    index('amv_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by mapping + version
    index('amv_mapping_version_idx').on(table.orgId, table.mappingId, table.versionNumber),
    // Find current version for a mapping
    index('amv_mapping_current_idx').on(table.orgId, table.mappingId, table.isCurrent),
    // Unique version number per mapping
    uniqueIndex('amv_unique_version_idx').on(table.orgId, table.mappingId, table.versionNumber),
    check('amv_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('amv_positive_version', sql`version_number > 0`),

    tenantPolicy(table),
  ],
);

export type AcctMappingVersion = typeof acctMappingVersions.$inferSelect;
export type NewAcctMappingVersion = typeof acctMappingVersions.$inferInsert;
