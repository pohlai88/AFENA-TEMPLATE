import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Webhook endpoints — registered webhook targets for event delivery.
 *
 * PRD Phase C #11:
 * - Stores registered webhook URLs per org
 * - Event filtering via subscribed_events array
 * - Secret for HMAC signature verification
 * - Status tracking for delivery health
 */
export const webhookEndpoints = pgTable(
  'webhook_endpoints',
  {
    ...baseEntityColumns,
    url: text('url').notNull(),
    secret: text('secret').notNull(),
    description: text('description'),
    subscribedEvents: jsonb('subscribed_events').notNull().default('[]'),
    isActive: boolean('is_active').notNull().default(true),
    lastDeliveredAt: timestamp('last_delivered_at', { withTimezone: true }),
    lastStatusCode: text('last_status_code'),
    failureCount: integer('failure_count').notNull().default(0),
    metadata: jsonb('metadata'),
  },
  (table) => [
    index('webhook_ep_org_id_idx').on(table.orgId, table.id),
    index('webhook_ep_active_idx').on(table.orgId, table.isActive),
    check('webhook_ep_org_not_empty', sql`org_id <> ''`),
    check('webhook_ep_url_not_empty', sql`url <> ''`),
    tenantPolicy(table),
  ],
);

export type WebhookEndpoint = typeof webhookEndpoints.$inferSelect;
export type NewWebhookEndpoint = typeof webhookEndpoints.$inferInsert;

/**
 * Webhook deliveries — append-only log of delivery attempts.
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const webhookDeliveries = pgTable(
  'webhook_deliveries',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    endpointId: uuid('endpoint_id').notNull(),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    statusCode: text('status_code'),
    responseBody: text('response_body'),
    attemptNumber: integer('attempt_number').notNull().default(1),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }).notNull().defaultNow(),
    durationMs: integer('duration_ms'),
    error: text('error'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('webhook_del_org_id_idx').on(table.orgId, table.id),
    index('webhook_del_endpoint_idx').on(table.orgId, table.endpointId),
    index('webhook_del_event_idx').on(table.orgId, table.eventType),
    check('webhook_del_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;
