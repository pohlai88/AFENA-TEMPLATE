import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

/**
 * Entity version history — fork-aware, snapshot-first.
 * Append-only: SELECT for same org, INSERT if org matches. No UPDATE/DELETE.
 */
export const entityVersions = pgTable(
  'entity_versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    version: integer('version').notNull(),
    parentVersion: integer('parent_version'),
    snapshot: jsonb('snapshot').notNull(),
    diff: jsonb('diff'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by').notNull(),
  },
  (table) => [
    uniqueIndex('entity_versions_unique_idx').on(
      table.orgId,
      table.entityType,
      table.entityId,
      table.version,
    ),
    check('entity_versions_org_not_empty', sql`org_id <> ''`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type EntityVersion = typeof entityVersions.$inferSelect;
export type NewEntityVersion = typeof entityVersions.$inferInsert;
