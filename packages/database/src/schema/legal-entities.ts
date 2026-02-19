import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const legalEntities = pgTable(
  'legal_entities',
  {
    ...erpEntityColumns,

    code: text('code').notNull(),
    name: text('name').notNull(),
    legalName: text('legal_name').notNull(),
    registrationNumber: text('registration_number'),
    jurisdiction: text('jurisdiction'),
    entityType: text('entity_type').notNull(),
    incorporationDate: date('incorporation_date'),
    entityData: jsonb('entity_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('legal_entities_org_id_idx').on(table.orgId, table.id),
    index('legal_entities_org_created_idx').on(table.orgId, table.createdAt),
    check('legal_entities_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type LegalEntity = typeof legalEntities.$inferSelect;
export type NewLegalEntity = typeof legalEntities.$inferInsert;
