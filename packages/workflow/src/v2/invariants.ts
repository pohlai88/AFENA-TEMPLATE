/**
 * Workflow V2 Truth Invariants — WF-01 through WF-16.
 *
 * Reusable assertion helpers for tests and CI.
 * Each function throws with a descriptive message referencing the invariant ID
 * if the invariant is violated.
 *
 * PRD §: Truth Invariants (the "never violate" list)
 */

import { COMPILER_VERSION } from './types';

// ── WF-01: Single Writer ────────────────────────────────────

/**
 * WF-01: Only one advanceWorkflow() call may execute per instance at a time.
 * Enforced by pg_advisory_xact_lock(hashtextextended(instance_id, 0)).
 */
export function assertWF01_SingleWriter(lockAcquired: boolean): void {
  if (!lockAcquired) {
    throw new Error('WF-01 VIOLATED: Advisory lock was not acquired before advancing workflow instance.');
  }
}

// ── WF-02: Step Idempotency ────────────────────────────────

/**
 * WF-02: sha256(instance_id + node_id + token_id + entity_version) is globally unique per step execution.
 * Receipt INSERT must succeed before handler runs.
 */
export function assertWF02_StepIdempotency(receiptInserted: boolean, handlerRan: boolean): void {
  if (handlerRan && !receiptInserted) {
    throw new Error('WF-02 VIOLATED: Handler executed without successful receipt insertion.');
  }
}

// ── WF-03: Version-Consumptive Approvals ───────────────────

/**
 * WF-03: Approval decisions are version-pinned and consumptive.
 * A decision made at entity_version N is invalid if entity is now at version M > N.
 */
export function assertWF03_VersionPinnedApproval(
  decisionVersion: number,
  currentEntityVersion: number,
  applied: boolean,
): void {
  if (applied && decisionVersion !== currentEntityVersion) {
    throw new Error(
      `WF-03 VIOLATED: Approval decision at version ${String(decisionVersion)} applied to entity at version ${String(currentEntityVersion)}.`,
    );
  }
}

// ── WF-04: Published Definition Immutability ───────────────

/**
 * WF-04: Published workflow definitions cannot have content columns mutated.
 * Enforced by DB trigger reject_published_definition_mutation().
 */
export function assertWF04_PublishedImmutability(
  status: string,
  contentChanged: boolean,
): void {
  if (status === 'published' && contentChanged) {
    throw new Error('WF-04 VIOLATED: Content columns mutated on a published workflow definition.');
  }
}

// ── WF-05: Stable Region Version Check ─────────────────────

/**
 * WF-05: If current node is in a stable region, entity version must match
 * the version at instance creation. Drift → amendment required.
 */
export function assertWF05_StableRegionVersion(
  isStableRegion: boolean,
  instanceEntityVersion: number,
  currentEntityVersion: number,
): void {
  if (isStableRegion && instanceEntityVersion !== currentEntityVersion) {
    throw new Error(
      `WF-05 VIOLATED: Entity version drifted in stable region (instance: ${String(instanceEntityVersion)}, current: ${String(currentEntityVersion)}).`,
    );
  }
}

// ── WF-06: Slot Scope Enforcement ──────────────────────────

/**
 * WF-06: Org body patches may only inject nodes into declared slots.
 * No sys:* targeting, no cross-slot edges.
 */
export function assertWF06_SlotScope(
  patchNodeIds: string[],
  systemNodeIds: string[],
): void {
  for (const nodeId of patchNodeIds) {
    if (nodeId.startsWith('sys:')) {
      throw new Error(`WF-06 VIOLATED: Patch node "${nodeId}" targets system namespace.`);
    }
    if (systemNodeIds.includes(nodeId)) {
      throw new Error(`WF-06 VIOLATED: Patch node "${nodeId}" collides with system node.`);
    }
  }
}

// ── WF-07: Compiler Version Check ──────────────────────────

/**
 * WF-07: Engine refuses to run if compiled_hash doesn't match recomputation,
 * or if compiler_version is stale.
 */
export function assertWF07_CompilerVersion(
  compiledCompilerVersion: string,
  currentCompilerVersion: string = COMPILER_VERSION,
): void {
  if (compiledCompilerVersion !== currentCompilerVersion) {
    throw new Error(
      `WF-07 VIOLATED: Compiled with version "${compiledCompilerVersion}", current is "${currentCompilerVersion}".`,
    );
  }
}

// ── WF-08: System Gate Integrity ───────────────────────────

/**
 * WF-08: Compiled workflow must contain all required system gates (sys:start, sys:end).
 */
export function assertWF08_SystemGateIntegrity(
  requiredGates: string[],
  presentGates: string[],
): void {
  for (const gate of requiredGates) {
    if (!presentGates.includes(gate)) {
      throw new Error(`WF-08 VIOLATED: Required system gate "${gate}" missing from compiled workflow.`);
    }
  }
}

// ── WF-09: No Direct Table Writes ──────────────────────────

/**
 * WF-09: Action nodes call mutate() — workflow never writes tables directly.
 */
export function assertWF09_NoDirectWrites(handlerWritesDirectly: boolean): void {
  if (handlerWritesDirectly) {
    throw new Error('WF-09 VIOLATED: Handler wrote to tables directly instead of through mutate().');
  }
}

// ── WF-10: Side Effects via Outbox ─────────────────────────

/**
 * WF-10: All external IO goes through workflow_side_effects_outbox.
 * No direct HTTP/SMTP inside advanceWorkflow TX.
 */
export function assertWF10_SideEffectsViaOutbox(directIoPerformed: boolean): void {
  if (directIoPerformed) {
    throw new Error('WF-10 VIOLATED: Direct external IO performed inside advanceWorkflow transaction.');
  }
}

// ── WF-11: Outbox Idempotency ──────────────────────────────

/**
 * WF-11: Outbox events are deduplicated via workflow_outbox_receipts.
 * event_idempotency_key = sha256(instance_id + event_type + payload_hash + entity_version).
 */
export function assertWF11_OutboxIdempotency(
  receiptInserted: boolean,
  outboxRowWritten: boolean,
): void {
  if (outboxRowWritten && !receiptInserted) {
    throw new Error('WF-11 VIOLATED: Outbox row written without corresponding receipt.');
  }
}

// ── WF-12: Deterministic Compilation ───────────────────────

/**
 * WF-12: Same inputs → same compiled output (canonical sort by ID).
 */
export function assertWF12_DeterministicCompile(hash1: string, hash2: string): void {
  if (hash1 !== hash2) {
    throw new Error(`WF-12 VIOLATED: Same inputs produced different hashes ("${hash1}" vs "${hash2}").`);
  }
}

// ── WF-13: Deterministic Edge Evaluation ───────────────────

/**
 * WF-13: Edges evaluated in (priority ASC, edgeId ASC) order.
 * Topological sort uses stable tie-break.
 */
export function assertWF13_DeterministicEdgeOrder(
  edgeIds: string[],
  expectedOrder: string[],
): void {
  for (let i = 0; i < expectedOrder.length; i++) {
    if (edgeIds[i] !== expectedOrder[i]) {
      throw new Error(
        `WF-13 VIOLATED: Edge order mismatch at index ${String(i)}: got "${edgeIds[i] ?? 'undefined'}", expected "${expectedOrder[i] ?? 'undefined'}".`,
      );
    }
  }
}

// ── WF-14: Receipt-First Gate ──────────────────────────────

/**
 * WF-14: Receipt INSERT → step INSERT → handler dispatch (strict ordering).
 * No handler runs before receipt succeeds.
 */
export function assertWF14_ReceiptFirstGate(
  receiptSucceeded: boolean,
  stepInserted: boolean,
  handlerDispatched: boolean,
): void {
  if (handlerDispatched && !receiptSucceeded) {
    throw new Error('WF-14 VIOLATED: Handler dispatched before receipt insertion succeeded.');
  }
  if (stepInserted && !receiptSucceeded) {
    throw new Error('WF-14 VIOLATED: Step execution inserted before receipt insertion succeeded.');
  }
}

// ── WF-15: Token Determinism ───────────────────────────────

/**
 * WF-15: Token position is derivable from DAG + step_executions.
 * workflow_instances is a rebuildable projection.
 */
export function assertWF15_ProjectionMatch(
  liveCurrentNodes: string[],
  rebuiltCurrentNodes: string[],
): void {
  const liveSorted = [...liveCurrentNodes].sort();
  const rebuiltSorted = [...rebuiltCurrentNodes].sort();

  if (liveSorted.length !== rebuiltSorted.length) {
    throw new Error(
      `WF-15 VIOLATED: Projection mismatch — live has ${String(liveSorted.length)} nodes, rebuilt has ${String(rebuiltSorted.length)}.`,
    );
  }

  for (let i = 0; i < liveSorted.length; i++) {
    if (liveSorted[i] !== rebuiltSorted[i]) {
      throw new Error(
        `WF-15 VIOLATED: Projection mismatch at index ${String(i)}: live="${liveSorted[i] ?? ''}", rebuilt="${rebuiltSorted[i] ?? ''}".`,
      );
    }
  }
}

// ── WF-16: Join Idempotency ────────────────────────────────

/**
 * WF-16: Join receipt via join_idempotency_key prevents double join fire.
 * ANY-join: first receipt wins, losers cancelled.
 */
export function assertWF16_JoinIdempotency(
  joinReceiptInserted: boolean,
  joinFired: boolean,
  previousJoinExists: boolean,
): void {
  if (joinFired && previousJoinExists) {
    throw new Error('WF-16 VIOLATED: Join fired twice for the same join node + epoch.');
  }
  if (joinFired && !joinReceiptInserted) {
    throw new Error('WF-16 VIOLATED: Join fired without receipt insertion.');
  }
}
