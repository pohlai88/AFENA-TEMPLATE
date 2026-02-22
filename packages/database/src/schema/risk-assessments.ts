import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const riskAssessments = pgTable(
  'risk_assessments',
  {
    ...erpEntityColumns,

    riskId: text('risk_id').notNull(),
    title: text('title').notNull(),
    category: text('category').notNull(),
    likelihood: text('likelihood'),
    impact: text('impact'),
    riskScore: integer('risk_score'),
    owner: text('owner'),
    status: text('status').notNull().default('identified'),
    mitigationPlan: jsonb('mitigation_plan').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('risk_assessments_org_id_idx').on(table.orgId, table.id),
    index('risk_assessments_org_created_idx').on(table.orgId, table.createdAt),
    check('risk_assessments_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),

    tenantPolicy(table),
  ],
);

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type NewRiskAssessment = typeof riskAssessments.$inferInsert;
