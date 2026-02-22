import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow Outbox — transactional outbox for workflow domain events.
 *
 * K-12: Written INSIDE the mutation transaction alongside entity writes.
 * Workers poll pending rows and dispatch them asynchronously.
 *
 * intent_key: stable dedup hash — UNIQUE(org_id, intent_key) prevents
 * duplicate rows on TX retry (Phase 2 schema migration).
 */
export const workflowOutbox = pgTable(
  'workflow_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    traceId: text('trace_id'),
    intentKey: text('intent_key').notNull(),
    event: text('event').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    payload: jsonb('payload'),
    status: text('status').notNull().default('pending'),
    attempts: text('attempts').notNull().default('0'),
    lastError: text('last_error'),
    processAfter: timestamp('process_after', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('workflow_outbox_poll_idx')
      .on(table.status, table.processAfter)
      .where(sql`status = 'pending'`),
    index('workflow_outbox_org_idx').on(table.orgId, table.createdAt.desc()),
    // K-12 dedup: same intent_key within an org is idempotent
    sql`CONSTRAINT workflow_outbox_dedup UNIQUE (org_id, intent_key)`,
    check('workflow_outbox_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
  ],
);

/**
 * Search Outbox — transactional outbox for search index sync events.
 */
export const searchOutbox = pgTable(
  'search_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    traceId: text('trace_id'),
    intentKey: text('intent_key').notNull(),
    op: text('op').notNull(), // 'upsert' | 'delete'
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    payload: jsonb('payload'),
    status: text('status').notNull().default('pending'),
    attempts: text('attempts').notNull().default('0'),
    lastError: text('last_error'),
    processAfter: timestamp('process_after', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('search_outbox_poll_idx')
      .on(table.status, table.processAfter)
      .where(sql`status = 'pending'`),
    index('search_outbox_org_idx').on(table.orgId, table.createdAt.desc()),
    sql`CONSTRAINT search_outbox_dedup UNIQUE (org_id, intent_key)`,
    check('search_outbox_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
  ],
);

/**
 * Webhook Outbox — transactional outbox for external webhook dispatch.
 */
export const webhookOutbox = pgTable(
  'webhook_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    traceId: text('trace_id'),
    intentKey: text('intent_key').notNull(),
    event: text('event').notNull(),
    urlId: text('url_id').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    payload: jsonb('payload'),
    status: text('status').notNull().default('pending'),
    attempts: text('attempts').notNull().default('0'),
    lastError: text('last_error'),
    processAfter: timestamp('process_after', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('webhook_outbox_poll_idx')
      .on(table.status, table.processAfter)
      .where(sql`status = 'pending'`),
    sql`CONSTRAINT webhook_outbox_dedup UNIQUE (org_id, intent_key)`,
    check('webhook_outbox_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
  ],
);

/**
 * Integration Outbox — transactional outbox for external system sync events.
 */
export const integrationOutbox = pgTable(
  'integration_outbox',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    traceId: text('trace_id'),
    intentKey: text('intent_key').notNull(),
    target: text('target').notNull(), // e.g. 'quickbooks', 'salesforce'
    event: text('event').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    payload: jsonb('payload'),
    status: text('status').notNull().default('pending'),
    attempts: text('attempts').notNull().default('0'),
    lastError: text('last_error'),
    processAfter: timestamp('process_after', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('integration_outbox_poll_idx')
      .on(table.status, table.processAfter)
      .where(sql`status = 'pending'`),
    sql`CONSTRAINT integration_outbox_dedup UNIQUE (org_id, intent_key)`,
    check('integration_outbox_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
  ],
);

export type WorkflowOutboxRow = typeof workflowOutbox.$inferSelect;
export type SearchOutboxRow = typeof searchOutbox.$inferSelect;
export type WebhookOutboxRow = typeof webhookOutbox.$inferSelect;
export type IntegrationOutboxRow = typeof integrationOutbox.$inferSelect;
