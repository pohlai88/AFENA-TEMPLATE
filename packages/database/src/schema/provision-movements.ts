/**
 * Provision Movements Table
 *
 * Movement journal for provisions (IAS 37).
 * Tracks increases, utilizations, reversals, and discount unwinding.
 * Each movement adjusts the provision balance.
 * IFRS P2 table — Phase 3, step 16.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const provisionMovements = pgTable(
  'provision_movements',
  {
    ...erpEntityColumns,

    /** FK to provisions */
    provisionId: uuid('provision_id').notNull(),
    /** Movement type: 'initial', 'increase', 'utilization', 'reversal', 'unwinding', 'revaluation' */
    movementType: text('movement_type').notNull(),
    /** Movement amount in minor units (positive = increase, negative = decrease) */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Movement date */
    movementDate: date('movement_date').notNull(),
    /** Fiscal period this movement belongs to */
    periodKey: text('period_key'),
    /** FK to the journal entry recording this movement */
    journalEntryId: uuid('journal_entry_id'),
    /** Reason / description */
    reason: text('reason'),
  },
  (table) => [
    tenantPk(table),
    index('pmov_org_id_idx').on(table.orgId, table.id),
    index('pmov_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by provision
    index('pmov_provision_idx').on(table.orgId, table.provisionId),
    // Lookup by date (for period-end reporting)
    index('pmov_date_idx').on(table.orgId, table.movementDate),
    check('pmov_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'pmov_valid_type',
      sql`movement_type IN ('initial', 'increase', 'utilization', 'reversal', 'unwinding', 'revaluation')`,
    ),

    tenantPolicy(table),
  ],
);

export type ProvisionMovement = typeof provisionMovements.$inferSelect;
export type NewProvisionMovement = typeof provisionMovements.$inferInsert;
