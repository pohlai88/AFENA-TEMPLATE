import {
  actorHasRole,
  allOf,
  always,
  anyOf,
  fieldChanged,
  fieldEquals,
  never,
} from './conditions';

import type { ActionFn, ActionResult, ConditionFn, RuleContext } from './types';
import type { MutationSpec } from 'afena-canon';

function mustObject(x: unknown, msg: string): Record<string, unknown> {
  if (!x || typeof x !== 'object' || Array.isArray(x)) throw new Error(msg);
  return x as Record<string, unknown>;
}

/**
 * Parse a JSON condition definition into a ConditionFn.
 * Reuses built-in condition helpers from conditions.ts.
 * Throws on unknown types (no silent fallback).
 */
export function interpretCondition(json: unknown): ConditionFn {
  const o = mustObject(json, 'Invalid condition JSON: expected object');
  switch (o.type) {
    case 'always':
      return always;
    case 'never':
      return never;
    case 'fieldEquals':
      if (!o.field || typeof o.field !== 'string') throw new Error('condition fieldEquals: missing field');
      return fieldEquals(o.field, o.value);
    case 'fieldChanged':
      if (!o.field || typeof o.field !== 'string') throw new Error('condition fieldChanged: missing field');
      return fieldChanged(o.field);
    case 'actorHasRole':
      if (!o.role || typeof o.role !== 'string') throw new Error('condition actorHasRole: missing role');
      return actorHasRole(o.role);
    case 'allOf': {
      if (!Array.isArray(o.conditions))
        throw new Error('condition allOf: conditions must be array');
      return allOf(...o.conditions.map(interpretCondition));
    }
    case 'anyOf': {
      if (!Array.isArray(o.conditions))
        throw new Error('condition anyOf: conditions must be array');
      return anyOf(...o.conditions.map(interpretCondition));
    }
    default:
      throw new Error(`Unknown condition type: ${String(o.type)}`);
  }
}

/**
 * Parse a JSON action definition into an ActionFn.
 * ActionFn signature: (spec, entity, ctx) => ActionResult
 * Throws on unknown types (no silent fallback).
 */
export function interpretAction(json: unknown): ActionFn {
  const o = mustObject(json, 'Invalid action JSON: expected object');
  switch (o.type) {
    case 'enrichInput': {
      const fields = mustObject(
        o.fields ?? {},
        'action enrichInput: fields must be object',
      );
      return (
        _spec: MutationSpec,
        _entity: Record<string, unknown> | null,
        _ctx: RuleContext,
      ): ActionResult => ({ ok: true, enrichedInput: fields });
    }
    case 'setField': {
      if (!o.field || typeof o.field !== 'string') throw new Error('action setField: missing field');
      const field = o.field;
      return (
        _spec: MutationSpec,
        _entity: Record<string, unknown> | null,
        _ctx: RuleContext,
      ): ActionResult => ({ ok: true, enrichedInput: { [field]: o.value } });
    }
    case 'block': {
      const message = typeof o.message === 'string'
        ? o.message
        : 'Blocked by workflow rule';
      return (
        _spec: MutationSpec,
        _entity: Record<string, unknown> | null,
        _ctx: RuleContext,
      ): ActionResult => ({ ok: false, message });
    }
    default:
      throw new Error(`Unknown action type: ${String(o.type)}`);
  }
}
