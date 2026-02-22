import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { tenantPk } from '../helpers/base-entity';

/**
 * Audit log — base + 3 JSONB payload columns.
 * Append-only: SELECT for same org, INSERT if org matches + actor matches (K-14).
 * No UPDATE/DELETE ever.
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    actorUserId: text('actor_user_id').notNull(),
    actorName: text('actor_name'),
    ownerId: text('owner_id'),
    geoCountry: text('geo_country'),
    actionType: text('action_type').notNull(),
    actionFamily: text('action_family').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    requestId: text('request_id'),
    mutationId: uuid('mutation_id').notNull().unique(),
    batchId: uuid('batch_id'),
    versionBefore: integer('version_before'),
    versionAfter: integer('version_after').notNull(),
    channel: text('channel').notNull().default('web_ui'),
    ip: text('ip'),
    userAgent: text('user_agent'),
    reason: text('reason'),
    authoritySnapshot: jsonb('authority_snapshot'),
    idempotencyKey: text('idempotency_key'),
    affectedCount: integer('affected_count').default(1),
    valueDelta: jsonb('value_delta'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

    // Payload (3 JSONB)
    before: jsonb('before'),
    after: jsonb('after'),
    diff: jsonb('diff'),
  },
  (table) => [
    tenantPk(table),
    index('audit_logs_org_created_idx').on(table.orgId, table.createdAt),
    index('audit_logs_entity_timeline_idx').on(table.entityType, table.entityId, table.createdAt),
    index('audit_logs_batch_idx').on(table.batchId, table.createdAt),
    index('audit_logs_request_idx').on(table.requestId),
    uniqueIndex('audit_logs_idempotency_idx')
      .on(table.orgId, table.actionType, table.idempotencyKey)
      .where(sql`idempotency_key IS NOT NULL`),
    check('audit_logs_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    // RLS: SELECT for same org, INSERT if org + actor match (K-14)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      modify: sql`(select auth.org_id()::uuid = ${table.orgId} AND (${table.channel} = 'system' OR auth.user_id() = ${table.actorUserId}))`,
    }),
  ]
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
