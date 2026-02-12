import type { AuthScope, AuthScopeType, AuthVerb } from '../enums/index';

/**
 * Policy decision object — returned by enforcePolicy().
 * No ad-hoc checks: every policy evaluation produces this typed result.
 */
export type PolicyDecision =
  | { ok: true; allowWriteFields?: string[]; denyWriteFields?: string[] }
  | { ok: false; reason: PolicyDenyReason };

export type PolicyDenyReason = 'DENY_VERB' | 'DENY_SCOPE' | 'DENY_FIELD';

/**
 * Field rules stored in role_permissions.field_rules_json.
 * deny_write beats allow_write.
 */
export interface FieldRules {
  deny_write?: string[];
  mask_read?: { field: string; mode: 'redact' | 'hash' }[];
  allow_write?: string[];
}

/**
 * Resolved actor permissions — computed once per request from DB.
 */
export interface ResolvedPermission {
  entityType: string;
  verb: AuthVerb;
  scope: AuthScope;
  fieldRules: FieldRules;
}

/**
 * User scope assignment — maps actor to company/site/team.
 */
export interface UserScopeAssignment {
  scopeType: AuthScopeType;
  scopeId: string;
}

/**
 * Full resolved actor context for policy evaluation.
 */
export interface ResolvedActor {
  orgId: string;
  userId: string;
  roleIds: string[];
  permissions: ResolvedPermission[];
  scopes: UserScopeAssignment[];
}

/**
 * Authority snapshot v2 — recorded in audit_logs for compliance.
 */
export interface AuthoritySnapshotV2 {
  policyVersion: 'v2';
  verb: string;
  entityType: string;
  decision: PolicyDecision;
  actor: {
    orgId: string;
    userId: string;
    roleIds: string[];
  };
  matchedPermissions: ResolvedPermission[];
}
