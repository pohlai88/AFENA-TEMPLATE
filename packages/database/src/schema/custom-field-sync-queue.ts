import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const customFieldSyncQueue = pgTable(
  'custom_field_sync_queue',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    queuedAt: timestamp('queued_at', { withTimezone: true }).defaultNow().notNull(),
    attempts: integer('attempts').notNull().default(0),
    lastError: text('last_error'),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    tenantPk(table),
    // Worker polling index (B-tree, not BRIN — retries reshuffle next_retry_at)
    index('custom_field_sync_queue_pending_retry_idx').on(table.nextRetryAt),
    check('custom_field_sync_queue_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type CustomFieldSyncQueueRow = typeof customFieldSyncQueue.$inferSelect;
export type NewCustomFieldSyncQueueRow = typeof customFieldSyncQueue.$inferInsert;
