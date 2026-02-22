import { validateDslSafety } from './dsl-safety';

import type { DslExpression } from './types';

/**
 * DSL Evaluator — typed expression evaluation with safety constraints.
 *
 * The DSL is intentionally limited (no arbitrary JS execution):
 * - Property access: `entity.amount`, `context.approvalCount`
 * - Comparisons: `>`, `<`, `>=`, `<=`, `==`, `!=`
 * - Logical: `&&`, `||`, `!`
 * - Arithmetic: `+`, `-`, `*`, `/`
 * - String interpolation: `${entity.name}`
 * - Literals: numbers, strings, booleans, null
 *
 * Security: No function calls, no assignment, no prototype access,
 * no constructor access, no eval/Function.
 */

// ── Safety ──────────────────────────────────────────────────

const FORBIDDEN_PATTERNS = [
  /\bconstructor\b/,
  /\b__proto__\b/,
  /\bprototype\b/,
  /\beval\b/,
  /\bFunction\b/,
  /\bimport\b/,
  /\brequire\b/,
  /\bprocess\b/,
  /\bglobal\b/,
  /\bwindow\b/,
  /\bdocument\b/,
  /\bfetch\b/,
  /\bsetTimeout\b/,
  /\bsetInterval\b/,
  /\bPromise\b/,
  /\basync\b/,
  /\bawait\b/,
  /\byield\b/,
  /\bdelete\b/,
  /\bvoid\b/,
  /\btypeof\b/,
  /\binstanceof\b/,
  /\bnew\b/,
  /\bthrow\b/,
  /\btry\b/,
  /\bcatch\b/,
  /\bfinally\b/,
  /\bwhile\b/,
  /\bfor\b/,
  /\bdo\b/,
  /\bswitch\b/,
  /\bcase\b/,
  /\bbreak\b/,
  /\bcontinue\b/,
  /\breturn\b/,
  /\bclass\b/,
  /\bextends\b/,
  /\bsuper\b/,
  /\bwith\b/,
  /\blet\b/,
  /\bconst\b/,
  /\bvar\b/,
];

export class DslEvaluationError extends Error {
  constructor(
    message: string,
    public readonly expression: string,
  ) {
    super(message);
    this.name = 'DslEvaluationError';
  }
}

/**
 * Validate a DSL expression for safety before evaluation.
 */
export function validateDslExpression(expr: string): { valid: boolean; error?: string } {
  if (!expr || expr.trim().length === 0) {
    return { valid: false, error: 'Expression is empty' };
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(expr)) {
      return { valid: false, error: `Forbidden pattern detected: ${pattern.source}` };
    }
  }

  // Check for assignment operators (but allow == and !=)
  if (/(?<![!=<>])=(?!=)/.test(expr)) {
    return { valid: false, error: 'Assignment operators are not allowed in DSL expressions' };
  }

  // Compile-time safety constraints (PRD §1046-1055)
  const safety = validateDslSafety(expr);
  if (!safety.valid) {
    return { valid: false, error: safety.errors.join('; ') };
  }

  return { valid: true };
}

// ── Helpers ────────────────────────────────────────────────

/** Validate property path (e.g. entity.a.b) without ReDoS-prone regex. */
function isValidPropertyPath(expr: string): boolean {
  const parts = expr.split('.');
  if (parts.length === 0) return false;
  const identRe = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  for (const p of parts) {
    if (!identRe.test(p)) return false;
  }
  return true;
}

// ── Evaluation Context ──────────────────────────────────────

export interface DslContext {
  entity: Record<string, unknown>;
  context: Record<string, unknown>;
  actor: Record<string, unknown>;
  tokens: Record<string, unknown>;
}

/**
 * Evaluate a DSL expression against a context.
 *
 * Supports:
 * - Dot-notation property access: `entity.amount`
 * - Comparisons: `entity.amount > 10000`
 * - Logical operators: `entity.status == 'active' && entity.amount > 0`
 * - Template strings: `${entity.name} - ${entity.id}`
 */
export function evaluateDsl(
  expression: DslExpression,
  dslContext: DslContext,
): unknown {
  const { expr } = expression;

  // Safety check
  const validation = validateDslExpression(expr);
  if (!validation.valid) {
    throw new DslEvaluationError(validation.error ?? 'Invalid expression', expr);
  }

  // Literal values (check before property paths — true/false/null match the path regex)
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'null') return null;
  const numVal = Number(expr);
  if (!Number.isNaN(numVal) && /^\d/.test(expr)) return numVal;

  // String literal (quoted)
  const stringMatch = /^['"](.*)['"]$/.exec(expr);
  if (stringMatch) return stringMatch[1];

  // Check if it's a simple property path (most common case)
  // Use split+validate to avoid ReDoS from nested regex quantifiers
  if (isValidPropertyPath(expr)) {
    return resolvePropertyPath(expr, dslContext);
  }

  // Check if it's a template string
  if (expr.includes('${')) {
    return evaluateTemplate(expr, dslContext);
  }

  // Check if it's a comparison expression
  if (/[><=!]+/.test(expr) || /&&|\|\|/.test(expr)) {
    return evaluateComparison(expr, dslContext);
  }

  throw new DslEvaluationError(`Cannot evaluate expression: ${expr}`, expr);
}

/**
 * Resolve a dot-notation property path against the DSL context.
 */
function resolvePropertyPath(path: string, ctx: DslContext): unknown {
  const parts = path.split('.');
  const root = parts[0];

  let current: unknown;
  switch (root) {
    case 'entity':
      current = ctx.entity;
      break;
    case 'context':
      current = ctx.context;
      break;
    case 'actor':
      current = ctx.actor;
      break;
    case 'tokens':
      current = ctx.tokens;
      break;
    default:
      return undefined;
  }

  for (let i = 1; i < parts.length; i++) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    const part = parts[i];
    if (!part) return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Evaluate a template string with ${...} interpolation.
 */
function evaluateTemplate(template: string, ctx: DslContext): string {
  return template.replace(/\$\{([^}]+)\}/g, (_match, expr: string) => {
    const value = resolvePropertyPath(expr.trim(), ctx);
    if (value === null || value === undefined) return '';
    // Handle primitives directly
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    // For objects, use JSON.stringify
    return JSON.stringify(value);
  });
}

/**
 * Evaluate a simple comparison expression.
 * Supports: ==, !=, >, <, >=, <=, &&, ||
 */
function evaluateComparison(expr: string, ctx: DslContext): boolean {
  // Handle logical operators (split on && and ||)
  if (expr.includes('&&')) {
    const parts = expr.split('&&').map((p) => p.trim());
    return parts.every((part) => Boolean(evaluateComparison(part, ctx)));
  }

  if (expr.includes('||')) {
    const parts = expr.split('||').map((p) => p.trim());
    return parts.some((part) => Boolean(evaluateComparison(part, ctx)));
  }

  // Handle negation
  if (expr.startsWith('!')) {
    return !evaluateComparison(expr.slice(1).trim(), ctx);
  }

  // Parse comparison operators
  const operators = ['>=', '<=', '!=', '==', '>', '<'] as const;
  for (const op of operators) {
    const idx = expr.indexOf(op);
    if (idx !== -1) {
      const left = resolveValue(expr.slice(0, idx).trim(), ctx);
      const right = resolveValue(expr.slice(idx + op.length).trim(), ctx);
      return compareValues(left, right, op);
    }
  }

  // Truthy check
  const value = resolveValue(expr.trim(), ctx);
  return Boolean(value);
}

/**
 * Resolve a value — either a property path or a literal.
 */
function resolveValue(token: string, ctx: DslContext): unknown {
  // String literal
  const stringMatch = /^['"](.*)['"]$/.exec(token);
  if (stringMatch) return stringMatch[1];

  // Number literal
  const numVal = Number(token);
  if (!Number.isNaN(numVal) && token.length > 0) return numVal;

  // Boolean literals (eslint-disable: not comparing secrets, literal parsing only)
  /* eslint-disable security/detect-possible-timing-attacks */
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === 'null') return null;
  /* eslint-enable security/detect-possible-timing-attacks */

  // Property path
  return resolvePropertyPath(token, ctx);
}

/**
 * Compare two values with the given operator.
 */
function compareValues(left: unknown, right: unknown, op: string): boolean {
  switch (op) {
    case '==':
      return left === right;
    case '!=':
      return left !== right;
    case '>':
      return Number(left) > Number(right);
    case '<':
      return Number(left) < Number(right);
    case '>=':
      return Number(left) >= Number(right);
    case '<=':
      return Number(left) <= Number(right);
    default:
      return false;
  }
}
