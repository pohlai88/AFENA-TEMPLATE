import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Communications log — email, comment, note, call records attached to entities.
 * Append-only narrative trail for compliance and audit.
 * RLS org-scoped via tenantPolicy.
 *
 * Spec §5 Gap 5: communications table.
 */
export const communications = pgTable(
  'communications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    type: text('type').notNull(),
    subject: text('subject'),
    body: text('body'),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('comms_org_entity_idx').on(table.orgId, table.entityType, table.entityId),
    index('comms_org_created_idx').on(table.orgId, table.createdAt),
    check('comms_org_not_empty', sql`org_id <> ''`),
    check('comms_entity_type_not_empty', sql`entity_type <> ''`),
    check('comms_type_valid', sql`type IN ('email', 'comment', 'note', 'call')`),
    tenantPolicy(table),
  ],
);

export type Communication = typeof communications.$inferSelect;
export type NewCommunication = typeof communications.$inferInsert;
