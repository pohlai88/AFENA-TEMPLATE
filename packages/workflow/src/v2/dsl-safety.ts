/**
 * DSL Safety — compile-time safety checks for typed DSL expressions.
 *
 * Enforced at definition save/publish time (PRD §1046-1055).
 * Worker never evaluates an expression that hasn't passed these checks.
 *
 * | Limit                     | Default | Rationale                                            |
 * |---------------------------|---------|------------------------------------------------------|
 * | Max AST depth             | 10      | Prevents deeply nested boolean trees that spike CPU  |
 * | Max variable dereferences | 20      | Prevents entity.a.b.c.d.e... chains                  |
 * | Forbidden ops             | regex, string concat, loops | No heavy string ops              |
 * | Max expression length     | 500     | UX + security guard                                  |
 */

// ── Constants ────────────────────────────────────────────────

export const MAX_DSL_AST_DEPTH = 10;
export const MAX_DSL_DEREFERENCES = 20;
export const MAX_DSL_LENGTH = 500;

export const FORBIDDEN_DSL_OPS = [
  /\/.*\/[gimsuy]*/,       // regex literals
  /\.concat\s*\(/,         // string concat method
  /\.join\s*\(/,           // array join (string building)
  /\.replace\s*\(/,        // string replace
  /\.match\s*\(/,          // regex match
  /\.search\s*\(/,         // regex search
  /\.split\s*\(/,          // string split
  /\bRegExp\b/,            // RegExp constructor
  /\+\s*['"`]/,            // string concatenation via +
  /['"`]\s*\+/,            // string concatenation via +
] as const;

// ── Validation ──────────────────────────────────────────────

export interface DslSafetyResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a DSL expression against all compile-time safety constraints.
 *
 * Call this at definition save/publish time — before any expression
 * reaches the runtime evaluator.
 */
export function validateDslSafety(expr: string): DslSafetyResult {
  const errors: string[] = [];

  // 1. Max expression length
  if (expr.length > MAX_DSL_LENGTH) {
    errors.push(
      `Expression exceeds max length: ${String(expr.length)} > ${String(MAX_DSL_LENGTH)} chars`,
    );
  }

  // 2. Max variable dereferences (count dot-separated segments)
  const dereferences = countDereferences(expr);
  if (dereferences > MAX_DSL_DEREFERENCES) {
    errors.push(
      `Expression exceeds max dereferences: ${String(dereferences)} > ${String(MAX_DSL_DEREFERENCES)}`,
    );
  }

  // 3. Max AST depth (nesting depth of parentheses + logical operators)
  const depth = measureNestingDepth(expr);
  if (depth > MAX_DSL_AST_DEPTH) {
    errors.push(
      `Expression exceeds max AST depth: ${String(depth)} > ${String(MAX_DSL_AST_DEPTH)}`,
    );
  }

  // 4. Forbidden operations
  for (const pattern of FORBIDDEN_DSL_OPS) {
    if (pattern.test(expr)) {
      errors.push(`Forbidden operation detected: ${pattern.source}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Helpers ─────────────────────────────────────────────────

/**
 * Count total property dereferences in an expression.
 * Each dot-separated path segment counts as one dereference.
 * e.g. "entity.a.b.c" = 3 dereferences, "entity.x > context.y.z" = 3 dereferences total.
 * Uses character-by-character scan to avoid ReDoS from nested regex quantifiers.
 */
function countDereferences(expr: string): number {
  let total = 0;
  const len = expr.length;
  let i = 0;
  const isIdentStart = (c: string) => /[a-zA-Z_]/.test(c);
  const isIdentPart = (c: string) => /[a-zA-Z0-9_]/.test(c);

  while (i < len) {
    if (!isIdentStart(expr[i] ?? '')) {
      i++;
      continue;
    }
    let dots = 0;
    while (i < len) {
      while (i < len && isIdentPart(expr[i] ?? '')) i++;
      if (i < len && expr[i] === '.') {
        dots++;
        i++;
        if (i >= len || !isIdentStart(expr[i] ?? '')) break;
      } else break;
    }
    total += dots;
  }
  return total;
}

/**
 * Measure the maximum nesting depth of an expression.
 * Counts parentheses nesting + logical operator chains as depth levels.
 */
function measureNestingDepth(expr: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of expr) {
    if (char === '(') {
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
    } else if (char === ')') {
      currentDepth--;
    }
  }

  // Also count logical operator chains as implicit depth
  // "a && b && c && d" has depth ~3 (each && adds a level)
  const logicalChains = (expr.match(/&&|\|\|/g) ?? []).length;
  const implicitDepth = Math.ceil(logicalChains / 2);

  return Math.max(maxDepth, implicitDepth);
}
