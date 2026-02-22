/**
 * Accounting Mappings Table
 *
 * Master record for accounting mapping rule sets.
 * Each mapping defines a set of rules that transform accounting events
 * into journal entries (the "derivation recipe").
 * Accounting Hub spine table — Phase 3, step 12.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const acctMappings = pgTable(
  'acct_mappings',
  {
    ...erpEntityColumns,

    /** Mapping code (e.g., 'AP-STANDARD', 'AR-REVENUE', 'FA-DEPRECIATION') */
    mappingCode: text('mapping_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Event type this mapping applies to */
    eventType: text('event_type').notNull(),
    /** Whether this mapping is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('am_org_id_idx').on(table.orgId, table.id),
    index('am_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by event type
    index('am_event_type_idx').on(table.orgId, table.eventType),
    // Unique mapping code per company
    uniqueIndex('am_unique_code_idx').on(table.orgId, table.companyId, table.mappingCode),
    check('am_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type AcctMapping = typeof acctMappings.$inferSelect;
export type NewAcctMapping = typeof acctMappings.$inferInsert;
