/**
 * WHT Codes Table
 *
 * Withholding tax code definitions by jurisdiction.
 * Each code maps to a tax rate schedule and GL accounts
 * for withholding and remittance.
 * Withholding Tax spine table — Phase 3, step 15.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const whtCodes = pgTable(
  'wht_codes',
  {
    ...erpEntityColumns,

    /** WHT code (e.g., 'MY-S109', 'MY-S4A', 'SG-S45') */
    whtCode: text('wht_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Jurisdiction / country code (ISO 3166-1 alpha-2) */
    jurisdiction: text('jurisdiction').notNull(),
    /** Income type / category (e.g., 'royalties', 'interest', 'technical-fees') */
    incomeType: text('income_type').notNull(),
    /** GL account for WHT payable */
    whtPayableAccountId: uuid('wht_payable_account_id'),
    /** GL account for WHT expense */
    whtExpenseAccountId: uuid('wht_expense_account_id'),
    /** Whether this code is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('wc_org_id_idx').on(table.orgId, table.id),
    index('wc_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by jurisdiction + income type
    index('wc_jurisdiction_idx').on(table.orgId, table.jurisdiction, table.incomeType),
    // Unique code per company
    uniqueIndex('wc_unique_code_idx').on(table.orgId, table.companyId, table.whtCode),
    check('wc_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type WhtCode = typeof whtCodes.$inferSelect;
export type NewWhtCode = typeof whtCodes.$inferInsert;
