import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const numberSequences = pgTable(
  'number_sequences',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    companyId: uuid('company_id'),
    entityType: text('entity_type').notNull(),
    prefix: text('prefix').notNull().default(''),
    suffix: text('suffix').notNull().default(''),
    nextValue: integer('next_value').notNull().default(1),
    padLength: integer('pad_length').notNull().default(5),
    fiscalYear: integer('fiscal_year'),
  },
  (table) => [
    tenantPk(table),
    index('number_sequences_org_id_idx').on(table.orgId, table.id),
    check('number_sequences_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
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
