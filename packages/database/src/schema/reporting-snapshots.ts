import { sql } from 'drizzle-orm';
import { bigint, check, date, foreignKey, index, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Reporting snapshots — point-in-time financial state captures.
 *
 * RULE C-01: Reporting snapshots are LEGAL-scoped (company financial reports).
 * PRD Phase D #18.5 + G0.10:
 * - Captured at period close for reproducible historical financials
 * - snapshot_type: trial_balance, balance_sheet, income_statement, aging
 * - data stored as JSONB (flexible for different report structures)
 * - Append-only: snapshots are evidence, never modified
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const reportingSnapshots = pgTable(
  'reporting_snapshots',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    fiscalPeriodId: uuid('fiscal_period_id').notNull(),
    snapshotType: text('snapshot_type').notNull(),
    snapshotDate: date('snapshot_date').notNull(),
    capturedAt: timestamp('captured_at', { withTimezone: true }).notNull().defaultNow(),
    capturedBy: text('captured_by').notNull(),
    data: jsonb('data').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    totalDebitMinor: bigint('total_debit_minor', { mode: 'number' }),
    totalCreditMinor: bigint('total_credit_minor', { mode: 'number' }),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'reporting_snapshots_company_fk',
    }),
    index('rpt_snap_org_id_idx').on(table.orgId, table.id),
    index('rpt_snap_company_idx').on(table.orgId, table.companyId),
    index('rpt_snap_period_idx').on(table.orgId, table.fiscalPeriodId),
    uniqueIndex('rpt_snap_company_period_type_uniq').on(
      table.orgId,
      table.companyId,
      table.fiscalPeriodId,
      table.snapshotType,
    ),
    check('rpt_snap_org_not_empty', sql`org_id <> ''`),
    check('rpt_snap_type_valid', sql`snapshot_type IN ('trial_balance', 'balance_sheet', 'income_statement', 'aging_ar', 'aging_ap', 'inventory_valuation')`),
    tenantPolicy(table),
  ],
);

export type ReportingSnapshot = typeof reportingSnapshots.$inferSelect;
export type NewReportingSnapshot = typeof reportingSnapshots.$inferInsert;
