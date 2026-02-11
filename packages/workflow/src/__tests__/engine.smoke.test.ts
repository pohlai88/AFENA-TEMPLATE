import { describe, it, expect, beforeEach } from 'vitest';

import {
  evaluateRules,
  registerRule,
  clearRules,
  always,
  never,
  fieldEquals,
  fieldChanged,
  actorHasRole,
  allOf,
  anyOf,
} from '../index';

import type { WorkflowRule, RuleContext } from '../types';
import type { MutationSpec } from 'afena-canon';

const mockSpec: MutationSpec = {
  actionType: 'contacts.create',
  entityRef: { type: 'contacts' },
  input: { name: 'John Doe', email: 'john@example.com' },
};

const mockCtx: RuleContext = {
  requestId: 'req-001',
  actor: { userId: 'user-1', orgId: 'org-1', roles: ['admin'], email: 'admin@test.com' },
  channel: 'web_ui',
};

function makeRule(overrides: Partial<WorkflowRule>): WorkflowRule {
  return {
    id: 'test-rule',
    name: 'Test Rule',
    timing: 'before',
    entityTypes: [],
    verbs: [],
    priority: 100,
    enabled: true,
    condition: always,
    action: () => ({ ok: true }),
    ...overrides,
  };
}

describe('Workflow Engine', () => {
  beforeEach(() => {
    clearRules();
  });

  describe('Rule registration', () => {
    it('registers and retrieves rules', () => {
      registerRule(makeRule({ id: 'r1', name: 'Rule 1' }));
      registerRule(makeRule({ id: 'r2', name: 'Rule 2' }));
      expect(() => registerRule(makeRule({ id: 'r1' }))).toThrow("already registered");
    });

    it('sorts rules by priority', () => {
      registerRule(makeRule({ id: 'r-low', priority: 200 }));
      registerRule(makeRule({ id: 'r-high', priority: 10 }));
      registerRule(makeRule({ id: 'r-mid', priority: 100 }));

      const result = evaluateRules('before', mockSpec, null, mockCtx);
      // Rules should execute in priority order
      return result.then((r) => {
        expect(r.log[0]!.ruleId).toBe('r-high');
        expect(r.log[1]!.ruleId).toBe('r-mid');
        expect(r.log[2]!.ruleId).toBe('r-low');
      });
    });
  });

  describe('Before-rules', () => {
    it('proceeds when no rules registered', async () => {
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(0);
    });

    it('proceeds when all rules pass', async () => {
      registerRule(makeRule({ id: 'r1', condition: always, action: () => ({ ok: true }) }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(1);
      expect(result.log[0]!.conditionMatched).toBe(true);
    });

    it('blocks when a rule action returns ok: false', async () => {
      registerRule(makeRule({
        id: 'blocker',
        condition: always,
        action: () => ({ ok: false, message: 'Blocked for testing' }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(false);
      expect(result.blockReason).toBe('Blocked for testing');
    });

    it('blocks when a rule throws (fail-safe)', async () => {
      registerRule(makeRule({
        id: 'thrower',
        condition: always,
        action: () => { throw new Error('Boom'); },
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(false);
      expect(result.blockReason).toContain('Boom');
    });

    it('skips rules whose condition does not match', async () => {
      registerRule(makeRule({
        id: 'skip-me',
        condition: never,
        action: () => ({ ok: false, message: 'Should not fire' }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log[0]!.conditionMatched).toBe(false);
    });

    it('merges enriched input from before-rules', async () => {
      registerRule(makeRule({
        id: 'enricher',
        condition: always,
        action: () => ({ ok: true, enrichedInput: { source: 'workflow' } }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.enrichedInput).toEqual({ source: 'workflow' });
    });
  });

  describe('After-rules', () => {
    it('executes after-rules without blocking', async () => {
      registerRule(makeRule({
        id: 'after-1',
        timing: 'after',
        condition: always,
        action: () => ({ ok: true }),
      }));
      const result = await evaluateRules('after', mockSpec, { name: 'John' }, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(1);
    });

    it('does not block on after-rule errors', async () => {
      registerRule(makeRule({
        id: 'after-error',
        timing: 'after',
        condition: always,
        action: () => { throw new Error('Side effect failed'); },
      }));
      const result = await evaluateRules('after', mockSpec, { name: 'John' }, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log[0]!.error).toContain('Side effect failed');
    });
  });

  describe('Entity/verb filtering', () => {
    it('filters by entity type', async () => {
      registerRule(makeRule({
        id: 'contacts-only',
        entityTypes: ['contacts'],
        condition: always,
        action: () => ({ ok: true }),
      }));
      registerRule(makeRule({
        id: 'orders-only',
        entityTypes: ['orders'],
        condition: always,
        action: () => ({ ok: false, message: 'Should not fire' }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(1);
      expect(result.log[0]!.ruleId).toBe('contacts-only');
    });

    it('filters by verb', async () => {
      registerRule(makeRule({
        id: 'create-only',
        verbs: ['create'],
        condition: always,
        action: () => ({ ok: true }),
      }));
      registerRule(makeRule({
        id: 'delete-only',
        verbs: ['delete'],
        condition: always,
        action: () => ({ ok: false, message: 'Should not fire' }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(1);
      expect(result.log[0]!.ruleId).toBe('create-only');
    });

    it('skips disabled rules', async () => {
      registerRule(makeRule({
        id: 'disabled',
        enabled: false,
        condition: always,
        action: () => ({ ok: false }),
      }));
      const result = await evaluateRules('before', mockSpec, null, mockCtx);
      expect(result.proceed).toBe(true);
      expect(result.log).toHaveLength(0);
    });
  });

  describe('Built-in conditions', () => {
    it('fieldEquals matches input field value', () => {
      const cond = fieldEquals('name', 'John Doe');
      const result = cond(mockSpec, null, mockCtx);
      expect(result).toEqual({ match: true });
    });

    it('fieldEquals rejects non-matching value', () => {
      const cond = fieldEquals('name', 'Jane');
      const result = cond(mockSpec, null, mockCtx);
      expect(result).toHaveProperty('match', false);
    });

    it('fieldChanged detects changed field', () => {
      const cond = fieldChanged('name');
      const entity = { name: 'Old Name' };
      const updateSpec: MutationSpec = {
        ...mockSpec,
        actionType: 'contacts.update',
        input: { name: 'New Name' },
      };
      const result = cond(updateSpec, entity, mockCtx);
      expect(result).toEqual({ match: true });
    });

    it('fieldChanged rejects unchanged field', () => {
      const cond = fieldChanged('name');
      const entity = { name: 'John Doe' };
      const updateSpec: MutationSpec = {
        ...mockSpec,
        actionType: 'contacts.update',
        input: { name: 'John Doe' },
      };
      const result = cond(updateSpec, entity, mockCtx);
      expect(result).toHaveProperty('match', false);
    });

    it('actorHasRole matches when role present', () => {
      const cond = actorHasRole('admin');
      const result = cond(mockSpec, null, mockCtx);
      expect(result).toEqual({ match: true });
    });

    it('actorHasRole rejects when role missing', () => {
      const cond = actorHasRole('superadmin');
      const result = cond(mockSpec, null, mockCtx);
      expect(result).toHaveProperty('match', false);
    });

    it('allOf requires all conditions to match', async () => {
      const cond = allOf(always, fieldEquals('name', 'John Doe'));
      const result = await cond(mockSpec, null, mockCtx);
      expect(result).toEqual({ match: true });
    });

    it('allOf fails if any condition fails', async () => {
      const cond = allOf(always, never);
      const result = await cond(mockSpec, null, mockCtx);
      expect(result).toHaveProperty('match', false);
    });

    it('anyOf matches if any condition matches', async () => {
      const cond = anyOf(never, always);
      const result = await cond(mockSpec, null, mockCtx);
      expect(result).toEqual({ match: true });
    });

    it('anyOf fails if all conditions fail', async () => {
      const cond = anyOf(never, never);
      const result = await cond(mockSpec, null, mockCtx);
      expect(result).toHaveProperty('match', false);
    });
  });
});
