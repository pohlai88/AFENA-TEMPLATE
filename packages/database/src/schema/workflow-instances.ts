import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Instances — one per active workflow run per document.
 *
 * Partial UNIQUE: only one running/paused instance per (org, entity_type, entity_id).
 * Completed/cancelled instances preserved for audit history.
 *
 * Triggers (from migration 0040):
 * - restrict_status_regression: terminal states are final
 * - set_updated_at
 */
export const workflowInstances = pgTable(
  'workflow_instances',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    definitionId: uuid('definition_id').notNull(),
    definitionVersion: integer('definition_version').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    entityVersion: integer('entity_version').notNull(),
    activeTokens: jsonb('active_tokens').notNull().default(sql`'[]'::jsonb`),
    currentNodes: text('current_nodes').array().notNull().default(sql`'{}'`),
    status: text('status').notNull().default('running'),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    lastStepExecutionId: uuid('last_step_execution_id'),
    contextJson: jsonb('context_json').default(sql`'{}'::jsonb`),
  },
  (table) => [
    // Constraints
    check('wf_inst_org_not_empty', sql`org_id <> ''`),
    check('wf_inst_status_valid', sql`status IN ('running', 'paused', 'completed', 'failed', 'cancelled')`),

    // Indexes (partial UNIQUE handled by hand-written SQL — Drizzle doesn't support WHERE on unique)
    index('wf_inst_org_entity_idx').on(table.orgId, table.entityType, table.entityId),
    index('wf_inst_org_status_idx').on(table.orgId, table.status, table.updatedAt),
    index('wf_inst_org_definition_idx').on(table.orgId, table.definitionId),

    // RLS
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowInstanceRow = typeof workflowInstances.$inferSelect;
export type NewWorkflowInstanceRow = typeof workflowInstances.$inferInsert;
