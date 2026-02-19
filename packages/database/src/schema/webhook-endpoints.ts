import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    boolean,
    check,
    index,
    jsonb,
    pgTable,
    text,
    timestamp
} from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk } from '../helpers/base-entity';

/**
 * Webhook Endpoints — tenant-configured outbound webhook destinations.
 *
 * Each org can register multiple endpoints. Events are filtered by
 * subscribedEvents (JSONB array). HMAC-SHA256 signed with secret.
 */
export const webhookEndpoints = pgTable(
  'webhook_endpoints',
  {
    ...baseEntityColumns,
    name: text('name').notNull(),
    url: text('url').notNull(),
    /** HMAC secret — never expose to clients */
    secret: text('secret').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    /** JSONB array of event-type strings (e.g. ["invoice.posted", "payment.created"]) */
    subscribedEvents: jsonb('subscribed_events').notNull().default(sql`'[]'::jsonb`),
    description: text('description'),
    /** Rolling stats */
    lastDeliveredAt: timestamp('last_delivered_at', { withTimezone: true }),
    lastStatusCode: text('last_status_code'),
    failureCount: text('failure_count').notNull().default('0'),
  },
  (table) => [
    tenantPk(table),
    index('webhook_endpoints_org_active_idx').on(table.orgId, table.isActive),
    check('webhook_endpoints_url_not_empty', sql`url <> ''`),
    check('webhook_endpoints_org_not_empty', sql`org_id <> ''`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ],
);

export type WebhookEndpoint = typeof webhookEndpoints.$inferSelect;
export type NewWebhookEndpoint = typeof webhookEndpoints.$inferInsert;
