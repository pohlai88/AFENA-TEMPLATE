import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';
import { boolean, check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Workflow V2 Step Executions — partitioned by created_at (monthly).
 *
 * Composite PK: (created_at, id) — required by Postgres for partitioned tables.
 * Partitions managed by hand-written SQL in migration 0040.
 * Drizzle queries work against the parent table transparently.
 *
 * Append-only for authenticated role (REVOKE UPDATE, DELETE).
 * Service role can update status/output columns only (identity columns guarded by trigger).
 *
 * Triggers (from migrations 0040 + 0042):
 * - restrict_step_execution_updates: identity column immutability
 * - restrict_status_regression: terminal states are final
 * 
 * GAP-DB-001: Composite PK (created_at, id) for partitioning (not org_id, id pattern).
 */
export const workflowStepExecutions = pgTable(
  'workflow_step_executions',
  {
    id: uuid('id').defaultRandom().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    orgId: text('org_id').notNull().default(sql`(auth.require_org_id())`),
    instanceId: uuid('instance_id').notNull(),
    nodeId: text('node_id').notNull(),
    nodeType: text('node_type').notNull(),
    tokenId: text('token_id').notNull(),
    entityVersion: integer('entity_version').notNull(),
    status: text('status').notNull().default('pending'),
    runAs: text('run_as').notNull().default('actor'),
    idempotencyKey: text('idempotency_key').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    durationMs: integer('duration_ms'),
    inputJson: jsonb('input_json'),
    outputJson: jsonb('output_json'),
    error: text('error'),
    actorUserId: text('actor_user_id'),
    approvalRequestId: uuid('approval_request_id'),
    applied: boolean('applied'),
    snapshotVersionId: uuid('snapshot_version_id'),
    resumeAt: timestamp('resume_at', { withTimezone: true }),
    waitingForEventKey: text('waiting_for_event_key'),
  },
  (table) => [
    // Constraints
    check('wf_step_org_not_empty', sql`org_id <> ''`),
    check('wf_step_status_valid', sql`status IN ('pending', 'running', 'completed', 'failed', 'skipped', 'cancelled')`),
    check('wf_step_run_as_valid', sql`run_as IN ('actor', 'system', 'service_account')`),

    // Indexes
    index('wf_step_org_instance_idx').on(table.orgId, table.instanceId, table.createdAt),
    index('wf_step_org_actor_status_idx').on(table.orgId, table.actorUserId, table.status),
    index('wf_step_org_instance_node_status_idx').on(table.orgId, table.instanceId, table.nodeId, table.status),

    // RLS: SELECT + INSERT only (UPDATE/DELETE revoked post-migration)
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ]
);

export type WorkflowStepExecutionRow = typeof workflowStepExecutions.$inferSelect;
export type NewWorkflowStepExecutionRow = typeof workflowStepExecutions.$inferInsert;
