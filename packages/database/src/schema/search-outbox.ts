import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Search outbox — transactional outbox for incremental search updates (GAP-DB-004).
 *
 * Written in same TX as mutate() when a searchable entity changes.
 * Worker polls with FOR UPDATE SKIP LOCKED → UPSERT search_documents → mark completed.
 *
 * Action: 'upsert' | 'delete' — upsert refreshes from source, delete removes from search_documents.
 */
export const searchOutbox = pgTable(
  'search_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    action: text('action').notNull().default('upsert'),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(5),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    error: text('error'),
  },
  (table) => [
    check('search_outbox_org_not_empty', sql`org_id <> ''`),
    check('search_outbox_status_valid', sql`status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')`),
    check('search_outbox_action_valid', sql`action IN ('upsert', 'delete')`),
    index('search_outbox_poll_idx').on(table.status, table.createdAt),
    index('search_outbox_org_idx').on(table.orgId),
    tenantPolicy(table),
  ]
);

export type SearchOutboxRow = typeof searchOutbox.$inferSelect;
export type NewSearchOutboxRow = typeof searchOutbox.$inferInsert;
