import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Credit notes — correction documents that reverse/reduce invoice amounts.
 *
 * RULE C-01: Credit notes are ISSUER-scoped (company issues credit notes).
 * PRD G0.11 + Phase B #9.5:
 * - Correction is ALWAYS a new document, never edits to posted docs
 * - References source doc via reversesType + reversesId
 * - reason_code for audit trail
 * - Journalization creates reversal entries, not updates
 * - Uses docEntity lifecycle (draft → submitted → active → cancelled)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const creditNotes = pgTable(
  'credit_notes',
  {
    ...docEntityColumns,
    creditNoteNo: text('credit_note_no'),
    reversesType: text('reverses_type').notNull(),
    reversesId: uuid('reverses_id').notNull(),
    reasonCode: text('reason_code').notNull(),
    reasonDescription: text('reason_description'),
    contactId: uuid('contact_id'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    subtotalMinor: bigint('subtotal_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    baseSubtotalMinor: bigint('base_subtotal_minor', { mode: 'number' }).notNull().default(0),
    baseTaxMinor: bigint('base_tax_minor', { mode: 'number' }).notNull().default(0),
    baseTotalMinor: bigint('base_total_minor', { mode: 'number' }).notNull().default(0),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    journalEntryId: uuid('journal_entry_id'),
    memo: text('memo'),
    tags: jsonb('tags').default(sql`'[]'::jsonb`),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'credit_notes_company_fk',
    }),
    index('credit_notes_org_id_idx').on(table.orgId, table.id),
    index('credit_notes_org_company_idx').on(table.orgId, table.companyId),
    index('credit_notes_reverses_idx').on(table.orgId, table.reversesType, table.reversesId),
    index('credit_notes_contact_idx').on(table.orgId, table.contactId),
    check('credit_notes_org_not_empty', sql`org_id <> ''`),
    check('credit_notes_reverses_type_valid', sql`reverses_type IN ('invoice', 'debit_note')`),
    check('credit_notes_amounts_non_negative', sql`subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type CreditNote = typeof creditNotes.$inferSelect;
export type NewCreditNote = typeof creditNotes.$inferInsert;
