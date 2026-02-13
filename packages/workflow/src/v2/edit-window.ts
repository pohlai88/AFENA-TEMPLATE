import type { CompiledWorkflow, EditWindow } from './types';
import { WorkflowEngineError, ENGINE_ERRORS } from './engine';

/**
 * Edit-window precondition hook for mutate().
 *
 * Called before any entity mutation to check if the workflow allows edits
 * at the current node position. This enforces the edit-window policy
 * defined in the compiled workflow.
 *
 * Usage in mutate():
 *   checkEditWindow(compiled, currentNodes, actionVerb)
 *
 * Throws WorkflowEngineError if the edit is not allowed.
 */
export function checkEditWindow(
  compiled: CompiledWorkflow,
  currentNodes: string[],
  actionVerb: string,
  instanceId?: string,
): void {
  for (const nodeId of currentNodes) {
    const editWindow = compiled.editWindows[nodeId];
    if (!editWindow) continue;

    switch (editWindow) {
      case 'locked':
        throw new WorkflowEngineError(
          ENGINE_ERRORS.EDIT_WINDOW_LOCKED,
          `Edit blocked: node "${nodeId}" is in locked edit window. No mutations allowed at this stage.`,
          instanceId,
        );

      case 'amend_only':
        // Only amendment-class verbs are allowed
        if (!isAmendmentVerb(actionVerb)) {
          throw new WorkflowEngineError(
            ENGINE_ERRORS.EDIT_WINDOW_LOCKED,
            `Edit blocked: node "${nodeId}" is in amend_only edit window. Only amendment verbs are allowed, got "${actionVerb}".`,
            instanceId,
          );
        }
        break;

      case 'editable':
        // All mutations allowed
        break;
    }
  }
}

/**
 * Get the effective edit window for a set of current nodes.
 * Returns the strictest window across all active nodes.
 */
export function getEffectiveEditWindow(
  compiled: CompiledWorkflow,
  currentNodes: string[],
): EditWindow {
  const strictnessOrder: Record<EditWindow, number> = {
    editable: 0,
    amend_only: 1,
    locked: 2,
  };

  let maxStrictness = 0;
  let result: EditWindow = 'editable';

  for (const nodeId of currentNodes) {
    const editWindow = compiled.editWindows[nodeId];
    if (!editWindow) continue;

    const strictness = strictnessOrder[editWindow];
    if (strictness > maxStrictness) {
      maxStrictness = strictness;
      result = editWindow;
    }
  }

  return result;
}

/**
 * Check if a verb is an amendment-class verb.
 * Amendment verbs are allowed in amend_only edit windows.
 */
function isAmendmentVerb(verb: string): boolean {
  const amendmentVerbs = new Set([
    'amend',
    'cancel',
    'reject',
    'approve',
    'submit',
  ]);
  return amendmentVerbs.has(verb);
}
