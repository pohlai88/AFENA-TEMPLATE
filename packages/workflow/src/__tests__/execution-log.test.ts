/**
 * Execution Log Tests — fire-and-forget evidence writing
 *
 * Verifies:
 * 1. When rules evaluate, logging is attempted (spy on db.insert)
 * 2. Logging failure does NOT change evaluateRules result
 * 3. conditionMatched: false entries still logged
 * 4. Thrown action errors populate error field
 * 5. Skip logging when !ctx.actor.orgId
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { clearRules, registerRule } from '../registry';

import type { RuleContext, WorkflowRule } from '../types';
import type { MutationSpec } from 'afena-canon';

// ── Mock afena-database ────────────────────────────────────────
const valuesFn = vi.fn(() => Promise.resolve());
const insertFn = vi.fn(() => ({ values: valuesFn }));

vi.mock('afena-database', () => ({
  db: { insert: insertFn },
  workflowExecutions: { __table: 'workflow_executions' },
}));

// ── Helpers ────────────────────────────────────────────────────

const dummySpec: MutationSpec = {
  actionType: 'contacts.update' as any,
  entityRef: { type: 'contacts' as any, id: 'ent-1' },
  input: { name: 'Alice' },
};

const dummyCtx: RuleContext = {
  requestId: 'req-1',
  actor: { userId: 'u_1', orgId: 'org_1', roles: ['admin'] },
  channel: 'test',
};

function makeRule(overrides: Partial<WorkflowRule> = {}): WorkflowRule {
  return {
    id: 'test-rule-1',
    name: 'Test Rule',
    timing: 'before',
    entityTypes: [],
    verbs: [],
    priority: 100,
    enabled: true,
    condition: () => ({ match: true }),
    action: () => ({ ok: true }),
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────

describe('execution logging', () => {
  beforeEach(() => {
    clearRules();
    insertFn.mockClear();
    valuesFn.mockClear();
    valuesFn.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    clearRules();
  });

  it('attempts to log when rules evaluate', async () => {
    registerRule(makeRule());

    const { evaluateRules } = await import('../engine');
    await evaluateRules('before', dummySpec, null, dummyCtx);

    expect(insertFn).toHaveBeenCalledTimes(1);
    expect(valuesFn).toHaveBeenCalledTimes(1);

    const calls = valuesFn.mock.calls as unknown as unknown[][];
    const logEntries = calls[0]![0] as any[];
    expect(logEntries).toHaveLength(1);
    expect(logEntries[0]).toMatchObject({
      orgId: 'org_1',
      ruleId: 'test-rule-1',
      ruleName: 'Test Rule',
      timing: 'before',
      entityType: 'contacts',
      actionType: 'contacts.update',
      conditionMatched: true,
    });
  });

  it('logging failure does NOT change evaluateRules result', async () => {
    registerRule(makeRule());
    valuesFn.mockImplementationOnce(() => Promise.reject(new Error('DB down')));

    const { evaluateRules } = await import('../engine');
    const result = await evaluateRules('before', dummySpec, null, dummyCtx);

    expect(result.proceed).toBe(true);
    expect(result.log).toHaveLength(1);
  });

  it('logs conditionMatched: false entries', async () => {
    registerRule(makeRule({
      condition: () => ({ match: false, reason: 'nope' }),
    }));

    const { evaluateRules } = await import('../engine');
    await evaluateRules('before', dummySpec, null, dummyCtx);

    expect(valuesFn).toHaveBeenCalledTimes(1);
    const calls = valuesFn.mock.calls as unknown as unknown[][];
    const logEntries = calls[0]![0] as any[];
    expect(logEntries[0]).toMatchObject({
      conditionMatched: false,
    });
  });

  it('populates error field when action throws', async () => {
    registerRule(makeRule({
      action: () => { throw new Error('boom'); },
    }));

    const { evaluateRules } = await import('../engine');
    const result = await evaluateRules('before', dummySpec, null, dummyCtx);

    expect(result.proceed).toBe(false);
    expect(valuesFn).toHaveBeenCalledTimes(1);
    const calls = valuesFn.mock.calls as unknown as unknown[][];
    const logEntries = calls[0]![0] as any[];
    expect(logEntries[0]).toMatchObject({
      error: 'boom',
      conditionMatched: true,
    });
  });

  it('skips logging when ctx.actor.orgId is empty', async () => {
    registerRule(makeRule());

    const ctxNoOrg: RuleContext = {
      ...dummyCtx,
      actor: { userId: 'u_1', orgId: '', roles: ['admin'] },
    };

    const { evaluateRules } = await import('../engine');
    await evaluateRules('before', dummySpec, null, ctxNoOrg);

    expect(insertFn).not.toHaveBeenCalled();
  });
});
