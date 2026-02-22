import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const cropPlans = pgTable(
  'crop_plans',
  {
    ...erpEntityColumns,

    code: text('code').notNull(),
    name: text('name').notNull(),
    season: text('season').notNull(),
    cropType: text('crop_type').notNull(),
    plantingDate: date('planting_date'),
    harvestDate: date('harvest_date'),
    area: numeric('area', { precision: 18, scale: 2 }),
    planDetails: jsonb('plan_details').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('crop_plans_org_id_idx').on(table.orgId, table.id),
    index('crop_plans_org_created_idx').on(table.orgId, table.createdAt),
    check('crop_plans_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type CropPlan = typeof cropPlans.$inferSelect;
export type NewCropPlan = typeof cropPlans.$inferInsert;
