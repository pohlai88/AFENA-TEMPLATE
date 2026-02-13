'use server';

import { db, sql } from 'afena-database';
import { compileEffective, COMPILER_VERSION } from 'afena-workflow';

import type { BodySlot, SlotGraphPatch, WorkflowEdge, WorkflowNode } from 'afena-workflow';

interface ActionResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

type Row = Record<string, unknown>;

// ── List Definitions ───────────────────────────────────────

export async function listWorkflowDefinitions(
  entityType?: string,
): Promise<ActionResult<Row[]>> {
  try {
    const result = entityType
      ? await db.execute<Row>(sql`
          SELECT * FROM workflow_definitions
          WHERE entity_type = ${entityType}
          ORDER BY entity_type, name, version DESC
        `)
      : await db.execute<Row>(sql`
          SELECT * FROM workflow_definitions
          ORDER BY entity_type, name, version DESC
        `);

    return { ok: true, data: result.rows ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Get Definition ─────────────────────────────────────────

export async function getWorkflowDefinition(
  id: string,
  version?: number,
): Promise<ActionResult> {
  try {
    const result = version
      ? await db.execute<Row>(sql`
          SELECT * FROM workflow_definitions
          WHERE id = ${id}::uuid AND version = ${version}
          LIMIT 1
        `)
      : await db.execute<Row>(sql`
          SELECT * FROM workflow_definitions
          WHERE id = ${id}::uuid
          ORDER BY version DESC
          LIMIT 1
        `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Definition not found' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Create Draft Definition ────────────────────────────────

export async function createWorkflowDefinition(input: {
  entityType: string;
  name: string;
  definitionKind: 'envelope' | 'org_patch' | 'effective';
  nodesJson?: unknown;
  edgesJson?: unknown;
  slotsJson?: unknown;
  bodyPatchesJson?: unknown;
}): Promise<ActionResult> {
  try {
    const result = await db.execute<Row>(sql`
      INSERT INTO workflow_definitions (
        entity_type, name, version, status, is_default, definition_kind,
        nodes_json, edges_json, slots_json, body_patches_json
      ) VALUES (
        ${input.entityType},
        ${input.name},
        1,
        'draft',
        false,
        ${input.definitionKind},
        ${JSON.stringify(input.nodesJson ?? [])}::jsonb,
        ${JSON.stringify(input.edgesJson ?? [])}::jsonb,
        ${JSON.stringify(input.slotsJson ?? [])}::jsonb,
        ${JSON.stringify(input.bodyPatchesJson ?? null)}::jsonb
      )
      RETURNING id, version
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Insert failed' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Update Draft Definition ────────────────────────────────

export async function updateWorkflowDefinition(
  id: string,
  version: number,
  input: {
    name?: string;
    nodesJson?: unknown;
    edgesJson?: unknown;
    slotsJson?: unknown;
    bodyPatchesJson?: unknown;
  },
): Promise<ActionResult> {
  try {
    const setClauses: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      setClauses.push('name = $1');
      values.push(input.name);
    }
    if (input.nodesJson !== undefined) {
      setClauses.push(`nodes_json = '${JSON.stringify(input.nodesJson)}'::jsonb`);
    }
    if (input.edgesJson !== undefined) {
      setClauses.push(`edges_json = '${JSON.stringify(input.edgesJson)}'::jsonb`);
    }
    if (input.slotsJson !== undefined) {
      setClauses.push(`slots_json = '${JSON.stringify(input.slotsJson)}'::jsonb`);
    }
    if (input.bodyPatchesJson !== undefined) {
      setClauses.push(`body_patches_json = '${JSON.stringify(input.bodyPatchesJson)}'::jsonb`);
    }

    // Use parameterized update for safety
    const result = await db.execute<Row>(sql`
      UPDATE workflow_definitions
      SET
        name = COALESCE(${input.name ?? null}, name),
        nodes_json = COALESCE(${JSON.stringify(input.nodesJson ?? null)}::jsonb, nodes_json),
        edges_json = COALESCE(${JSON.stringify(input.edgesJson ?? null)}::jsonb, edges_json),
        slots_json = COALESCE(${JSON.stringify(input.slotsJson ?? null)}::jsonb, slots_json),
        body_patches_json = COALESCE(${JSON.stringify(input.bodyPatchesJson ?? null)}::jsonb, body_patches_json)
      WHERE id = ${id}::uuid
        AND version = ${version}
        AND status = 'draft'
      RETURNING id, version
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Definition not found or not in draft status' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Publish Definition ─────────────────────────────────────
// Compile + freeze. PRD: publish = compileEffective() + lock.

export async function publishWorkflowDefinition(
  id: string,
  version: number,
): Promise<ActionResult> {
  try {
    // 1. Load the draft definition
    const defResult = await db.execute<Row>(sql`
      SELECT id, version, definition_kind, nodes_json, edges_json, slots_json, body_patches_json
      FROM workflow_definitions
      WHERE id = ${id}::uuid AND version = ${version} AND status = 'draft'
      LIMIT 1
    `);

    const def = defResult.rows?.[0];
    if (!def) return { ok: false, error: 'Draft definition not found' };

    // 2. Compile the effective workflow
    const nodes = (def['nodes_json'] ?? []) as WorkflowNode[];
    const edges = (def['edges_json'] ?? []) as WorkflowEdge[];
    const slots = (def['slots_json'] ?? []) as BodySlot[];
    const bodyPatches = (def['body_patches_json'] ?? {}) as Record<string, SlotGraphPatch>;
    const envelopeVersion = version;

    const compileResult = compileEffective(nodes, edges, slots, bodyPatches, envelopeVersion);

    if (!compileResult.ok) {
      return { ok: false, error: `Compilation failed: ${compileResult.errors.join('; ')}` };
    }

    const compiledJson = compileResult.compiled;
    const compiledHash = compiledJson.hash;

    // 3. Atomically update: set compiled fields + status = 'published'
    const result = await db.execute<Row>(sql`
      UPDATE workflow_definitions
      SET
        status = 'published',
        compiled_json = ${JSON.stringify(compiledJson)}::jsonb,
        compiled_hash = ${compiledHash},
        compiler_version = ${COMPILER_VERSION}
      WHERE id = ${id}::uuid AND version = ${version} AND status = 'draft'
      RETURNING id, version, compiled_hash
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Definition was modified concurrently' };

    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Archive Definition ─────────────────────────────────────

export async function archiveWorkflowDefinition(
  id: string,
  version: number,
): Promise<ActionResult> {
  try {
    const result = await db.execute<Row>(sql`
      UPDATE workflow_definitions
      SET status = 'archived'
      WHERE id = ${id}::uuid
        AND version = ${version}
        AND status = 'published'
      RETURNING id, version
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Published definition not found' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── List Definition Versions ──────────────────────────────

export async function listDefinitionVersions(
  entityType: string,
  name: string,
): Promise<ActionResult<Row[]>> {
  try {
    const result = await db.execute<Row>(sql`
      SELECT id, entity_type, name, version, status, is_default, definition_kind,
             compiled_hash, created_at, updated_at
      FROM workflow_definitions
      WHERE entity_type = ${entityType} AND name = ${name}
      ORDER BY version DESC
    `);

    return { ok: true, data: result.rows ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── List Instances ─────────────────────────────────────────

export async function listWorkflowInstances(
  entityType?: string,
  status?: string,
): Promise<ActionResult<Row[]>> {
  try {
    let result;
    if (entityType && status) {
      result = await db.execute<Row>(sql`
        SELECT * FROM workflow_instances
        WHERE entity_type = ${entityType} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT 100
      `);
    } else if (entityType) {
      result = await db.execute<Row>(sql`
        SELECT * FROM workflow_instances
        WHERE entity_type = ${entityType}
        ORDER BY created_at DESC
        LIMIT 100
      `);
    } else {
      result = await db.execute<Row>(sql`
        SELECT * FROM workflow_instances
        ORDER BY created_at DESC
        LIMIT 100
      `);
    }

    return { ok: true, data: result.rows ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Get Instance ───────────────────────────────────────────

export async function getWorkflowInstance(
  instanceId: string,
): Promise<ActionResult> {
  try {
    const result = await db.execute<Row>(sql`
      SELECT * FROM workflow_instances
      WHERE id = ${instanceId}::uuid
      LIMIT 1
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Instance not found' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Get Instance Steps ─────────────────────────────────────

export async function getWorkflowInstanceSteps(
  instanceId: string,
): Promise<ActionResult<unknown[]>> {
  try {
    const result = await db.execute(sql`
      SELECT id, created_at, node_id, node_type, token_id, entity_version,
             status, run_as, output_json, error, actor_user_id, chosen_edge_ids,
             completed_at, duration_ms
      FROM workflow_step_executions
      WHERE instance_id = ${instanceId}::uuid
      ORDER BY created_at ASC
    `);

    return { ok: true, data: result.rows ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Pending Approvals for Actor ────────────────────────────

export async function listPendingApprovals(
  actorUserId: string,
): Promise<ActionResult<unknown[]>> {
  try {
    const result = await db.execute(sql`
      SELECT
        ar.id AS request_id,
        ar.entity_type,
        ar.entity_id,
        ar.chain_id,
        ar.current_step_order,
        ar.status AS request_status,
        ar.requested_by,
        ar.requested_at,
        ar.memo,
        ast.name AS step_name,
        ast.approval_mode,
        ast.required_count
      FROM approval_requests ar
      JOIN approval_steps ast
        ON ast.chain_id = ar.chain_id
        AND ast.step_order = ar.current_step_order
        AND ast.org_id = ar.org_id
      WHERE ar.status = 'pending'
        AND (
          ast.approver_user_id = ${actorUserId}
          OR ast.approver_role_id IN (
            SELECT role_id FROM user_roles WHERE user_id = ${actorUserId}
          )
        )
      ORDER BY ar.requested_at DESC
      LIMIT 100
    `);

    return { ok: true, data: result.rows ?? [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Submit Approval Decision ───────────────────────────────

export async function submitApprovalDecision(input: {
  requestId: string;
  decision: 'approved' | 'rejected' | 'abstained';
  reason?: string;
}): Promise<ActionResult> {
  try {
    const result = await db.execute<Row>(sql`
      INSERT INTO approval_decisions (
        request_id, step_id, decision, decided_by, reason
      )
      SELECT
        ${input.requestId}::uuid,
        ast.id,
        ${input.decision},
        auth.user_id(),
        ${input.reason ?? null}
      FROM approval_requests ar
      JOIN approval_steps ast
        ON ast.chain_id = ar.chain_id
        AND ast.step_order = ar.current_step_order
        AND ast.org_id = ar.org_id
      WHERE ar.id = ${input.requestId}::uuid
        AND ar.status = 'pending'
      RETURNING id
    `);

    const row = result.rows?.[0];
    if (!row) return { ok: false, error: 'Approval request not found or already decided' };
    return { ok: true, data: row };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Workflow Health Stats ──────────────────────────────────

export async function getWorkflowHealthStats(): Promise<ActionResult<{
  pendingOutbox: number;
  processingOutbox: number;
  failedOutbox: number;
  deadLetterOutbox: number;
  pendingSideEffects: number;
  stuckInstances: number;
  oldestPendingAge: string | null;
}>> {
  try {
    const [outbox, sideEffects, stuck, oldest] = await Promise.all([
      db.execute<Row>(sql`
        SELECT status, COUNT(*)::text AS count
        FROM workflow_events_outbox
        WHERE status IN ('pending', 'processing', 'failed', 'dead_letter')
        GROUP BY status
      `),
      db.execute<Row>(sql`
        SELECT COUNT(*)::text AS count
        FROM workflow_side_effects_outbox
        WHERE status = 'pending'
      `),
      db.execute<Row>(sql`
        SELECT COUNT(*)::text AS count
        FROM workflow_instances wi
        WHERE wi.status = 'running'
          AND NOT EXISTS (
            SELECT 1 FROM workflow_events_outbox weo
            WHERE weo.instance_id = wi.id AND weo.status IN ('pending', 'processing')
          )
          AND wi.updated_at < NOW() - INTERVAL '30 minutes'
      `),
      db.execute<Row>(sql`
        SELECT (NOW() - MIN(created_at))::text AS age
        FROM workflow_events_outbox
        WHERE status = 'pending'
      `),
    ]);

    const outboxCounts: Record<string, number> = {};
    for (const row of outbox.rows ?? []) {
      outboxCounts[row['status'] as string] = parseInt(row['count'] as string, 10);
    }

    return {
      ok: true,
      data: {
        pendingOutbox: outboxCounts['pending'] ?? 0,
        processingOutbox: outboxCounts['processing'] ?? 0,
        failedOutbox: outboxCounts['failed'] ?? 0,
        deadLetterOutbox: outboxCounts['dead_letter'] ?? 0,
        pendingSideEffects: parseInt((sideEffects.rows?.[0]?.['count'] as string) ?? '0', 10),
        stuckInstances: parseInt((stuck.rows?.[0]?.['count'] as string) ?? '0', 10),
        oldestPendingAge: (oldest.rows?.[0]?.['age'] as string) ?? null,
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
