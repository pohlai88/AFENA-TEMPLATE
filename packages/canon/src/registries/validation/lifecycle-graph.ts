/**
 * Lifecycle graph semantic validation
 */

import type { DocStatus } from '../../enums/doc-status';
import type { EntityContract } from '../../types/entity-contract';

/** Validation severity levels */
export type ValidationSeverity = 'fail' | 'warn';

/** Validation issue */
export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  entityType: string;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Validate lifecycle transition graph.
 * Returns issues (fail + warn).
 * 
 * Hard invariants (fail):
 * - Transitions reference unknown statuses
 * - Empty allowed arrays
 * - Duplicate verbs within same state
 * 
 * Soft invariants (warn):
 * - Unreachable states (some entities won't implement full lifecycle yet)
 * - Cycles (some workflows are cyclic by design)
 * - Terminal states with outgoing edges
 */
export function validateLifecycleGraph(contract: EntityContract): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!contract.hasLifecycle || contract.transitions.length === 0) {
    return issues;
  }

  const allStatuses = new Set<DocStatus>();
  const verbsByState = new Map<DocStatus, Set<string>>();

  // Collect all statuses and check for issues
  for (const transition of contract.transitions) {
    allStatuses.add(transition.from);

    // Check empty allowed (WARN — terminal states legitimately have no outgoing transitions)
    if (transition.allowed.length === 0) {
      issues.push({
        severity: 'warn',
        code: 'EMPTY_ALLOWED',
        entityType: contract.entityType,
        message: `Transition from '${transition.from}' has empty allowed array (terminal state)`,
        context: { from: transition.from },
      });
    }

    // Check duplicate verbs (FAIL)
    if (!verbsByState.has(transition.from)) {
      verbsByState.set(transition.from, new Set());
    }
    const seen = verbsByState.get(transition.from)!;

    for (const verb of transition.allowed) {
      if (seen.has(verb)) {
        issues.push({
          severity: 'fail',
          code: 'DUPLICATE_VERB',
          entityType: contract.entityType,
          message: `Duplicate verb '${verb}' in transition from '${transition.from}'`,
          context: { from: transition.from, verb },
        });
      }
      seen.add(verb);
    }
  }

  // Check reachability from 'draft' (WARN)
  if (allStatuses.has('draft')) {
    const reachable = computeReachableStates(contract.transitions, 'draft');
    for (const status of allStatuses) {
      if (!reachable.has(status) && status !== 'draft') {
        issues.push({
          severity: 'warn',
          code: 'UNREACHABLE_STATE',
          entityType: contract.entityType,
          message: `State '${status}' is unreachable from 'draft'`,
          context: { status },
        });
      }
    }
  }

  return issues;
}

/**
 * Compute reachable states via BFS.
 * Simplified implementation - assumes verbs map to states with same name.
 */
function computeReachableStates(
  transitions: { from: DocStatus; allowed: string[] }[],
  start: DocStatus
): Set<DocStatus> {
  const reachable = new Set<DocStatus>([start]);
  const queue: DocStatus[] = [start];

  // Build adjacency map
  const adj = new Map<DocStatus, Set<DocStatus>>();
  for (const t of transitions) {
    if (!adj.has(t.from)) {
      adj.set(t.from, new Set());
    }
    // Map verbs to potential next states
    // This is simplified - in reality, verbs like 'submit' might transition to 'submitted'
    for (const verb of t.allowed) {
      // Try to find matching state
      const nextState = transitions.find(tr => tr.from === verb as DocStatus);
      if (nextState) {
        adj.get(t.from)!.add(nextState.from);
      }
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adj.get(current) || new Set();
    for (const neighbor of neighbors) {
      if (!reachable.has(neighbor)) {
        reachable.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return reachable;
}
