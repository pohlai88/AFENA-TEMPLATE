/**
 * Accounting Derived Entries Table
 *
 * Journal entries derived by the accounting hub from accounting events.
 * Each derived entry is linked to its source event + mapping version.
 * derivationId = SHA-256(eventId + mappingVersion + inputsHash) — deterministic replay.
 *
 * Re-derivation with the same inputs MUST produce the same derivationId.
 * Accounting Hub spine table — Phase 3, step 12.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
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

export const acctDerivedEntries = pgTable(
  'acct_derived_entries',
  {
    ...erpEntityColumns,

    /** SHA-256(eventId + mappingVersion + inputsHash) — deterministic derivation ID */
    derivationId: text('derivation_id').notNull(),
    /** FK to acct_events (source event) */
    eventId: text('event_id').notNull(),
    /** FK to acct_mapping_versions (rules used) */
    mappingVersionId: uuid('mapping_version_id').notNull(),
    /** Version number of the mapping used */
    mappingVersionNumber: integer('mapping_version_number').notNull(),
    /** FK to journal_entries (the resulting GL posting) */
    journalEntryId: uuid('journal_entry_id'),
    /** Derivation status: 'pending', 'committed', 'failed', 'superseded' */
    status: text('status').notNull().default('pending'),
    /** When the derivation was committed to GL */
    committedAt: timestamp('committed_at', { withTimezone: true }),
    /** Debit total in minor units */
    totalDebitMinor: bigint('total_debit_minor', { mode: 'number' }).notNull().default(0),
    /** Credit total in minor units */
    totalCreditMinor: bigint('total_credit_minor', { mode: 'number' }).notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** The derived line items as structured JSON */
    derivedLines: jsonb('derived_lines').notNull(),
    /** Error details if derivation failed */
    errorDetails: text('error_details'),
  },
  (table) => [
    tenantPk(table),
    index('ade_org_id_idx').on(table.orgId, table.id),
    index('ade_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by derivation hash
    uniqueIndex('ade_derivation_id_idx').on(table.orgId, table.derivationId),
    // Lookup by source event
    index('ade_event_id_idx').on(table.orgId, table.eventId),
    // Lookup by journal entry (reverse lookup)
    index('ade_journal_idx').on(table.orgId, table.journalEntryId),
    // Lookup by status (find pending derivations)
    index('ade_status_idx').on(table.orgId, table.status),
    check('ade_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('ade_derivation_id_not_empty', sql`derivation_id <> ''`),
    check('ade_valid_status', sql`status IN ('pending', 'committed', 'failed', 'superseded')`),
    check('ade_balance', sql`total_debit_minor = total_credit_minor`),

    tenantPolicy(table),
  ],
);

export type AcctDerivedEntry = typeof acctDerivedEntries.$inferSelect;
export type NewAcctDerivedEntry = typeof acctDerivedEntries.$inferInsert;
