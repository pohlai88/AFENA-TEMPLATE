import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const performanceReviews = pgTable(
  'performance_reviews',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    employeeId: uuid('employee_id').notNull(),
    reviewPeriod: text('review_period').notNull(),
    reviewDate: date('review_date'),
    reviewer: text('reviewer'),
    overallRating: integer('overall_rating'),
    reviewData: jsonb('review_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('performance_reviews_org_id_idx').on(table.orgId, table.id),
    index('performance_reviews_org_created_idx').on(table.orgId, table.createdAt),
    check('performance_reviews_org_not_empty', sql`org_id <> ''`),
    check('performance_reviews_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type NewPerformanceReview = typeof performanceReviews.$inferInsert;
