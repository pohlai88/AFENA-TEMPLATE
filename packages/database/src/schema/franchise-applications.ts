import { sql } from 'drizzle-orm';
import { check, index, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const franchiseApplications = pgTable(
  'franchise_applications',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    applicationNumber: text('application_number'),
    applicantName: text('applicant_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    territory: text('territory'),
    investmentCapacity: numeric('investment_capacity', { precision: 18, scale: 2 }),
    applicationData: jsonb('application_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('franchise_applications_org_id_idx').on(table.orgId, table.id),
    index('franchise_applications_org_created_idx').on(table.orgId, table.createdAt),
    check('franchise_applications_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('franchise_applications_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type FranchiseApplication = typeof franchiseApplications.$inferSelect;
export type NewFranchiseApplication = typeof franchiseApplications.$inferInsert;
