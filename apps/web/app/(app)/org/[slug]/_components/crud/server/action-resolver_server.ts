import type {
  ActionKind,
  DocStatus,
  EntityContract,
  ResolvedAction,
  ResolvedActions,
  ResolvedUpdateMode,
  UpdateMode,
} from 'afena-canon';

/**
 * ActionResolver — server-side truth for what the current actor
 * may do on the current entity. Client renders ONLY this output.
 *
 * Inputs: entity contract, doc state, actor context, SoD signals.
 * Output: ResolvedActions (Canon type).
 *
 * Hard invariants:
 *   - Client cannot invent actions.
 *   - SoD checks are server-only.
 */

// ── Resolver Input ──────────────────────────────────────────

export interface ResolverInput {
  contract: EntityContract;
  docStatus: DocStatus | null;
  isDeleted: boolean;
  isLocked: boolean;
  actor: {
    userId: string;
    roles: string[];
    orgRole: string;
  };
  /** SoD signals */
  submitterUserId?: string;
  assignedApproverUserIds?: string[];
  isSelfAction?: boolean;
}

// ── Action Metadata ─────────────────────────────────────────

const ACTION_META: Record<
  ActionKind,
  Omit<ResolvedAction, 'kind' | 'group'>
> = {
  create: {
    label: 'Create',
    icon: 'plus',
    variant: 'default',
    severity: 'info',
    requiresConfirm: false,
    requiresReason: false,
  },
  update: {
    label: 'Update',
    icon: 'pencil',
    variant: 'outline',
    severity: 'info',
    requiresConfirm: false,
    requiresReason: false,
  },
  delete: {
    label: 'Delete',
    icon: 'trash-2',
    variant: 'destructive',
    severity: 'critical',
    requiresConfirm: true,
    requiresReason: false,
    requiresTypedConfirm: 'DELETE',
  },
  restore: {
    label: 'Restore',
    icon: 'undo-2',
    variant: 'outline',
    severity: 'warning',
    requiresConfirm: true,
    requiresReason: false,
  },
  submit: {
    label: 'Submit',
    icon: 'send',
    variant: 'default',
    severity: 'warning',
    requiresConfirm: true,
    requiresReason: false,
  },
  cancel: {
    label: 'Cancel',
    icon: 'x-circle',
    variant: 'outline',
    severity: 'warning',
    requiresConfirm: true,
    requiresReason: true,
  },
  approve: {
    label: 'Approve',
    icon: 'check-circle',
    variant: 'default',
    severity: 'info',
    requiresConfirm: true,
    requiresReason: false,
  },
  reject: {
    label: 'Reject',
    icon: 'x-circle',
    variant: 'destructive',
    severity: 'critical',
    requiresConfirm: true,
    requiresReason: true,
  },
};

const UPDATE_MODE_META: Record<
  UpdateMode,
  Omit<ResolvedUpdateMode, 'mode'>
> = {
  edit: {
    label: 'Edit',
    description: 'Make changes to the current version',
    severity: 'info',
    requiresReason: false,
  },
  correct: {
    label: 'Correct',
    description: 'Fix an error in the current version',
    severity: 'warning',
    requiresReason: false,
  },
  amend: {
    label: 'Amend',
    description: 'Create an amended version with audit trail',
    severity: 'warning',
    requiresReason: true,
  },
  adjust: {
    label: 'Adjust',
    description: 'Post-approval adjustment with reason',
    severity: 'warning',
    requiresReason: true,
  },
  reassign: {
    label: 'Reassign',
    description: 'Transfer ownership to another user',
    severity: 'info',
    requiresReason: true,
  },
};

// ── Resolver ────────────────────────────────────────────────

export function resolveActions(input: ResolverInput): ResolvedActions {
  const { contract, docStatus, isDeleted, isLocked, actor } = input;

  const result: ResolvedActions = {
    primary: [],
    secondary: [],
    workflow: [],
    updateModes: [],
  };

  // Deleted entities: only restore is available
  if (isDeleted) {
    if (contract.hasSoftDelete) {
      result.primary.push(buildAction('restore', 'primary', contract));
    }
    return result;
  }

  // Locked entities: no actions
  if (isLocked) return result;

  // Determine allowed verbs from lifecycle transitions
  const allowedVerbs = getAllowedVerbs(contract, docStatus);

  // Separate into groups
  for (const verb of contract.primaryVerbs) {
    if (!allowedVerbs.has(verb)) continue;
    if (verb === 'create') continue; // create is page-level, not action bar
    result.primary.push(buildAction(verb, 'primary', contract));
  }

  for (const verb of contract.secondaryVerbs) {
    if (!allowedVerbs.has(verb)) continue;
    result.secondary.push(buildAction(verb, 'secondary', contract));
  }

  // Workflow decisions — apply SoD
  for (const verb of contract.workflowDecisions) {
    if (!allowedVerbs.has(verb)) continue;
    if (!passesSoD(verb, input, actor)) continue;
    result.workflow.push(buildAction(verb, 'workflow', contract));
  }

  // Update modes — only if 'update' is allowed
  if (allowedVerbs.has('update')) {
    for (const mode of contract.updateModes) {
      const meta = UPDATE_MODE_META[mode];
      // amend/adjust only available after approval (active status)
      if ((mode === 'amend' || mode === 'adjust') && docStatus !== 'active') continue;
      result.updateModes.push({ mode, ...meta });
    }
  }

  return result;
}

// ── Helpers ─────────────────────────────────────────────────

function getAllowedVerbs(
  contract: EntityContract,
  docStatus: DocStatus | null,
): Set<ActionKind> {
  if (!contract.hasLifecycle || !docStatus) {
    // Non-lifecycle entities: all primary + secondary verbs allowed
    const all = new Set<ActionKind>([
      ...contract.primaryVerbs,
      ...contract.secondaryVerbs,
      ...contract.workflowDecisions,
    ]);
    return all;
  }

  const transition = contract.transitions.find((t) => t.from === docStatus);
  return new Set(transition?.allowed ?? []);
}

function buildAction(
  kind: ActionKind,
  group: ResolvedAction['group'],
  contract: EntityContract,
): ResolvedAction {
  const meta = ACTION_META[kind];
  return {
    kind,
    group,
    ...meta,
    // Override requiresReason if contract says so
    requiresReason:
      meta.requiresReason || contract.reasonRequired.includes(kind),
  };
}

function passesSoD(
  verb: ActionKind,
  input: ResolverInput,
  actor: ResolverInput['actor'],
): boolean {
  // Approve/reject: submitter cannot approve their own submission
  if (verb === 'approve' || verb === 'reject') {
    if (input.submitterUserId && input.submitterUserId === actor.userId) {
      return false;
    }
    // If assigned approvers exist, actor must be in the list
    if (
      input.assignedApproverUserIds &&
      input.assignedApproverUserIds.length > 0
    ) {
      return input.assignedApproverUserIds.includes(actor.userId);
    }
  }
  return true;
}
