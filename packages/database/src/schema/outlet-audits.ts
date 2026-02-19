import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const outletAudits = pgTable(
  'outlet_audits',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    auditNumber: text('audit_number'),
    outletId: uuid('outlet_id').notNull(),
    auditDate: date('audit_date'),
    auditor: text('auditor'),
    score: integer('score'),
    findings: jsonb('findings').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('outlet_audits_org_id_idx').on(table.orgId, table.id),
    index('outlet_audits_org_created_idx').on(table.orgId, table.createdAt),
    check('outlet_audits_org_not_empty', sql`org_id <> ''`),
    check('outlet_audits_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type OutletAudit = typeof outletAudits.$inferSelect;
export type NewOutletAudit = typeof outletAudits.$inferInsert;
