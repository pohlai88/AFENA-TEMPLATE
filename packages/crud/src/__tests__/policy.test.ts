/**
 * Policy Engine Tests — INVARIANT-07
 *
 * Verifies RBAC hard gate at the mutation boundary:
 * - Action family mapping via getActionFamily()
 * - Role normalization (trim, lowercase, dedupe, filter empty)
 * - Allow/deny decisions per family
 * - Authority snapshot structure
 * - Default-deny for unknown families and missing roles
 */

import { describe, it, expect } from 'vitest';

import { enforcePolicy } from '../policy';

import type { MutationContext } from '../context';
import type { MutationSpec } from 'afena-canon';

function ctx(roles: string[]): MutationContext {
  return {
    requestId: 'req-test',
    actor: { userId: 'u_1', orgId: 'org_1', roles },
    channel: 'test',
  };
}

function spec(actionType: string): MutationSpec {
  return {
    actionType: actionType as any,
    entityRef: { type: actionType.split('.')[0] as any },
    input: {},
  };
}

describe('enforcePolicy', () => {
  it('allows member for field_mutation (contacts.update)', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.update'), ctx(['member']));
    expect(authoritySnapshot.decision).toBe('allow');
    expect(authoritySnapshot.actionFamily).toBe('field_mutation');
  });

  it('denies viewer for field_mutation', () => {
    expect(() => enforcePolicy(spec('contacts.update'), ctx(['viewer']))).toThrow();
    try {
      enforcePolicy(spec('contacts.update'), ctx(['viewer']));
    } catch (e: any) {
      expect(e.code).toBe('POLICY_DENIED');
    }
  });

  it('allows admin for lifecycle (contacts.delete)', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.delete'), ctx(['admin']));
    expect(authoritySnapshot.decision).toBe('allow');
    expect(authoritySnapshot.actionFamily).toBe('lifecycle');
  });

  it('allows manager for state_transition (contacts.approve)', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.approve'), ctx(['manager']));
    expect(authoritySnapshot.decision).toBe('allow');
    expect(authoritySnapshot.actionFamily).toBe('state_transition');
  });

  it('denies member for ownership (contacts.reassign)', () => {
    expect(() => enforcePolicy(spec('contacts.reassign'), ctx(['member']))).toThrow();
    try {
      enforcePolicy(spec('contacts.reassign'), ctx(['member']));
    } catch (e: any) {
      expect(e.code).toBe('POLICY_DENIED');
      expect(e.authoritySnapshot.actionFamily).toBe('ownership');
    }
  });

  it('denies member for system actions (unknown verb fallback)', () => {
    expect(() => enforcePolicy(spec('contacts.weirdVerb'), ctx(['member']))).toThrow();
    try {
      enforcePolicy(spec('contacts.weirdVerb'), ctx(['member']));
    } catch (e: any) {
      expect(e.code).toBe('POLICY_DENIED');
      expect(e.authoritySnapshot.actionFamily).toBe('system');
    }
  });

  it('returns authoritySnapshot with policyVersion and decision', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.update'), ctx(['member']));
    expect(authoritySnapshot.policyVersion).toBe('v1');
    expect(authoritySnapshot.decision).toBe('allow');
    expect(authoritySnapshot.matchedRule).toBeTruthy();
    expect(authoritySnapshot.actor.orgId).toBe('org_1');
    expect(authoritySnapshot.actor.userId).toBe('u_1');
  });

  it('stores rawRoles (original casing) in snapshot', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.update'), ctx([' Admin ', 'MEMBER']));
    expect(authoritySnapshot.actor.roles).toEqual(['admin', 'member']);
    expect(authoritySnapshot.actor.rawRoles).toEqual([' Admin ', 'MEMBER']);
  });

  it('normalizes roles (trim, lowercase, dedupe, filter empty)', () => {
    const { authoritySnapshot } = enforcePolicy(spec('contacts.update'), ctx([' Admin ', 'MEMBER', '']));
    expect(authoritySnapshot.decision).toBe('allow');
    expect(authoritySnapshot.actor.roles).toEqual(['admin', 'member']);
  });

  it('denies when no roles provided', () => {
    expect(() => enforcePolicy(spec('contacts.update'), ctx([]))).toThrow();
    try {
      enforcePolicy(spec('contacts.update'), ctx([]));
    } catch (e: any) {
      expect(e.code).toBe('POLICY_DENIED');
      expect(e.authoritySnapshot.decision).toBe('deny');
    }
  });

  it('attaches authoritySnapshot to thrown error on deny', () => {
    try {
      enforcePolicy(spec('contacts.update'), ctx(['viewer']));
    } catch (e: any) {
      expect(e.authoritySnapshot).toBeDefined();
      expect(e.authoritySnapshot.decision).toBe('deny');
      expect(e.authoritySnapshot.matchedRule).toBeNull();
    }
  });
});
