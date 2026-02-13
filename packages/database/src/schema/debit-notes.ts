import { sql } from 'drizzle-orm';
import { bigint, check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Debit notes — supplier-side correction documents (AP equivalent of credit notes).
 *
 * Audit P0-4:
 * - Referenced by credit_notes.reverses_type CHECK ('debit_note')
 * - Referenced by payment_allocations.target_type CHECK ('debit_note')
 * - Correction is ALWAYS a new document, never edits to posted docs
 * - References source doc via reverses_type + reverses_id
 * - reason_code for audit trail
 * - Uses docEntity lifecycle (draft → submitted → active → cancelled)
 */
export const debitNotes = pgTable(
  'debit_notes',
  {
    ...docEntityColumns,
    debitNoteNo: text('debit_note_no'),
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
    index('debit_notes_org_id_idx').on(table.orgId, table.id),
    index('debit_notes_org_company_idx').on(table.orgId, table.companyId),
    index('debit_notes_reverses_idx').on(table.orgId, table.reversesType, table.reversesId),
    index('debit_notes_contact_idx').on(table.orgId, table.contactId),
    check('debit_notes_org_not_empty', sql`org_id <> ''`),
    check('debit_notes_reverses_type_valid', sql`reverses_type IN ('purchase_invoice', 'credit_note')`),
    check('debit_notes_amounts_non_negative', sql`subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type DebitNote = typeof debitNotes.$inferSelect;
export type NewDebitNote = typeof debitNotes.$inferInsert;
