import { db, sql } from 'afena-database';
import { checkEditWindow } from 'afena-workflow';

import type { CompiledWorkflow } from 'afena-workflow';

/**
 * Enforce workflow edit-window policy as a mutate() precondition.
 *
 * PRD § Edit Windows:
 * > Edit windows are enforced inside mutate() itself as a precondition hook,
 * > not by the workflow engine. This is critical: if the workflow engine is
 * > down, users must still be unable to edit locked documents.
 *
 * 1. Looks up the active workflow_instance for the entity (single indexed lookup)
 * 2. Loads the compiled_json from the pinned workflow_definition
 * 3. Calls checkEditWindow(compiled, currentNodes, verb)
 *
 * If no active instance exists, the entity has no workflow constraints — proceed.
 * Throws WorkflowEngineError if the edit is blocked (locked / amend_only mismatch).
 */
export async function enforceEditWindow(
  entityType: string,
  entityId: string,
  verb: string,
): Promise<void> {
  // 1. Find active workflow instance for this entity
  const instanceRows = await db.execute<{
    id: string;
    current_nodes: string[];
    definition_id: string;
    definition_version: number;
  }>(sql`
    SELECT id, current_nodes, definition_id, definition_version
    FROM workflow_instances
    WHERE entity_type = ${entityType}
      AND entity_id = ${entityId}::uuid
      AND status IN ('running', 'paused')
    LIMIT 1
  `);

  const instance = instanceRows.rows?.[0];
  if (!instance) {
    // No active workflow — no edit-window constraints
    return;
  }

  const currentNodes = instance.current_nodes;
  if (!currentNodes || currentNodes.length === 0) {
    return;
  }

  // 2. Load compiled definition
  const defRows = await db.execute<{
    compiled_json: CompiledWorkflow;
  }>(sql`
    SELECT compiled_json
    FROM workflow_definitions
    WHERE id = ${instance.definition_id}::uuid
      AND version = ${instance.definition_version}
      AND definition_kind = 'effective'
      AND compiled_json IS NOT NULL
    LIMIT 1
  `);

  const def = defRows.rows?.[0];
  if (!def?.compiled_json) {
    // No compiled definition found — cannot enforce, proceed
    return;
  }

  // 3. Check edit window (throws WorkflowEngineError if blocked)
  checkEditWindow(def.compiled_json, currentNodes, verb, instance.id);
}
