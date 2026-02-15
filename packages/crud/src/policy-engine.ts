import { SYSTEM_ACTOR_USER_ID, isSystemChannel } from 'afena-canon';
import {
  and,
  batch,
  eq,
  getDb,
  inArray,
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
 * RTT 1: batch([user_roles, user_scopes]). RTT 2 (if roleIds non-empty): role_permissions WHERE roleId IN (...).
 * Called once per request, before policy evaluation.
 */
export async function resolveActor(
  orgId: string,
  userId: string,
): Promise<ResolvedActor> {
  const conn = getDb();

  // RTT 1: batch user_roles + user_scopes
  const [userRoleRows, scopeRows] = await batch([
    conn
      .select({ roleId: userRoles.roleId })
      .from(userRoles)
      .where(and(eq(userRoles.orgId, orgId), eq(userRoles.userId, userId))),
    conn
      .select({
        scopeType: userScopes.scopeType,
        scopeId: userScopes.scopeId,
      })
      .from(userScopes)
      .where(and(eq(userScopes.orgId, orgId), eq(userScopes.userId, userId))),
  ]);

  const roleIds = userRoleRows.map((r: { roleId: string }) => r.roleId);
  const scopes: UserScopeAssignment[] = scopeRows.map((r: { scopeType: string; scopeId: string }) => ({
    scopeType: r.scopeType as AuthScopeType,
    scopeId: r.scopeId,
  }));

  if (roleIds.length === 0) {
    return { orgId, userId, roleIds: [], permissions: [], scopes };
  }

  // RTT 2: role_permissions filtered by roleIds at SQL level
  const allPermRows = await conn
    .select({
      roleId: rolePermissions.roleId,
      entityType: rolePermissions.entityType,
      verb: rolePermissions.verb,
      scope: rolePermissions.scope,
      fieldRulesJson: rolePermissions.fieldRulesJson,
    })
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.orgId, orgId),
        inArray(rolePermissions.roleId, roleIds),
      ),
    );

  const permissions: ResolvedPermission[] = allPermRows.map((r) => ({
    entityType: r.entityType,
    verb: r.verb as ResolvedPermission['verb'],
    scope: r.scope as AuthScope,
    fieldRules: parseFieldRules(r.fieldRulesJson),
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
  // 1. Find matching permissions (entity + verb with wildcard support + scope in single pass)
  const verbMatching = actor.permissions.filter(
    (p) =>
      (p.entityType === '*' || p.entityType === entityType) &&
      (p.verb === '*' || p.verb === verb),
  );

  if (verbMatching.length === 0) {
    return { ok: false, reason: 'DENY_VERB' };
  }

  // 2. Scope check — collapsed into primary filter (wildcard entity/verb does not bypass scope)
  const matching = verbMatching.filter((p) =>
    checkScope(p.scope, actor, existingRow),
  );

  if (matching.length === 0) {
    return { ok: false, reason: 'DENY_SCOPE' };
  }

  // 3. Merge field rules from all matching+scope-passing permissions
  const merged = mergeFieldRules(matching.map((p) => p.fieldRules));

  // 4. Check field rules against input patch
  if (inputPatch && merged.deny_write && merged.deny_write.length > 0) {
    const inputKeys = Object.keys(inputPatch);
    const denyList = merged.deny_write;
    const denied = inputKeys.filter((k) => denyList.includes(k));
    if (denied.length > 0) {
      return { ok: false, reason: 'DENY_FIELD' };
    }
  }

  const result: { ok: true; allowWriteFields?: string[]; denyWriteFields?: string[] } = { ok: true };
  if (merged.allow_write) result.allowWriteFields = merged.allow_write;
  if (merged.deny_write) result.denyWriteFields = merged.deny_write;
  return result;
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
    const first = allowSets[0];
    if (first) {
      const intersection = new Set(
        [...first].filter((f) => allowSets.every((s) => s.has(f))),
      );
      allow_write = Array.from(intersection);
    }
  }

  const merged: FieldRules = {};
  if (deny_write) merged.deny_write = deny_write;
  if (allow_write) merged.allow_write = allow_write;
  return merged;
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
  // System bypass: allow all verbs when userId is system AND channel is a system channel.
  // No DB reads, no dependency on seeded roles. Background jobs work even if roles table is broken.
  if (ctx.actor.userId === SYSTEM_ACTOR_USER_ID && ctx.channel && isSystemChannel(ctx.channel)) {
    const bypassActor: ResolvedActor = {
      orgId: ctx.actor.orgId,
      userId: SYSTEM_ACTOR_USER_ID,
      roleIds: [],
      permissions: [],
      scopes: [],
    };
    const authoritySnapshot: AuthoritySnapshotV2 = {
      policyVersion: 'v2',
      verb,
      entityType: spec.entityRef.type,
      decision: { ok: true },
      decisionReason: 'SYSTEM_BYPASS',
      actor: { orgId: ctx.actor.orgId, userId: SYSTEM_ACTOR_USER_ID, roleIds: [] },
      matchedPermissions: [],
    };
    return { authoritySnapshot, actor: bypassActor };
  }

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
    (p) =>
      (p.entityType === '*' || p.entityType === spec.entityRef.type) &&
      (p.verb === '*' || p.verb === verb),
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
