/**
 * Accounting Events Table
 *
 * Immutable event store for the accounting hub derivation engine.
 * Each event represents a business occurrence (e.g., invoice posted,
 * payment received) that will be derived into journal entries.
 *
 * eventId = SHA-256 hash of the business payload (identity hash).
 * Events are append-only; corrections create new events with references.
 * Accounting Hub spine table — Phase 3, step 12.
 */
import { sql } from 'drizzle-orm';
import {
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

export const acctEvents = pgTable(
  'acct_events',
  {
    ...erpEntityColumns,

    /** SHA-256 hash of the business payload — canonical identity */
    eventId: text('event_id').notNull(),
    /** Event type (e.g., 'invoice.posted', 'payment.received', 'asset.depreciated') */
    eventType: text('event_type').notNull(),
    /** Schema version of the payload (for forward compatibility) */
    schemaVersion: integer('schema_version').notNull().default(1),
    /** Source package that emitted the event (e.g., 'payables', 'receivables') */
    sourcePackage: text('source_package').notNull(),
    /** Source document ID */
    sourceDocumentId: uuid('source_document_id'),
    /** Source document type */
    sourceDocumentType: text('source_document_type'),
    /** Business effective date of the event */
    effectiveAt: timestamp('effective_at', { withTimezone: true }).notNull(),
    /** Full event payload (JSON) — basis for eventId hash */
    payload: jsonb('payload').notNull(),
    /** Currency code of the source transaction */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** ID of the event this corrects (null if original) */
    correctsEventId: text('corrects_event_id'),
  },
  (table) => [
    tenantPk(table),
    index('ae_org_id_idx').on(table.orgId, table.id),
    index('ae_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by event hash
    uniqueIndex('ae_event_id_idx').on(table.orgId, table.eventId),
    // Lookup by source document
    index('ae_source_doc_idx').on(table.orgId, table.sourcePackage, table.sourceDocumentId),
    // Lookup by event type + effective date
    index('ae_type_effective_idx').on(table.orgId, table.eventType, table.effectiveAt),
    // Lookup by company + effective date (for period-based derivation)
    index('ae_company_effective_idx').on(table.orgId, table.companyId, table.effectiveAt),
    check('ae_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('ae_event_id_not_empty', sql`event_id <> ''`),

    tenantPolicy(table),
  ],
);

export type AcctEvent = typeof acctEvents.$inferSelect;
export type NewAcctEvent = typeof acctEvents.$inferInsert;
