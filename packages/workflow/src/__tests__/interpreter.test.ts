/**
 * Interpreter Tests — JSON → ConditionFn / ActionFn
 *
 * Verifies:
 * - Each condition type produces correct match/no-match behavior
 * - Recursive conditions (allOf containing anyOf)
 * - Each action type produces correct ActionResult with 3-arg signature
 * - Unknown types throw descriptive errors
 * - unregisterByPrefix removes only matching rules
 */

import { describe, it, expect } from 'vitest';

import { interpretAction, interpretCondition } from '../interpreter';
import {
  clearRules,
  getRegisteredRules,
  registerRule,
  unregisterByPrefix,
} from '../registry';

import type { ActionFn, RuleContext, WorkflowRule } from '../types';
import type { MutationSpec } from 'afena-canon';

const dummySpec: MutationSpec = {
  actionType: 'contacts.update' as any,
  entityRef: { type: 'contacts' as any },
  input: { name: 'Alice', status: 'active' },
};

const dummyEntity = { name: 'Bob', status: 'pending' };

const dummyCtx: RuleContext = {
  requestId: 'req-1',
  actor: { userId: 'u_1', orgId: 'org_1', roles: ['admin'] },
  channel: 'test',
};

// ── Condition Interpretation ─────────────────────────────────

describe('interpretCondition', () => {
  it('always → match: true', () => {
    const fn = interpretCondition({ type: 'always' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('never → match: false with reason', () => {
    const fn = interpretCondition({ type: 'never' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ match: false, reason: 'never' });
  });

  it('fieldEquals → matches when field equals value', () => {
    const fn = interpretCondition({ type: 'fieldEquals', field: 'name', value: 'Alice' });
    const result = fn(dummySpec, null, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('fieldEquals → no match when field differs', () => {
    const fn = interpretCondition({ type: 'fieldEquals', field: 'name', value: 'Charlie' });
    const result = fn(dummySpec, null, dummyCtx);
    expect(result).toHaveProperty('match', false);
  });

  it('fieldChanged → matches when input differs from entity', () => {
    const fn = interpretCondition({ type: 'fieldChanged', field: 'name' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('actorHasRole → matches when actor has role', () => {
    const fn = interpretCondition({ type: 'actorHasRole', role: 'admin' });
    const result = fn(dummySpec, null, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('actorHasRole → no match when actor lacks role', () => {
    const fn = interpretCondition({ type: 'actorHasRole', role: 'superadmin' });
    const result = fn(dummySpec, null, dummyCtx);
    expect(result).toHaveProperty('match', false);
  });

  it('allOf → matches when all sub-conditions match', async () => {
    const fn = interpretCondition({
      type: 'allOf',
      conditions: [
        { type: 'always' },
        { type: 'actorHasRole', role: 'admin' },
      ],
    });
    const result = await fn(dummySpec, null, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('allOf → no match when any sub-condition fails', async () => {
    const fn = interpretCondition({
      type: 'allOf',
      conditions: [
        { type: 'always' },
        { type: 'never' },
      ],
    });
    const result = await fn(dummySpec, null, dummyCtx);
    expect(result).toHaveProperty('match', false);
  });

  it('anyOf → matches when at least one sub-condition matches', async () => {
    const fn = interpretCondition({
      type: 'anyOf',
      conditions: [
        { type: 'never' },
        { type: 'always' },
      ],
    });
    const result = await fn(dummySpec, null, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('recursive: allOf containing anyOf containing fieldEquals', async () => {
    const fn = interpretCondition({
      type: 'allOf',
      conditions: [
        { type: 'actorHasRole', role: 'admin' },
        {
          type: 'anyOf',
          conditions: [
            { type: 'fieldEquals', field: 'status', value: 'active' },
            { type: 'fieldEquals', field: 'status', value: 'pending' },
          ],
        },
      ],
    });
    const result = await fn(dummySpec, null, dummyCtx);
    expect(result).toEqual({ match: true });
  });

  it('throws on unknown condition type', () => {
    expect(() => interpretCondition({ type: 'bogus' })).toThrow('Unknown condition type: bogus');
  });

  it('throws on missing field for fieldEquals', () => {
    expect(() => interpretCondition({ type: 'fieldEquals' })).toThrow('missing field');
  });

  it('throws on non-object input', () => {
    expect(() => interpretCondition('not an object')).toThrow('expected object');
  });
});

// ── Action Interpretation ────────────────────────────────────

describe('interpretAction', () => {
  it('enrichInput → returns ok with enrichedInput', () => {
    const fn = interpretAction({ type: 'enrichInput', fields: { priority: 'high' } });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ ok: true, enrichedInput: { priority: 'high' } });
  });

  it('setField → returns ok with single field enrichedInput', () => {
    const fn = interpretAction({ type: 'setField', field: 'status', value: 'approved' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ ok: true, enrichedInput: { status: 'approved' } });
  });

  it('block → returns ok: false with message', () => {
    const fn = interpretAction({ type: 'block', message: 'Not allowed' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ ok: false, message: 'Not allowed' });
  });

  it('block → uses default message when none provided', () => {
    const fn = interpretAction({ type: 'block' });
    const result = fn(dummySpec, dummyEntity, dummyCtx);
    expect(result).toEqual({ ok: false, message: 'Blocked by workflow rule' });
  });

  it('throws on unknown action type', () => {
    expect(() => interpretAction({ type: 'bogus' })).toThrow('Unknown action type: bogus');
  });

  it('throws on missing field for setField', () => {
    expect(() => interpretAction({ type: 'setField' })).toThrow('missing field');
  });

  it('throws on non-object input', () => {
    expect(() => interpretAction(42)).toThrow('expected object');
  });

  it('action functions accept 3 args (spec, entity, ctx)', () => {
    const fn: ActionFn = interpretAction({ type: 'block', message: 'test' });
    const result = fn(dummySpec, null, dummyCtx);
    expect(result).toHaveProperty('ok', false);
  });
});

// ── Registry: unregisterByPrefix ─────────────────────────────

describe('unregisterByPrefix', () => {
  const makeRule = (id: string): WorkflowRule => ({
    id,
    name: `Rule ${id}`,
    timing: 'before',
    entityTypes: [],
    verbs: [],
    priority: 100,
    enabled: true,
    condition: () => ({ match: true }),
    action: () => ({ ok: true }),
  });

  it('removes only rules matching the prefix', () => {
    clearRules();
    registerRule(makeRule('db:org1:r1'));
    registerRule(makeRule('db:org1:r2'));
    registerRule(makeRule('db:org2:r3'));
    registerRule(makeRule('static:r4'));

    const removed = unregisterByPrefix('db:org1:');
    expect(removed).toBe(2);
    expect(getRegisteredRules().map((r) => r.id)).toEqual(['db:org2:r3', 'static:r4']);
  });

  it('returns 0 when no rules match', () => {
    clearRules();
    registerRule(makeRule('static:r1'));
    const removed = unregisterByPrefix('db:org99:');
    expect(removed).toBe(0);
    expect(getRegisteredRules()).toHaveLength(1);
  });
});
