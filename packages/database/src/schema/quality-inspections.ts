import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const qualityInspections = pgTable(
  'quality_inspections',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    inspectionNumber: text('inspection_number'),
    inspectionType: text('inspection_type').notNull(),
    inspectionDate: date('inspection_date'),
    inspector: text('inspector'),
    result: text('result'),
    inspectionData: jsonb('inspection_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('quality_inspections_org_id_idx').on(table.orgId, table.id),
    index('quality_inspections_org_created_idx').on(table.orgId, table.createdAt),
    check('quality_inspections_org_not_empty', sql`org_id <> ''`),
    check('quality_inspections_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type QualityInspection = typeof qualityInspections.$inferSelect;
export type NewQualityInspection = typeof qualityInspections.$inferInsert;
