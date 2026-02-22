import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const jobApplications = pgTable(
  'job_applications',
  {
    ...erpEntityColumns,

    applicantName: text('applicant_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    position: text('position').notNull(),
    status: text('status').notNull().default('received'),
    resumeUrl: text('resume_url'),
    applicationData: jsonb('application_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('job_applications_org_id_idx').on(table.orgId, table.id),
    index('job_applications_org_created_idx').on(table.orgId, table.createdAt),
    check('job_applications_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
