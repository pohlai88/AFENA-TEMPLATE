import { describe, expect, it } from 'vitest';

import { evaluateDsl, validateDslExpression, DslEvaluationError } from '../dsl-evaluator';
import type { DslContext } from '../dsl-evaluator';

const ctx: DslContext = {
  entity: { amount: 15000, status: 'submitted', name: 'INV-001', currency: 'USD' },
  context: { approvalCount: 2, threshold: 10000 },
  actor: { userId: 'user-1', role: 'manager' },
  tokens: {},
};

describe('validateDslExpression', () => {
  it('accepts simple property paths', () => {
    expect(validateDslExpression('entity.amount').valid).toBe(true);
  });

  it('accepts comparisons', () => {
    expect(validateDslExpression('entity.amount > 10000').valid).toBe(true);
  });

  it('rejects empty expressions', () => {
    expect(validateDslExpression('').valid).toBe(false);
  });

  it('rejects constructor access', () => {
    expect(validateDslExpression('entity.constructor').valid).toBe(false);
  });

  it('rejects __proto__', () => {
    expect(validateDslExpression('entity.__proto__').valid).toBe(false);
  });

  it('rejects eval', () => {
    expect(validateDslExpression('eval("code")').valid).toBe(false);
  });

  it('rejects Function', () => {
    expect(validateDslExpression('Function("return 1")').valid).toBe(false);
  });

  it('rejects require', () => {
    expect(validateDslExpression('require("fs")').valid).toBe(false);
  });

  it('rejects assignment', () => {
    expect(validateDslExpression('entity.amount = 0').valid).toBe(false);
  });

  it('allows == comparison (not assignment)', () => {
    expect(validateDslExpression("entity.status == 'active'").valid).toBe(true);
  });

  it('allows != comparison', () => {
    expect(validateDslExpression("entity.status != 'draft'").valid).toBe(true);
  });
});

describe('evaluateDsl — property paths', () => {
  it('resolves entity property', () => {
    const result = evaluateDsl({ expr: 'entity.amount' }, ctx);
    expect(result).toBe(15000);
  });

  it('resolves context property', () => {
    const result = evaluateDsl({ expr: 'context.approvalCount' }, ctx);
    expect(result).toBe(2);
  });

  it('resolves actor property', () => {
    const result = evaluateDsl({ expr: 'actor.role' }, ctx);
    expect(result).toBe('manager');
  });

  it('returns undefined for missing property', () => {
    const result = evaluateDsl({ expr: 'entity.nonexistent' }, ctx);
    expect(result).toBeUndefined();
  });

  it('returns undefined for unknown root', () => {
    const result = evaluateDsl({ expr: 'unknown.prop' }, ctx);
    expect(result).toBeUndefined();
  });
});

describe('evaluateDsl — comparisons', () => {
  it('evaluates greater-than', () => {
    expect(evaluateDsl({ expr: 'entity.amount > 10000' }, ctx)).toBe(true);
    expect(evaluateDsl({ expr: 'entity.amount > 20000' }, ctx)).toBe(false);
  });

  it('evaluates equality', () => {
    expect(evaluateDsl({ expr: "entity.status == 'submitted'" }, ctx)).toBe(true);
    expect(evaluateDsl({ expr: "entity.status == 'draft'" }, ctx)).toBe(false);
  });

  it('evaluates inequality', () => {
    expect(evaluateDsl({ expr: "entity.status != 'draft'" }, ctx)).toBe(true);
  });

  it('evaluates logical AND', () => {
    expect(evaluateDsl({ expr: "entity.amount > 10000 && entity.status == 'submitted'" }, ctx)).toBe(true);
    expect(evaluateDsl({ expr: "entity.amount > 20000 && entity.status == 'submitted'" }, ctx)).toBe(false);
  });

  it('evaluates logical OR', () => {
    expect(evaluateDsl({ expr: "entity.amount > 20000 || entity.status == 'submitted'" }, ctx)).toBe(true);
  });
});

describe('evaluateDsl — templates', () => {
  it('interpolates entity properties', () => {
    const result = evaluateDsl({ expr: '${entity.name} - ${entity.currency}' }, ctx);
    expect(result).toBe('INV-001 - USD');
  });

  it('handles missing properties in templates', () => {
    const result = evaluateDsl({ expr: '${entity.missing}' }, ctx);
    expect(result).toBe('');
  });
});

describe('evaluateDsl — literals', () => {
  it('evaluates boolean true', () => {
    expect(evaluateDsl({ expr: 'true' }, ctx)).toBe(true);
  });

  it('evaluates boolean false', () => {
    expect(evaluateDsl({ expr: 'false' }, ctx)).toBe(false);
  });

  it('evaluates null', () => {
    expect(evaluateDsl({ expr: 'null' }, ctx)).toBeNull();
  });

  it('evaluates number', () => {
    expect(evaluateDsl({ expr: '42' }, ctx)).toBe(42);
  });

  it('evaluates quoted string', () => {
    expect(evaluateDsl({ expr: "'hello'" }, ctx)).toBe('hello');
  });
});

describe('evaluateDsl — safety', () => {
  it('throws on forbidden patterns', () => {
    expect(() => evaluateDsl({ expr: 'constructor' }, ctx)).toThrow(DslEvaluationError);
  });

  it('throws on empty expression', () => {
    expect(() => evaluateDsl({ expr: '' }, ctx)).toThrow(DslEvaluationError);
  });
});
