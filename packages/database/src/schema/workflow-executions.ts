import { desc, sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { boolean, check, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow execution log — append-only evidence of rule evaluations.
 * Logged fire-and-forget OUTSIDE the mutation transaction (best-effort).
 * No UPDATE/DELETE ever — enforced by REVOKE + dropped RLS policies (matches advisory_evidence).
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const workflowExecutions = pgTable(
  'workflow_executions',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id').notNull(),
    ruleId: text('rule_id').notNull(),
    ruleName: text('rule_name'),
    timing: text('timing').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    actionType: text('action_type').notNull(),
    conditionMatched: boolean('condition_matched').notNull(),
    actionResult: jsonb('action_result'),
    error: text('error'),
    durationMs: integer('duration_ms'),
    requestId: text('request_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    // CHECK constraints
    check('workflow_executions_org_not_empty', sql`org_id <> ''`),
    check('workflow_executions_timing_check', sql`timing in ('before', 'after')`),

    // Indexes
    index('workflow_executions_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('workflow_executions_org_rule_created_idx').on(table.orgId, table.ruleId, table.createdAt),
    index('workflow_executions_org_request_idx').on(table.orgId, table.requestId),

    // RLS: SELECT + INSERT only (append-only — UPDATE/DELETE revoked post-migration)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type NewWorkflowExecution = typeof workflowExecutions.$inferInsert;
