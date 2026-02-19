/**
 * FieldPolicyEngine — K-15 Centralized Field Write Policy (Phase 3)
 *
 * Enforces Canon EntityContract.writeRules against mutation input.
 * Always called during the Plan phase (before any DB writes).
 *
 * Rules (evaluated in order):
 *   immutable   — field cannot be changed; user inclusion is a hard error
 *   writeOnce   — only allowed if current value is null/undefined
 *   serverOwned — stripped silently from user input (system context bypasses)
 *   computed    — always rejected from user input
 *   nonNullable — null value rejected if field already has a non-null value
 *
 * Returns a FieldPolicyResult containing:
 *   sanitizedInput  — safe to pass to Drizzle for the entity write
 *   violations      — hard policy violations (caller decides whether to reject)
 *   strippedFields  — silently removed server-owned fields (audit trail)
 *
 * @see INTEGRATION_PLAN.md §3.6
 */

import type { FieldWriteRules } from 'afenda-canon';

export type FieldRule = 'immutable' | 'writeOnce' | 'serverOwned' | 'computed' | 'nonNullable';

export interface FieldPolicyViolation {
  field: string;
  rule: FieldRule;
  reason: string;
}

export interface FieldPolicyResult {
  /** Input record with policy breaches removed — safe to write to DB */
  sanitizedInput: Record<string, unknown>;
  /** Hard violations — caller should reject the mutation if violations.length > 0 */
  violations: FieldPolicyViolation[];
  /** Fields silently stripped (serverOwned/computed) — for writeSet audit trail */
  strippedFields: string[];
}

/**
 * Enforce EntityContract.writeRules against a mutation input record.
 *
 * @param writeRules     - Contract field rules (from Canon EntityContract.writeRules)
 * @param verb           - CRUD verb ('create' | 'update' | 'delete' | 'restore' | …)
 * @param input          - Raw sanitized input record (from sanitize-input.ts)
 * @param current        - Current entity row; undefined if this is a create
 * @param isSystemContext - True if actor is a system/worker (bypasses serverOwned strips)
 * @returns FieldPolicyResult
 */
export function enforceFieldWritePolicy(
  writeRules: FieldWriteRules,
  _verb: string,
  input: Record<string, unknown>,
  current: Record<string, unknown> | undefined,
  isSystemContext: boolean,
): FieldPolicyResult {
  const violations: FieldPolicyViolation[] = [];
  const strippedFields: string[] = [];
  const sanitized: Record<string, unknown> = { ...input };

  // ── Immutable ────────────────────────────────────────────────────────────
  // Field can NEVER be changed — not at create, not at update.
  for (const field of writeRules.immutable ?? []) {
    if (field in sanitized) {
      violations.push({
        field,
        rule: 'immutable',
        reason: `Field "${field}" is immutable and cannot be set.`,
      });
      delete sanitized[field];
    }
  }

  // ── Write-Once ───────────────────────────────────────────────────────────
  // Can only transition from null/undefined → non-null value. Subsequent sets
  // are rejected unless the current value is already null.
  for (const field of writeRules.writeOnce ?? []) {
    if (field in sanitized) {
      const alreadySet =
        current !== undefined &&
        current[field] !== null &&
        current[field] !== undefined;

      if (alreadySet) {
        violations.push({
          field,
          rule: 'writeOnce',
          reason: `Field "${field}" is write-once and already has a value.`,
        });
        delete sanitized[field];
      }
      // else: first write allowed (current is null/undefined or this is a create)
    }
  }

  // ── Server-Owned ─────────────────────────────────────────────────────────
  // Stripped silently from user input. System context (worker/job) bypasses.
  if (!isSystemContext) {
    for (const field of writeRules.serverOwned ?? []) {
      if (field in sanitized) {
        strippedFields.push(field);
        delete sanitized[field];
      }
    }
  }

  // ── Computed ─────────────────────────────────────────────────────────────
  // Always rejected from user input — these are derived server-side.
  for (const field of writeRules.computed ?? []) {
    if (field in sanitized) {
      violations.push({
        field,
        rule: 'computed',
        reason: `Field "${field}" is computed and cannot be set by the client.`,
      });
      delete sanitized[field];
    }
  }

  // ── Non-Nullable ─────────────────────────────────────────────────────────
  // Once a value is set, it cannot be nulled out.
  for (const field of writeRules.nonNullable ?? []) {
    if (field in sanitized && sanitized[field] === null) {
      const hadValue =
        current !== undefined &&
        current[field] !== null &&
        current[field] !== undefined;

      if (hadValue) {
        violations.push({
          field,
          rule: 'nonNullable',
          reason: `Field "${field}" cannot be set to null once it has a value.`,
        });
      }
    }
  }

  return { sanitizedInput: sanitized, violations, strippedFields };
}

/**
 * Build a `writeSet` summary from enforce results — used in MutationPlan.
 */
export function buildWriteSet(
  result: FieldPolicyResult,
): {
  allowed: string[];
  stripped: string[];
  rejected: Array<{ field: string; rule: string; reason: string }> | undefined;
} {
  return {
    allowed: Object.keys(result.sanitizedInput),
    stripped: result.strippedFields,
    rejected: result.violations.length > 0
      ? result.violations.map((v) => ({ field: v.field, rule: v.rule, reason: v.reason }))
      : undefined,
  };
}

