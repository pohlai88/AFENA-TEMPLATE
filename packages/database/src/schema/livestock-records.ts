import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const livestockRecords = pgTable(
  'livestock_records',
  {
    ...erpEntityColumns,

    animalId: text('animal_id').notNull(),
    species: text('species').notNull(),
    breed: text('breed'),
    birthDate: date('birth_date'),
    gender: text('gender'),
    status: text('status').notNull().default('active'),
    healthRecords: jsonb('health_records').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('livestock_records_org_id_idx').on(table.orgId, table.id),
    index('livestock_records_org_created_idx').on(table.orgId, table.createdAt),
    check('livestock_records_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type LivestockRecord = typeof livestockRecords.$inferSelect;
export type NewLivestockRecord = typeof livestockRecords.$inferInsert;
