// TODO: Restore workflow tables when entities regenerated
// import {
//   workflowDefinitions,
//   workflowInstances,
//   workflowStepExecutions,
//   workflowEventsOutbox,
//   workflowSideEffectsOutbox,
//   workflowStepReceipts,
//   workflowOutboxReceipts,
// } from 'afenda-database';
import { and, eq, sql } from 'drizzle-orm';

// FIXME: This file is non-functional without workflow tables - creating temporary stubs
const workflowDefinitions = {} as any;
const workflowInstances = {} as any;
const workflowStepExecutions = {} as any;
const workflowEventsOutbox = {} as any;
const workflowSideEffectsOutbox = {} as any;
const workflowStepReceipts = {} as any;
const workflowOutboxReceipts = {} as any;

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { InstanceSnapshot, StepExecutionRecord, WorkflowDbAdapter } from './engine';
import type { CompiledWorkflow, InstanceStatus, WorkflowNode, WorkflowToken } from './types';

/**
 * Concrete WorkflowDbAdapter backed by Drizzle ORM + Neon.
 *
 * Implements every method from the engine's WorkflowDbAdapter interface.
 * All operations run within the caller's transaction context when provided.
 */
export class DrizzleWorkflowDbAdapter implements WorkflowDbAdapter {
  constructor(private readonly db: NeonHttpDatabase) { }

  // ── WF-01: Advisory Lock ────────────────────────────────────

  async acquireAdvisoryLock(instanceId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${instanceId}, 0))`
    );
  }

  // ── Load Instance ───────────────────────────────────────────

  async loadInstance(instanceId: string): Promise<InstanceSnapshot | null> {
    const rows = await this.db
      .select()
      .from(workflowInstances)
      .where(eq(workflowInstances.id, instanceId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      orgId: row.orgId,
      definitionId: row.definitionId,
      definitionVersion: row.definitionVersion,
      entityType: row.entityType,
      entityId: row.entityId,
      entityVersion: row.entityVersion,
      activeTokens: (row.activeTokens ?? []) as WorkflowToken[],
      currentNodes: row.currentNodes ?? [],
      status: row.status as InstanceStatus,
      lastStepExecutionId: row.lastStepExecutionId,
      contextJson: (row.contextJson ?? {}) as Record<string, unknown>,
    };
  }

  // ── Load Compiled Workflow ──────────────────────────────────

  async loadCompiledWorkflow(
    definitionId: string,
    definitionVersion: number,
  ): Promise<{
    compiled: CompiledWorkflow;
    compiledHash: string;
    compilerVersion: string;
    nodesJson: WorkflowNode[];
  } | null> {
    const rows = await this.db
      .select({
        compiledJson: workflowDefinitions.compiledJson,
        compiledHash: workflowDefinitions.compiledHash,
        compilerVersion: workflowDefinitions.compilerVersion,
        nodesJson: workflowDefinitions.nodesJson,
      })
      .from(workflowDefinitions)
      .where(
        and(
          eq(workflowDefinitions.id, definitionId),
          eq(workflowDefinitions.version, definitionVersion),
          eq(workflowDefinitions.status, 'published'),
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row?.compiledJson || !row.compiledHash || !row.compilerVersion) return null;

    return {
      compiled: row.compiledJson as CompiledWorkflow,
      compiledHash: row.compiledHash,
      compilerVersion: row.compilerVersion,
      nodesJson: (row.nodesJson ?? []) as WorkflowNode[],
    };
  }

  // ── WF-14: Receipt-First Gate ──────────────────────────────

  async insertStepReceipt(
    orgId: string,
    instanceId: string,
    idempotencyKey: string,
    stepExecutionId: string,
  ): Promise<boolean> {
    try {
      await this.db.insert(workflowStepReceipts).values({
        orgId,
        instanceId,
        idempotencyKey,
        stepExecutionId,
      });
      return true;
    } catch (err: unknown) {
      // Duplicate key = receipt already exists (idempotent skip)
      if (err instanceof Error && err.message.includes('duplicate key')) {
        return false;
      }
      throw err;
    }
  }

  // ── Insert Step Execution ──────────────────────────────────

  async insertStepExecution(record: StepExecutionRecord): Promise<void> {
    await this.db.insert(workflowStepExecutions).values({
      id: record.id,
      createdAt: new Date(record.createdAt),
      orgId: record.orgId,
      instanceId: record.instanceId,
      nodeId: record.nodeId,
      nodeType: record.nodeType,
      tokenId: record.tokenId,
      entityVersion: record.entityVersion,
      status: record.status,
      runAs: record.runAs,
      idempotencyKey: record.idempotencyKey,
      inputJson: record.inputJson,
      outputJson: record.outputJson,
      error: record.error,
      actorUserId: record.actorUserId,
    });
  }

  // ── Update Step Execution ──────────────────────────────────

  async updateStepExecution(
    stepExecutionId: string,
    createdAt: string,
    update: {
      status: string;
      outputJson?: Record<string, unknown> | null;
      error?: string | null;
      completedAt?: string;
      durationMs?: number;
    },
  ): Promise<void> {
    // Partitioned table requires partition key in WHERE clause
    await this.db
      .update(workflowStepExecutions)
      .set({
        status: update.status,
        ...(update.outputJson !== undefined ? { outputJson: update.outputJson } : {}),
        ...(update.error !== undefined ? { error: update.error } : {}),
        ...(update.completedAt ? { completedAt: new Date(update.completedAt) } : {}),
        ...(update.durationMs !== undefined ? { durationMs: update.durationMs } : {}),
      })
      .where(
        and(
          eq(workflowStepExecutions.id, stepExecutionId),
          eq(workflowStepExecutions.createdAt, new Date(createdAt)),
        )
      );
  }

  // ── Update Instance Projection ─────────────────────────────

  async updateInstanceProjection(
    instanceId: string,
    update: {
      activeTokens: WorkflowToken[];
      currentNodes: string[];
      status: InstanceStatus;
      lastStepExecutionId: string;
      entityVersion: number;
      completedAt?: string;
    },
  ): Promise<void> {
    await this.db
      .update(workflowInstances)
      .set({
        activeTokens: update.activeTokens,
        currentNodes: update.currentNodes,
        status: update.status,
        lastStepExecutionId: update.lastStepExecutionId,
        entityVersion: update.entityVersion,
        ...(update.completedAt ? { completedAt: new Date(update.completedAt) } : {}),
      })
      .where(eq(workflowInstances.id, instanceId));
  }

  // ── WF-11: Outbox Receipt ─────────────────────────────────

  async insertOutboxReceipt(
    orgId: string,
    instanceId: string,
    sourceTable: string,
    eventIdempotencyKey: string,
  ): Promise<boolean> {
    try {
      await this.db.insert(workflowOutboxReceipts).values({
        orgId,
        instanceId,
        sourceTable,
        eventIdempotencyKey,
      });
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('duplicate key')) {
        return false;
      }
      throw err;
    }
  }

  // ── Insert Event Outbox ────────────────────────────────────

  async insertEventOutbox(record: {
    orgId: string;
    instanceId: string;
    entityVersion: number;
    definitionVersion: number;
    eventType: string;
    payloadJson: Record<string, unknown>;
    eventIdempotencyKey: string;
    traceId?: string;
  }): Promise<void> {
    await this.db.insert(workflowEventsOutbox).values({
      orgId: record.orgId,
      instanceId: record.instanceId,
      entityVersion: record.entityVersion,
      definitionVersion: record.definitionVersion,
      eventType: record.eventType,
      payloadJson: record.payloadJson,
      eventIdempotencyKey: record.eventIdempotencyKey,
      ...(record.traceId ? { traceId: record.traceId } : {}),
    });
  }

  // ── Insert Side-Effect Outbox ──────────────────────────────

  async insertSideEffectOutbox(record: {
    orgId: string;
    instanceId: string;
    stepExecutionId: string;
    effectType: string;
    payloadJson: Record<string, unknown>;
    eventIdempotencyKey: string;
    traceId?: string;
  }): Promise<void> {
    await this.db.insert(workflowSideEffectsOutbox).values({
      orgId: record.orgId,
      instanceId: record.instanceId,
      stepExecutionId: record.stepExecutionId,
      effectType: record.effectType,
      payloadJson: record.payloadJson,
      eventIdempotencyKey: record.eventIdempotencyKey,
      ...(record.traceId ? { traceId: record.traceId } : {}),
    });
  }

  // ── WF-16: Join Receipt ────────────────────────────────────

  async insertJoinReceipt(
    orgId: string,
    instanceId: string,
    joinIdempotencyKey: string,
  ): Promise<boolean> {
    try {
      // Reuse step receipts table with a join-specific key prefix
      await this.db.insert(workflowStepReceipts).values({
        orgId,
        instanceId,
        idempotencyKey: `join:${joinIdempotencyKey}`,
        stepExecutionId: instanceId, // placeholder — join receipts don't map to a single step
      });
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('duplicate key')) {
        return false;
      }
      throw err;
    }
  }

  // ── Count Tokens at Join ───────────────────────────────────

  async countTokensAtJoin(instanceId: string, joinNodeId: string): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(workflowStepExecutions)
      .where(
        and(
          eq(workflowStepExecutions.instanceId, instanceId),
          eq(workflowStepExecutions.nodeId, joinNodeId),
          eq(workflowStepExecutions.status, 'completed'),
        )
      );

    return result[0]?.count ?? 0;
  }

  // ── Cancel Token Steps ─────────────────────────────────────

  async cancelTokenSteps(
    instanceId: string,
    tokenIds: string[],
    reason: string,
  ): Promise<void> {
    if (tokenIds.length === 0) return;

    // Cancel all pending/running steps for the given tokens
    await this.db.execute(sql`
      UPDATE workflow_step_executions
      SET status = 'cancelled', error = ${reason}
      WHERE instance_id = ${instanceId}::uuid
        AND token_id = ANY(${tokenIds}::text[])
        AND status IN ('pending', 'running')
    `);
  }

  // ── Create Instance ────────────────────────────────────────

  async createInstance(instance: InstanceSnapshot): Promise<void> {
    await this.db.insert(workflowInstances).values({
      id: instance.id,
      orgId: instance.orgId,
      definitionId: instance.definitionId,
      definitionVersion: instance.definitionVersion,
      entityType: instance.entityType,
      entityId: instance.entityId,
      entityVersion: instance.entityVersion,
      activeTokens: instance.activeTokens,
      currentNodes: instance.currentNodes,
      status: instance.status,
      contextJson: instance.contextJson,
    });
  }

  // ── Worker Adapter Methods ──────────────────────────────────
  // These satisfy WorkerDbAdapter interface (duck-typed).

  async pollOutboxEvents(batchSize: number): Promise<unknown[]> {
    const result = await this.db.execute(sql`
      SELECT
        id, created_at AS "createdAt", org_id AS "orgId",
        instance_id AS "instanceId", entity_version AS "entityVersion",
        definition_version AS "definitionVersion", event_type AS "eventType",
        payload_json AS "payloadJson", event_idempotency_key AS "eventIdempotencyKey",
        trace_id AS "traceId", status, attempts, max_attempts AS "maxAttempts"
      FROM workflow_events_outbox
      WHERE status IN ('pending', 'failed')
        AND (next_retry_at IS NULL OR next_retry_at <= now())
        AND attempts < max_attempts
      ORDER BY created_at ASC
      LIMIT ${batchSize}
      FOR UPDATE SKIP LOCKED
    `);
    return result.rows ?? [];
  }

  async markOutboxProcessing(id: string, createdAt: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE workflow_events_outbox
      SET status = 'processing', attempts = attempts + 1
      WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
    `);
  }

  async markOutboxCompleted(id: string, createdAt: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE workflow_events_outbox
      SET status = 'completed', completed_at = now()
      WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
    `);
  }

  async markOutboxFailed(id: string, createdAt: string, error: string, nextRetryAt: string | null): Promise<void> {
    await this.db.execute(sql`
      UPDATE workflow_events_outbox
      SET status = 'failed', error = ${error},
          next_retry_at = ${nextRetryAt ?? null}::timestamptz
      WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
    `);
  }

  async markOutboxDeadLetter(id: string, createdAt: string, error: string): Promise<void> {
    await this.db.execute(sql`
      UPDATE workflow_events_outbox
      SET status = 'dead_letter', error = ${error}
      WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
    `);
  }

  async resolveActiveToken(instanceId: string): Promise<{
    nodeId: string;
    tokenId: string;
    entityVersion: number;
  } | null> {
    const rows = await this.db
      .select({
        activeTokens: workflowInstances.activeTokens,
        entityVersion: workflowInstances.entityVersion,
      })
      .from(workflowInstances)
      .where(eq(workflowInstances.id, instanceId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const tokens = (row.activeTokens ?? []) as WorkflowToken[];
    const activeToken = tokens.find((t) => t.status === 'active');
    if (!activeToken) return null;

    return {
      nodeId: activeToken.currentNodeId,
      tokenId: activeToken.id,
      entityVersion: row.entityVersion,
    };
  }

  async lookupPublishedDefinition(orgId: string, entityType: string): Promise<{
    definitionId: string;
    definitionVersion: number;
  } | null> {
    const rows = await this.db
      .select({
        id: workflowDefinitions.id,
        version: workflowDefinitions.version,
      })
      .from(workflowDefinitions)
      .where(
        and(
          eq(workflowDefinitions.orgId, orgId),
          eq(workflowDefinitions.entityType, entityType),
          eq(workflowDefinitions.status, 'published'),
          eq(workflowDefinitions.definitionKind, 'effective'),
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      definitionId: row.id,
      definitionVersion: row.version,
    };
  }

  async hasActiveInstance(orgId: string, entityType: string, entityId: string): Promise<boolean> {
    const result = await this.db.execute(sql`
      SELECT 1 FROM workflow_instances
      WHERE org_id = ${orgId}
        AND entity_type = ${entityType}
        AND entity_id = ${entityId}
        AND status IN ('running', 'paused')
      LIMIT 1
    `);
    return (result.rows?.length ?? 0) > 0;
  }
}
