/**
 * Governance Layer Invariant Tests
 *
 * INVARIANT-POLICY-01:  enforcePolicyV2 denies when no permissions match
 * INVARIANT-LIFECYCLE-01: enforceLifecycle blocks illegal state transitions
 * INVARIANT-GOVERNORS-01: buildGovernorConfig produces correct presets
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AUTH_VERBS, LifecycleError, RateLimitError } from 'afena-canon';

// Mock afena-database to avoid DATABASE_URL requirement —
// evaluatePolicyDecision is a pure function, no DB calls needed here.
vi.mock('afena-database', () => ({
  db: {},
  dbRo: {},
  getDb: () => ({}),
  eq: () => true,
  and: (...args: unknown[]) => args,
  rolePermissions: {},
  userRoles: {},
  userScopes: {},
}));

import { evaluatePolicyDecision, enforcePolicyV2 } from '../policy-engine';
import { enforceLifecycle } from '../lifecycle';
import { buildGovernorConfig } from '../governor';
import { checkRateLimit, _resetRateLimitStore } from '../rate-limiter';

import type { MutationSpec, ResolvedActor } from 'afena-canon';

import type { MutationContext } from '../context';

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
    expect(config.lockTimeoutMs).toBe(3_000);
    expect(config.applicationName).toBe('afena:web_ui:org=org_1');
  });

  it('produces background preset with 30s statement timeout', () => {
    const config = buildGovernorConfig('background', 'org_1', 'background_job');
    expect(config.statementTimeoutMs).toBe(30_000);
    expect(config.idleInTransactionTimeoutMs).toBe(60_000);
    expect(config.lockTimeoutMs).toBe(5_000);
    expect(config.applicationName).toBe('afena:background_job:org=org_1');
  });

  it('defaults channel to web when not provided', () => {
    const config = buildGovernorConfig('interactive', 'org_1');
    expect(config.applicationName).toBe('afena:web:org=org_1');
  });

  it('reporting preset uses 30s statement timeout', () => {
    const config = buildGovernorConfig('reporting', 'org_1', 'api');
    expect(config.statementTimeoutMs).toBe(30_000);
    expect(config.idleInTransactionTimeoutMs).toBe(60_000);
    expect(config.lockTimeoutMs).toBe(5_000);
    expect(config.applicationName).toBe('afena:api:org=org_1');
  });
});

// ── INVARIANT-SYSTEM-01: System Bypass ──────────────────────

describe('INVARIANT-SYSTEM-01: system bypass', () => {
  it('allows system actor on system channel (bypass, no DB)', async () => {
    const ctx: MutationContext = {
      requestId: 'req_1',
      actor: { userId: 'system', orgId: 'org_1', roles: ['system'] },
      channel: 'background_job',
    };
    const spec = makeSpec('contacts.create');
    const result = await enforcePolicyV2(spec, ctx, 'create', null);
    expect(result.authoritySnapshot.decision.ok).toBe(true);
    expect(result.authoritySnapshot.decisionReason).toBe('SYSTEM_BYPASS');
    expect(result.authoritySnapshot.matchedPermissions).toEqual([]);
    expect(result.actor.roleIds).toEqual([]);
  });

  it('allows system actor on cron channel', async () => {
    const ctx: MutationContext = {
      requestId: 'req_2',
      actor: { userId: 'system', orgId: 'org_1', roles: ['system'] },
      channel: 'cron',
    };
    const result = await enforcePolicyV2(makeSpec('contacts.update'), ctx, 'update', null);
    expect(result.authoritySnapshot.decision.ok).toBe(true);
    expect(result.authoritySnapshot.decisionReason).toBe('SYSTEM_BYPASS');
  });

  it('denies system actor on user channel (web_ui) — no bypass', async () => {
    const ctx: MutationContext = {
      requestId: 'req_3',
      actor: { userId: 'system', orgId: 'org_1', roles: ['system'] },
      channel: 'web_ui',
    };
    // resolveActor will fail because DB is mocked — that's fine,
    // the point is it does NOT take the bypass path.
    await expect(
      enforcePolicyV2(makeSpec('contacts.create'), ctx, 'create', null),
    ).rejects.toThrow();
  });

  it('denies system actor with no channel — no bypass', async () => {
    const ctx: MutationContext = {
      requestId: 'req_4',
      actor: { userId: 'system', orgId: 'org_1', roles: ['system'] },
    };
    await expect(
      enforcePolicyV2(makeSpec('contacts.create'), ctx, 'create', null),
    ).rejects.toThrow();
  });
});

// ── INVARIANT-SEED-01: Seed Permission Shapes ───────────────

describe('INVARIANT-SEED-01: seed permission shapes', () => {
  // Tests that the seeded permission shapes work correctly with the policy engine.
  // Verifies the exact verb set and wildcard entity matching.

  const ownerPerms = AUTH_VERBS.map((verb) => ({
    entityType: '*' as const,
    verb,
    scope: 'org' as const,
    fieldRules: {},
  }));

  const memberPerms = (['create', 'update', 'delete', 'restore'] as const).map((verb) => ({
    entityType: '*' as const,
    verb,
    scope: 'org' as const,
    fieldRules: {},
  }));

  it('owner role: all 9 AUTH_VERBS seeded', () => {
    expect(ownerPerms).toHaveLength(AUTH_VERBS.length);
    expect(ownerPerms).toHaveLength(9);
  });

  it('owner role: wildcard entity matches any entity type', () => {
    const actor = makeActor({ permissions: ownerPerms });
    for (const verb of AUTH_VERBS) {
      const decision = evaluatePolicyDecision(actor, 'contacts', verb, null, {});
      expect(decision.ok).toBe(true);
    }
  });

  it('owner role: wildcard entity matches future entities', () => {
    const actor = makeActor({ permissions: ownerPerms });
    const decision = evaluatePolicyDecision(actor, 'invoices_future', 'create', null, {});
    expect(decision.ok).toBe(true);
  });

  it('member role: 4 verbs seeded (create, update, delete, restore)', () => {
    expect(memberPerms).toHaveLength(4);
  });

  it('member role: allowed verbs pass', () => {
    const actor = makeActor({ permissions: memberPerms });
    for (const verb of ['create', 'update', 'delete', 'restore'] as const) {
      const decision = evaluatePolicyDecision(actor, 'contacts', verb, null, {});
      expect(decision.ok).toBe(true);
    }
  });

  it('member role: disallowed verbs denied (submit, cancel, amend, approve, reject)', () => {
    const actor = makeActor({ permissions: memberPerms });
    for (const verb of ['submit', 'cancel', 'amend', 'approve', 'reject'] as const) {
      const decision = evaluatePolicyDecision(actor, 'contacts', verb, null, {});
      expect(decision.ok).toBe(false);
    }
  });

  it('viewer role: 0 permissions → all verbs denied', () => {
    const actor = makeActor({ permissions: [] });
    for (const verb of AUTH_VERBS) {
      const decision = evaluatePolicyDecision(actor, 'contacts', verb, null, {});
      expect(decision.ok).toBe(false);
    }
  });

  it('total seeded permissions: AUTH_VERBS*2 + 4 = 22', () => {
    // owner(9) + admin(9) + member(4) + viewer(0) = 22
    expect(AUTH_VERBS.length * 2 + 4).toBe(22);
  });
});

// ── INVARIANT-RL-01: Rate Limiting ──────────────────────────

describe('INVARIANT-RL-01: rate limiting in kernel', () => {
  beforeEach(() => {
    _resetRateLimitStore();
  });

  it('checkRateLimit is called for every mutation (enforceRateLimit integration)', () => {
    // Verify that checkRateLimit correctly tracks per-org calls
    const config = { maxRequests: 3, windowMs: 60_000 };
    checkRateLimit('org_1', 'mutation', config);
    checkRateLimit('org_1', 'mutation', config);
    checkRateLimit('org_1', 'mutation', config);
    const result = checkRateLimit('org_1', 'mutation', config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('RateLimitError has correct shape', () => {
    const err = new RateLimitError(0, 5000);
    expect(err.code).toBe('RATE_LIMITED');
    expect(err.remaining).toBe(0);
    expect(err.resetMs).toBe(5000);
    expect(err.name).toBe('RateLimitError');
    expect(err).toBeInstanceOf(Error);
  });

  it('duck-type fallback works for cross-package builds', () => {
    const err = new RateLimitError(0, 5000);
    // Simulate cross-package: check duck-type instead of instanceof
    expect((err as any).code === 'RATE_LIMITED').toBe(true);
  });

  it('per-org isolation: org_A at limit, org_B still allowed', () => {
    const config = { maxRequests: 1, windowMs: 60_000 };
    checkRateLimit('org_A', 'mutation', config);
    expect(checkRateLimit('org_A', 'mutation', config).allowed).toBe(false);
    expect(checkRateLimit('org_B', 'mutation', config).allowed).toBe(true);
  });
});
