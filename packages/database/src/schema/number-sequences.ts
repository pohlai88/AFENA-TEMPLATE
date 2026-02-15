import { sql } from 'drizzle-orm';
import { check, foreignKey, index, integer, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Number sequences — document numbering per company/entity.
 * 
 * RULE C-01: Number sequences are ISSUER-scoped.
 * - company_id NOT NULL for document sequences (legal entity issues docs)
 * - For org-wide sequences, create separate table or use nullable overlay
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const numberSequences = pgTable(
  'number_sequences',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    companyId: uuid('company_id').notNull(),
    entityType: text('entity_type').notNull(),
    prefix: text('prefix').notNull().default(''),
    suffix: text('suffix').notNull().default(''),
    nextValue: integer('next_value').notNull().default(1),
    padLength: integer('pad_length').notNull().default(5),
    fiscalYear: integer('fiscal_year'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'number_sequences_company_fk',
    }),
    index('number_sequences_org_id_idx').on(table.orgId, table.id),
    index('number_sequences_org_company_idx').on(table.orgId, table.companyId),
    check('number_sequences_org_not_empty', sql`org_id <> ''`),
    uniqueIndex('number_sequences_org_company_entity_fy_uniq').on(
      table.orgId,
      table.companyId,
      table.entityType,
      table.fiscalYear,
    ),
    tenantPolicy(table),
  ],
);

export type NumberSequence = typeof numberSequences.$inferSelect;
export type NewNumberSequence = typeof numberSequences.$inferInsert;
