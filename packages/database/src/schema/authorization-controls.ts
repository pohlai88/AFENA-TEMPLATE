import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Authorization Controls — document approval controls.
 * Source: authorization-controls.spec.json (adopted from ERPNext Authorization Control).
 * Master entity for workflow authorization.
 */
export const authorizationControls = pgTable(
  'authorization_controls',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('authorization_controls_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('authorization_controls_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type AuthorizationControl = typeof authorizationControls.$inferSelect;
export type NewAuthorizationControl = typeof authorizationControls.$inferInsert;
