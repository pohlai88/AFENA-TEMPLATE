import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { boolean, check, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { tenantPk } from '../helpers/base-entity';

/**
 * Entity version history — fork-aware, snapshot-first.
 * Append-only: SELECT for same org, INSERT if org matches. No UPDATE/DELETE.
 */
export const entityVersions = pgTable(
  'entity_versions',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    version: integer('version').notNull(),
    parentVersion: integer('parent_version'),
    isFork: boolean('is_fork').notNull().default(false),
    forkReason: text('fork_reason'),
    snapshot: jsonb('snapshot').notNull(),
    diff: jsonb('diff'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by').notNull(),
  },
  (table) => [
    tenantPk(table),
    uniqueIndex('entity_versions_unique_idx').on(
      table.orgId,
      table.entityType,
      table.entityId,
      table.version,
    ),
    check('entity_versions_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      modify: sql`(select auth.org_id()::uuid = ${table.orgId})`,
    }),
  ]
);

export type EntityVersion = typeof entityVersions.$inferSelect;
export type NewEntityVersion = typeof entityVersions.$inferInsert;
