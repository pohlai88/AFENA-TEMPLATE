import { getActionFamily } from 'afena-canon';

import type { MutationContext } from './context';
import type { ActionFamily, MutationSpec } from 'afena-canon';

const POLICY_VERSION = 'v1' as const;

export interface PolicyRule {
  family: ActionFamily;
  allowRoles: string[];
}

export const POLICY_RULES: readonly PolicyRule[] = [
  { family: 'field_mutation', allowRoles: ['owner', 'admin', 'member'] },
  { family: 'state_transition', allowRoles: ['owner', 'admin', 'manager'] },
  { family: 'ownership', allowRoles: ['owner', 'admin'] },
  { family: 'lifecycle', allowRoles: ['owner', 'admin', 'member'] },
  { family: 'annotation', allowRoles: ['owner', 'admin', 'member'] },
  { family: 'system', allowRoles: ['system'] },
] as const;

export interface AuthoritySnapshot {
  policyVersion: string;
  actionFamily: ActionFamily;
  decision: 'allow' | 'deny';
  matchedRule: PolicyRule | null;
  actor: { orgId: string; userId: string; roles: string[]; rawRoles: string[] };
}

function normalizeRoles(input: unknown): string[] {
  const arr = Array.isArray(input) ? input : [];
  const norm = arr
    .map((r) => (typeof r === 'string' ? r.trim().toLowerCase() : ''))
    .filter(Boolean);
  return Array.from(new Set(norm));
}

/**
 * RBAC hard gate — INVARIANT-07.
 * Evaluates the actor's roles against the action family derived from the mutation spec.
 * Throws with code 'POLICY_DENIED' if the actor lacks a required role.
 * Returns an authority snapshot for audit trail evidence.
 */
export function enforcePolicy(
  spec: MutationSpec,
  ctx: MutationContext,
): { authoritySnapshot: AuthoritySnapshot } {
  const actionFamily = getActionFamily(spec.actionType) ?? 'system';
  const roles = normalizeRoles(ctx.actor.roles);
  const rule = POLICY_RULES.find((r) => r.family === actionFamily);

  const allowed = !!rule && roles.some((r) => rule.allowRoles.includes(r));

  const authoritySnapshot: AuthoritySnapshot = {
    policyVersion: POLICY_VERSION,
    actionFamily,
    decision: allowed ? 'allow' : 'deny',
    matchedRule: allowed && rule ? rule : null,
    actor: {
      orgId: ctx.actor.orgId ?? '',
      userId: ctx.actor.userId ?? '',
      roles,
      rawRoles: Array.isArray(ctx.actor.roles) ? ctx.actor.roles : [],
    },
  };

  if (!allowed) {
    const message = rule
      ? `Policy denied: actionFamily=${actionFamily} requires [${rule.allowRoles.join(', ')}], actor has [${roles.join(', ')}]`
      : `Policy denied: no rule for actionFamily=${actionFamily}`;
    const err: any = new Error(message);
    err.code = 'POLICY_DENIED';
    err.authoritySnapshot = authoritySnapshot;
    throw err;
  }

  return { authoritySnapshot };
}
