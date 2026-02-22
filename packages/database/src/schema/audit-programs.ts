import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const auditPrograms = pgTable(
  'audit_programs',
  {
    ...erpEntityColumns,

    programCode: text('program_code').notNull(),
    name: text('name').notNull(),
    auditType: text('audit_type').notNull(),
    frequency: text('frequency'),
    scope: text('scope'),
    leadAuditor: text('lead_auditor'),
    status: text('status').notNull().default('planned'),
    programData: jsonb('program_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('audit_programs_org_id_idx').on(table.orgId, table.id),
    index('audit_programs_org_created_idx').on(table.orgId, table.createdAt),
    check('audit_programs_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type AuditProgram = typeof auditPrograms.$inferSelect;
export type NewAuditProgram = typeof auditPrograms.$inferInsert;
