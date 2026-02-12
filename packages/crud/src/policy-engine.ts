import {
  and,
  db,
  eq,
  rolePermissions,
  userRoles,
  userScopes,
} from 'afena-database';

import type { MutationContext } from './context';
import type {
  AuthoritySnapshotV2,
  AuthScope,
  AuthScopeType,
  FieldRules,
  MutationSpec,
  PolicyDecision,
  ResolvedActor,
  ResolvedPermission,
  UserScopeAssignment,
} from 'afena-canon';

/**
 * Resolve actor's full permission set from DB.
 * Queries: user_roles → roles → role_permissions + user_scopes.
 * Called once per request, before policy evaluation.
 */
export async function resolveActor(
  orgId: string,
  userId: string,
): Promise<ResolvedActor> {
  // 1. Load user's role assignments
  const userRoleRows = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .where(and(eq(userRoles.orgId, orgId), eq(userRoles.userId, userId)));

  const roleIds = userRoleRows.map((r) => r.roleId);

  if (roleIds.length === 0) {
    return { orgId, userId, roleIds: [], permissions: [], scopes: [] };
  }

  // 2. Load permissions for all of the actor's roles
  const allPermRows = await db
    .select({
      roleId: rolePermissions.roleId,
      entityType: rolePermissions.entityType,
      verb: rolePermissions.verb,
      scope: rolePermissions.scope,
      fieldRulesJson: rolePermissions.fieldRulesJson,
    })
    .from(rolePermissions)
    .where(eq(rolePermissions.orgId, orgId));

  const roleIdSet = new Set(roleIds);
  const permissions: ResolvedPermission[] = allPermRows
    .filter((r) => roleIdSet.has(r.roleId))
    .map((r) => ({
      entityType: r.entityType,
      verb: r.verb as ResolvedPermission['verb'],
      scope: r.scope as AuthScope,
      fieldRules: parseFieldRules(r.fieldRulesJson),
    }));

  // 3. Load user scopes
  const scopeRows = await db
    .select({
      scopeType: userScopes.scopeType,
      scopeId: userScopes.scopeId,
    })
    .from(userScopes)
    .where(and(eq(userScopes.orgId, orgId), eq(userScopes.userId, userId)));

  const scopes: UserScopeAssignment[] = scopeRows.map((r) => ({
    scopeType: r.scopeType as AuthScopeType,
    scopeId: r.scopeId,
  }));

  return { orgId, userId, roleIds, permissions, scopes };
}

/**
 * Evaluate policy for a mutation against the resolved actor.
 *
 * Pipeline order (from spec §A4):
 *   1. Check verb permission exists for entity type
 *   2. Check scope (Option A: explicit columns)
 *   3. Check field rules (deny_write beats allow_write)
 *   4. Return PolicyDecision
 */
export function evaluatePolicyDecision(
  actor: ResolvedActor,
  entityType: string,
  verb: string,
  existingRow: Record<string, unknown> | null,
  inputPatch: Record<string, unknown> | null,
): PolicyDecision {
  // 1. Find matching permissions (any role granting this verb on this entity)
  const matching = actor.permissions.filter(
    (p) => p.entityType === entityType && p.verb === verb,
  );

  if (matching.length === 0) {
    return { ok: false, reason: 'DENY_VERB' };
  }

  // 2. Check scope — at least one permission's scope must pass
  const scopePassed = matching.some((p) =>
    checkScope(p.scope, actor, existingRow),
  );

  if (!scopePassed) {
    return { ok: false, reason: 'DENY_SCOPE' };
  }

  // 3. Merge field rules from all matching+scope-passing permissions
  const passedPerms = matching.filter((p) =>
    checkScope(p.scope, actor, existingRow),
  );
  const merged = mergeFieldRules(passedPerms.map((p) => p.fieldRules));

  // 4. Check field rules against input patch
  if (inputPatch && merged.deny_write && merged.deny_write.length > 0) {
    const inputKeys = Object.keys(inputPatch);
    const denied = inputKeys.filter((k) => merged.deny_write!.includes(k));
    if (denied.length > 0) {
      return { ok: false, reason: 'DENY_FIELD' };
    }
  }

  return {
    ok: true,
    allowWriteFields: merged.allow_write,
    denyWriteFields: merged.deny_write,
  };
}

/**
 * Check scope against existing row (Option A: explicit columns).
 * If entity doesn't have the required column, scope behaves as 'org'.
 */
function checkScope(
  scope: AuthScope,
  actor: ResolvedActor,
  existingRow: Record<string, unknown> | null,
): boolean {
  switch (scope) {
    case 'org':
      return true;

    case 'self': {
      if (!existingRow) return true; // create — no existing row to check
      const ownerId =
        existingRow.owner_user_id ?? existingRow.ownerUserId ??
        existingRow.created_by ?? existingRow.createdBy;
      if (!ownerId) return true; // no owner column → behaves as org
      return ownerId === actor.userId;
    }

    case 'company': {
      if (!existingRow) return true;
      const companyId = existingRow.company_id ?? existingRow.companyId;
      if (!companyId) return true; // no company column → behaves as org
      return actor.scopes.some(
        (s) => s.scopeType === 'company' && s.scopeId === companyId,
      );
    }

    case 'site': {
      if (!existingRow) return true;
      const siteId = existingRow.site_id ?? existingRow.siteId;
      if (!siteId) return true; // no site column → behaves as org
      return actor.scopes.some(
        (s) => s.scopeType === 'site' && s.scopeId === siteId,
      );
    }

    case 'team':
      // Deferred — no team membership table yet. Behaves as org.
      return true;

    default:
      return false;
  }
}

/**
 * Merge field rules from multiple permissions.
 * deny_write is union (any role denying a field wins).
 * allow_write is intersection (only fields allowed by ALL roles).
 */
function mergeFieldRules(rules: FieldRules[]): FieldRules {
  const denySet = new Set<string>();
  let allowSets: Set<string>[] | null = null;

  for (const r of rules) {
    if (r.deny_write) {
      for (const f of r.deny_write) denySet.add(f);
    }
    if (r.allow_write && !r.allow_write.includes('*')) {
      const s = new Set(r.allow_write);
      if (allowSets === null) {
        allowSets = [s];
      } else {
        allowSets.push(s);
      }
    }
  }

  const deny_write = denySet.size > 0 ? Array.from(denySet) : undefined;

  let allow_write: string[] | undefined;
  if (allowSets && allowSets.length > 0) {
    // Intersection of all allow sets
    const first = allowSets[0];
    const intersection = new Set(
      [...first].filter((f) => allowSets.every((s) => s.has(f))),
    );
    allow_write = Array.from(intersection);
  }

  return { deny_write, allow_write };
}

function parseFieldRules(json: unknown): FieldRules {
  if (!json || typeof json !== 'object') return {};
  return json as FieldRules;
}

/**
 * Top-level enforcePolicy — resolves actor, evaluates decision, throws on deny.
 * Returns authority snapshot for audit trail.
 */
export async function enforcePolicyV2(
  spec: MutationSpec,
  ctx: MutationContext,
  verb: string,
  existingRow: Record<string, unknown> | null,
): Promise<{ authoritySnapshot: AuthoritySnapshotV2; actor: ResolvedActor }> {
  const actor = await resolveActor(ctx.actor.orgId, ctx.actor.userId);

  const decision = evaluatePolicyDecision(
    actor,
    spec.entityRef.type,
    verb,
    existingRow,
    typeof spec.input === 'object' && spec.input !== null && !Array.isArray(spec.input)
      ? (spec.input as Record<string, unknown>)
      : null,
  );

  const matchedPermissions = actor.permissions.filter(
    (p) => p.entityType === spec.entityRef.type && p.verb === verb,
  );

  const authoritySnapshot: AuthoritySnapshotV2 = {
    policyVersion: 'v2',
    verb,
    entityType: spec.entityRef.type,
    decision,
    actor: {
      orgId: actor.orgId,
      userId: actor.userId,
      roleIds: actor.roleIds,
    },
    matchedPermissions,
  };

  if (!decision.ok) {
    const err: any = new Error(
      `Policy denied: ${decision.reason} for ${verb} on ${spec.entityRef.type}`,
    );
    err.code = 'POLICY_DENIED';
    err.authoritySnapshot = authoritySnapshot;
    err.policyDecision = decision;
    throw err;
  }

  return { authoritySnapshot, actor };
}
