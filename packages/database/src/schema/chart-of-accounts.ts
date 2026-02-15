import { sql } from 'drizzle-orm';
import { boolean, check, foreignKey, index, integer, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Chart of Accounts — the account tree for double-entry bookkeeping.
 *
 * RULE C-01: Chart of Accounts is LEGAL-scoped (legal entity = accounting entity).
 * PRD Phase B #7:
 * - account_type CHECK: asset, liability, equity, revenue, expense
 * - is_group: true = summary account (cannot post to), false = leaf (postable)
 * - parent_id: self-referencing FK for account hierarchy
 * - UNIQUE(org_id, company_id, account_code) — codes unique per company
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const chartOfAccounts = pgTable(
  'chart_of_accounts',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    accountCode: text('account_code').notNull(),
    accountName: text('account_name').notNull(),
    accountType: text('account_type').notNull(),
    parentId: uuid('parent_id'),
    isGroup: boolean('is_group').notNull().default(false),
    level: integer('level').notNull().default(0),
    currencyCode: text('currency_code'),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'chart_of_accounts_company_fk',
    }),
    index('coa_org_id_idx').on(table.orgId, table.id),
    index('coa_org_company_idx').on(table.orgId, table.companyId),
    index('coa_org_company_type_idx').on(table.orgId, table.companyId, table.accountType),
    uniqueIndex('coa_org_company_code_uniq').on(
      table.orgId,
      table.companyId,
      table.accountCode,
    ),
    check('coa_org_not_empty', sql`org_id <> ''`),
    check('coa_account_type_valid', sql`account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')`),
    tenantPolicy(table),
  ],
);

export type ChartOfAccount = typeof chartOfAccounts.$inferSelect;
export type NewChartOfAccount = typeof chartOfAccounts.$inferInsert;
