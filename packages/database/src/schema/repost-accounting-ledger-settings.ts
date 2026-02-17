import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Repost Accounting Ledger Settings — configuration for accounting ledger reposting.
 * Source: repost-accounting-ledger-settings.spec.json (adopted from ERPNext Repost Accounting Ledger Settings).
 * Singleton config entity for ledger reposting rules.
 */
export const repostAccountingLedgerSettings = pgTable(
  'repost_accounting_ledger_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('repost_accounting_ledger_settings_org_singleton').on(table.orgId),
    index('repost_accounting_ledger_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('repost_accounting_ledger_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type RepostAccountingLedgerSettings = typeof repostAccountingLedgerSettings.$inferSelect;
export type NewRepostAccountingLedgerSettings = typeof repostAccountingLedgerSettings.$inferInsert;
