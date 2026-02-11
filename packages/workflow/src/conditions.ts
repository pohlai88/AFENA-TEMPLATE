import type { ConditionFn, RuleContext } from './types';
import type { MutationSpec } from 'afena-canon';

/**
 * Built-in condition helpers for common rule patterns.
 * Compose these with custom conditions to build complex rules.
 */

/** Always matches. */
export const always: ConditionFn = () => ({ match: true });

/** Never matches. */
export const never: ConditionFn = () => ({ match: false, reason: 'never' });

/** Matches when a specific field has a specific value in the input. */
export function fieldEquals(field: string, value: unknown): ConditionFn {
  return (spec: MutationSpec) => {
    const input = spec.input as Record<string, unknown> | null;
    if (!input || input[field] !== value) {
      return { match: false, reason: `${field} !== ${String(value)}` };
    }
    return { match: true };
  };
}

/** Matches when a specific field changed (comparing entity before vs input). */
export function fieldChanged(field: string): ConditionFn {
  return (spec: MutationSpec, entity: Record<string, unknown> | null) => {
    if (!entity) return { match: false, reason: 'no entity (create)' };
    const input = spec.input as Record<string, unknown> | null;
    if (!input || !(field in input)) {
      return { match: false, reason: `${field} not in input` };
    }
    if (entity[field] === input[field]) {
      return { match: false, reason: `${field} unchanged` };
    }
    return { match: true };
  };
}

/** Matches when the actor has a specific role. */
export function actorHasRole(role: string): ConditionFn {
  return (_spec: MutationSpec, _entity: Record<string, unknown> | null, ctx: RuleContext) => {
    if (ctx.actor.roles?.includes(role)) {
      return { match: true };
    }
    return { match: false, reason: `actor missing role '${role}'` };
  };
}

/** Combines multiple conditions with AND logic. All must match. */
export function allOf(...conditions: ConditionFn[]): ConditionFn {
  return async (spec, entity, ctx) => {
    for (const cond of conditions) {
      const result = await cond(spec, entity, ctx);
      if (!result.match) return result;
    }
    return { match: true };
  };
}

/** Combines multiple conditions with OR logic. At least one must match. */
export function anyOf(...conditions: ConditionFn[]): ConditionFn {
  return async (spec, entity, ctx) => {
    const reasons: string[] = [];
    for (const cond of conditions) {
      const result = await cond(spec, entity, ctx);
      if (result.match) return { match: true };
      if (!result.match) reasons.push((result as { match: false; reason: string }).reason);
    }
    return { match: false, reason: reasons.join('; ') };
  };
}
