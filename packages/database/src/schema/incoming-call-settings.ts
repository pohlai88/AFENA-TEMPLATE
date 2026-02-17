import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Incoming Call Settings — telephony configuration for incoming calls.
 * Source: incoming-call-settings.spec.json (adopted from ERPNext Incoming Call Settings).
 * Singleton config entity for call handling configuration.
 */
export const incomingCallSettings = pgTable(
  'incoming_call_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('incoming_call_settings_org_singleton').on(table.orgId),
    index('incoming_call_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('incoming_call_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type IncomingCallSettings = typeof incomingCallSettings.$inferSelect;
export type NewIncomingCallSettings = typeof incomingCallSettings.$inferInsert;
