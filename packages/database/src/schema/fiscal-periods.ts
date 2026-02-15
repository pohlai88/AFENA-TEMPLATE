import { sql } from 'drizzle-orm';
import { check, date, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Fiscal periods — gates posting into accounting periods.
 *
 * RULE C-01: Fiscal periods are LEGAL-scoped (company-specific financial calendar).
 * PRD Phase B #6:
 * - status: 'open' (accepts postings), 'closing' (soft lock), 'closed' (hard lock)
 * - DB-enforced: journal_lines + source doc posting reject inserts into closed periods
 * - Period close is a mutate() action (audited, authorized, versioned)
 * - UNIQUE(org_id, company_id, start_date) prevents overlapping periods
 * - start_date/end_date are DATE (not timestamptz) — timezone conversion at query time
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const fiscalPeriods = pgTable(
  'fiscal_periods',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    periodName: text('period_name').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: text('status').notNull().default('open'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'fiscal_periods_company_fk',
    }),
    index('fiscal_periods_org_id_idx').on(table.orgId, table.id),
    index('fiscal_periods_org_company_idx').on(table.orgId, table.companyId),
    index('fiscal_periods_lookup_idx').on(table.orgId, table.companyId, table.startDate, table.endDate),
    uniqueIndex('fiscal_periods_org_company_start_uniq').on(
      table.orgId,
      table.companyId,
      table.startDate,
    ),
    check('fiscal_periods_org_not_empty', sql`org_id <> ''`),
    check('fiscal_periods_status_valid', sql`status IN ('open', 'closing', 'closed')`),
    check('fiscal_periods_date_order', sql`start_date <= end_date`),
    tenantPolicy(table),
  ],
);

export type FiscalPeriod = typeof fiscalPeriods.$inferSelect;
export type NewFiscalPeriod = typeof fiscalPeriods.$inferInsert;
