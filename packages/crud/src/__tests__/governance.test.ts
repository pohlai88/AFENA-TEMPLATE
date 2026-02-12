/**
 * Governance Layer Invariant Tests
 *
 * INVARIANT-POLICY-01:  enforcePolicyV2 denies when no permissions match
 * INVARIANT-LIFECYCLE-01: enforceLifecycle blocks illegal state transitions
 * INVARIANT-GOVERNORS-01: buildGovernorConfig produces correct presets
 */

import { describe, it, expect, vi } from 'vitest';
import { LifecycleError } from 'afena-canon';

// Mock afena-database to avoid DATABASE_URL requirement —
// evaluatePolicyDecision is a pure function, no DB calls needed here.
vi.mock('afena-database', () => ({
  db: {},
  eq: () => true,
  and: (...args: unknown[]) => args,
  rolePermissions: {},
  userRoles: {},
  userScopes: {},
}));

import { evaluatePolicyDecision } from '../policy-engine';
import { enforceLifecycle } from '../lifecycle';
import { buildGovernorConfig } from '../governor';

import type { MutationSpec } from 'afena-canon';
import type { ResolvedActor } from 'afena-canon';

// ── Helpers ─────────────────────────────────────────────────

function makeActor(overrides?: Partial<ResolvedActor>): ResolvedActor {
  return {
    orgId: 'org_1',
    userId: 'u_1',
    roleIds: ['role_1'],
    permissions: [],
    scopes: [],
    ...overrides,
  };
}

function makeSpec(actionType: string): MutationSpec {
  return {
    actionType: actionType as any,
    entityRef: { type: actionType.split('.')[0] as any },
    input: {},
  };
}

// ── INVARIANT-POLICY-01: Policy Engine ──────────────────────

describe('INVARIANT-POLICY-01: evaluatePolicyDecision', () => {
  it('denies when actor has no permissions (DENY_VERB)', () => {
    const actor = makeActor({ permissions: [] });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', null, {});
    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.reason).toBe('DENY_VERB');
    }
  });

  it('allows when actor has matching verb + org scope', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'update', scope: 'org', fieldRules: {} },
      ],
    });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', null, {});
    expect(decision.ok).toBe(true);
  });

  it('denies when verb matches but scope fails (DENY_SCOPE)', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'update', scope: 'self', fieldRules: {} },
      ],
    });
    // Existing row owned by a different user
    const existingRow = { createdBy: 'u_other' };
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', existingRow, {});
    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.reason).toBe('DENY_SCOPE');
    }
  });

  it('allows self-scope when actor owns the row', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'update', scope: 'self', fieldRules: {} },
      ],
    });
    const existingRow = { createdBy: 'u_1' };
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', existingRow, {});
    expect(decision.ok).toBe(true);
  });

  it('denies when field rules block a written field (DENY_FIELD)', () => {
    const actor = makeActor({
      permissions: [
        {
          entityType: 'contacts',
          verb: 'update',
          scope: 'org',
          fieldRules: { deny_write: ['email'] },
        },
      ],
    });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', null, { email: 'x@y.com' });
    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.reason).toBe('DENY_FIELD');
    }
  });

  it('allows when input does not touch denied fields', () => {
    const actor = makeActor({
      permissions: [
        {
          entityType: 'contacts',
          verb: 'update',
          scope: 'org',
          fieldRules: { deny_write: ['email'] },
        },
      ],
    });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', null, { name: 'Alice' });
    expect(decision.ok).toBe(true);
  });

  it('denies when entity type does not match', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'invoices', verb: 'update', scope: 'org', fieldRules: {} },
      ],
    });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', null, {});
    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.reason).toBe('DENY_VERB');
    }
  });

  it('company scope passes when actor has matching company scope', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'update', scope: 'company', fieldRules: {} },
      ],
      scopes: [{ scopeType: 'company', scopeId: 'comp_1' }],
    });
    const existingRow = { companyId: 'comp_1' };
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', existingRow, {});
    expect(decision.ok).toBe(true);
  });

  it('company scope fails when actor lacks matching company scope', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'update', scope: 'company', fieldRules: {} },
      ],
      scopes: [{ scopeType: 'company', scopeId: 'comp_2' }],
    });
    const existingRow = { companyId: 'comp_1' };
    const decision = evaluatePolicyDecision(actor, 'contacts', 'update', existingRow, {});
    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.reason).toBe('DENY_SCOPE');
    }
  });

  it('self scope passes on create (no existing row)', () => {
    const actor = makeActor({
      permissions: [
        { entityType: 'contacts', verb: 'create', scope: 'self', fieldRules: {} },
      ],
    });
    const decision = evaluatePolicyDecision(actor, 'contacts', 'create', null, {});
    expect(decision.ok).toBe(true);
  });
});

// ── INVARIANT-LIFECYCLE-01: Lifecycle Guard ─────────────────

describe('INVARIANT-LIFECYCLE-01: enforceLifecycle', () => {
  it('passes through for create (no existing row)', () => {
    expect(() => enforceLifecycle(makeSpec('contacts.create'), 'create', null)).not.toThrow();
  });

  it('passes through for non-doc entities (no doc_status)', () => {
    const existing = { id: '1', name: 'Alice' };
    expect(() => enforceLifecycle(makeSpec('contacts.update'), 'update', existing)).not.toThrow();
  });

  it('allows update on draft documents', () => {
    const existing = { id: '1', docStatus: 'draft' };
    expect(() => enforceLifecycle(makeSpec('invoices.update'), 'update', existing)).not.toThrow();
  });

  it('allows submit on draft documents', () => {
    const existing = { id: '1', docStatus: 'draft' };
    expect(() => enforceLifecycle(makeSpec('invoices.submit'), 'submit', existing)).not.toThrow();
  });

  it('blocks update on submitted documents', () => {
    const existing = { id: '1', docStatus: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.update'), 'update', existing)).toThrow(LifecycleError);
    try {
      enforceLifecycle(makeSpec('invoices.update'), 'update', existing);
    } catch (e) {
      expect(e).toBeInstanceOf(LifecycleError);
      expect((e as LifecycleError).lifecycleReason).toBe('SUBMITTED_IMMUTABLE');
    }
  });

  it('blocks delete on submitted documents', () => {
    const existing = { id: '1', docStatus: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.delete'), 'delete', existing)).toThrow(LifecycleError);
  });

  it('blocks re-submit on submitted documents', () => {
    const existing = { id: '1', docStatus: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.submit'), 'submit', existing)).toThrow(LifecycleError);
    try {
      enforceLifecycle(makeSpec('invoices.submit'), 'submit', existing);
    } catch (e) {
      expect(e).toBeInstanceOf(LifecycleError);
      expect((e as LifecycleError).lifecycleReason).toBe('ALREADY_SUBMITTED');
    }
  });

  it('allows cancel on submitted documents', () => {
    const existing = { id: '1', docStatus: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.cancel'), 'cancel', existing)).not.toThrow();
  });

  it('allows amend on submitted documents', () => {
    const existing = { id: '1', docStatus: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.amend'), 'amend', existing)).not.toThrow();
  });

  it('blocks all mutations on cancelled documents', () => {
    const existing = { id: '1', docStatus: 'cancelled' };
    expect(() => enforceLifecycle(makeSpec('invoices.update'), 'update', existing)).toThrow(LifecycleError);
    expect(() => enforceLifecycle(makeSpec('invoices.delete'), 'delete', existing)).toThrow(LifecycleError);
    expect(() => enforceLifecycle(makeSpec('invoices.submit'), 'submit', existing)).toThrow(LifecycleError);
    expect(() => enforceLifecycle(makeSpec('invoices.cancel'), 'cancel', existing)).toThrow(LifecycleError);
    try {
      enforceLifecycle(makeSpec('invoices.update'), 'update', existing);
    } catch (e) {
      expect(e).toBeInstanceOf(LifecycleError);
      expect((e as LifecycleError).lifecycleReason).toBe('CANCELLED_READ_ONLY');
    }
  });

  it('handles snake_case doc_status column', () => {
    const existing = { id: '1', doc_status: 'submitted' };
    expect(() => enforceLifecycle(makeSpec('invoices.update'), 'update', existing)).toThrow(LifecycleError);
  });
});

// ── INVARIANT-GOVERNORS-01: Governor Config ─────────────────

describe('INVARIANT-GOVERNORS-01: buildGovernorConfig', () => {
  it('produces interactive preset with 5s statement timeout', () => {
    const config = buildGovernorConfig('interactive', 'org_1', 'web_ui');
    expect(config.statementTimeoutMs).toBe(5_000);
    expect(config.idleInTransactionTimeoutMs).toBe(20_000);
    expect(config.applicationName).toBe('afena:web_ui:org=org_1');
  });

  it('produces background preset with 30s statement timeout', () => {
    const config = buildGovernorConfig('background', 'org_1', 'background_job');
    expect(config.statementTimeoutMs).toBe(30_000);
    expect(config.idleInTransactionTimeoutMs).toBe(60_000);
    expect(config.applicationName).toBe('afena:background_job:org=org_1');
  });

  it('defaults channel to web when not provided', () => {
    const config = buildGovernorConfig('interactive', 'org_1');
    expect(config.applicationName).toBe('afena:web:org=org_1');
  });

  it('reporting preset uses interactive timeouts', () => {
    const config = buildGovernorConfig('reporting', 'org_1', 'api');
    expect(config.statementTimeoutMs).toBe(5_000);
    expect(config.applicationName).toBe('afena:api:org=org_1');
  });
});
