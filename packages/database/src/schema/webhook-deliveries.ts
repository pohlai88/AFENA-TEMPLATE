import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    boolean,
    check,
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid
} from 'drizzle-orm/pg-core';

/**
 * Webhook Deliveries — append-only log of every dispatch attempt.
 *
 * K-14 (evidence table): INSERT only. No UPDATE or DELETE.
 * Retention policy applied by background worker (e.g. 90-day TTL).
 */
export const webhookDeliveries = pgTable(
  'webhook_deliveries',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    endpointId: uuid('endpoint_id').notNull(),
    eventType: text('event_type').notNull(),
    /** Full payload sent to endpoint */
    payload: jsonb('payload'),
    statusCode: text('status_code'),
    /** Truncated to 4KB */
    responseBody: text('response_body'),
    attemptNumber: text('attempt_number').notNull().default('1'),
    /** Milliseconds */
    durationMs: text('duration_ms').notNull().default('0'),
    error: text('error'),
    success: boolean('success').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('webhook_deliveries_org_created_idx').on(table.orgId, table.createdAt.desc()),
    index('webhook_deliveries_endpoint_idx').on(table.orgId, table.endpointId, table.createdAt.desc()),
    check('webhook_deliveries_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      // K-14: evidence tables — INSERT only, no modify
      modify: null,
    }),
  ],
);

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert;
