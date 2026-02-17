import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Mutation batches — groups bulk operations.
 */
export const mutationBatches = pgTable(
  'mutation_batches',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    status: text('status').notNull().default('open'),
    actionType: text('action_type').notNull(),
    entityType: text('entity_type').notNull(),
    totalCount: integer('total_count').notNull(),
    successCount: integer('success_count').default(0),
    failureCount: integer('failure_count').default(0),
    summary: jsonb('summary'),
    requestId: text('request_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by').notNull(),
  },
  (table) => [
    check('mutation_batches_org_not_empty', sql`org_id <> ''`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type MutationBatch = typeof mutationBatches.$inferSelect;
export type NewMutationBatch = typeof mutationBatches.$inferInsert;
