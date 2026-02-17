import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Service Level Agreements — SLA definitions for support.
 * Source: service-level-agreements.spec.json (adopted from ERPNext Service Level Agreement).
 */
export const serviceLevelAgreements = pgTable(
  'service_level_agreements',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    enabled: boolean('enabled').default(true),
    defaultPriority: text('default_priority'),
    applySlaToPriority: text('apply_sla_to_priority'),
    condition: text('condition'),
    responseTime: integer('response_time'),
    resolutionTime: integer('resolution_time'),
  },
  (table) => [
    index('service_level_agreements_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('service_level_agreements_name_idx').on(table.orgId, table.name),
    check('service_level_agreements_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ServiceLevelAgreement = typeof serviceLevelAgreements.$inferSelect;
export type NewServiceLevelAgreement = typeof serviceLevelAgreements.$inferInsert;
