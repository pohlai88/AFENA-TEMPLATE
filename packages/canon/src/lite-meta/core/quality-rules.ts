/**
 * Quality Rules and Scoring
 *
 * Two-layer quality model:
 * - Layer 1: Executable rules (data engineering) — 8 rule types
 * - Layer 2: Business dimensions -- 5 dimensions that map to executable rules
 *
 * Invariants (locked - see canon.architecture.md §7.5):
 * Q1: Schema validation
 * Q2: Deterministic scoring
 * Q3: SQL scope rules
 */

import type { MetaQualityTier } from '../../enums/meta-quality-tier';

/**
 * Executable quality rule type
 * These are the concrete checks that can be implemented in SQL or code
 */
export type QualityRuleType =
  | 'not_null'
  | 'unique'
  | 'range'
  | 'regex'
  | 'fk_exists'
  | 'enum_set'
  | 'sum_matches_total'
  | 'debits_equal_credits';

/**
 * Business-level quality dimension
 * These map to sets of executable rules
 */
export type QualityDimension =
  | 'completeness'
  | 'validity'
  | 'uniqueness'
  | 'consistency'
  | 'accuracy';

/**
 * Quality rule
 * Specifies a check to be applied to a metadata asset
 */
export interface QualityRule {
  ruleType: QualityRuleType;
  targetAssetKey: string;
  config: Record<string, unknown>;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Collection of quality rules for an asset
 */
export interface QualityPlan {
  assetKey: string;
  rules: QualityRule[];
}

/**
 * Result of running a quality check
 */
export interface QualityCheckResult {
  rule: QualityRule;
  passed: boolean;
  failedCount?: number;
  totalCount?: number;
  checkedAt: string; // ISO 8601
}

/**
 * Map dimensions to their executable rules
 * Q1 invariant: schema validation uses this mapping
 */
export const DIMENSION_TO_RULES: Record<QualityDimension, QualityRuleType[]> = {
  completeness: ['not_null'],
  validity: ['regex', 'enum_set', 'range'],
  uniqueness: ['unique'],
  consistency: ['fk_exists', 'sum_matches_total', 'debits_equal_credits'],
  accuracy: ['range', 'regex', 'enum_set'],
};

/**
 * Compile a quality rule into executable form
 * Returns SQL template + parameters for SQL rules, validation function for in-memory rules
 *
 * Q3 invariant: Only field-level targets return SQL templates
 */
export function compileQualityRule(
  rule: QualityRule
): {
  sqlTemplate?: string;
  templateParams?: Record<string, unknown>;
  validate?: (value: unknown) => boolean;
  validate_error?: string;
} {
  switch (rule.ruleType) {
    case 'not_null':
      return {
        sqlTemplate: '{columnRef} IS NOT NULL',
        validate: (v) => v !== null && v !== undefined,
        validate_error: 'Value cannot be null',
      };

    case 'unique':
      return {
        sqlTemplate: 'COUNT(DISTINCT {columnRef}) = COUNT(*)',
        validate: (v) => v !== undefined,
      };

    case 'range': {
      const min = rule.config.min;
      const max = rule.config.max;
      return {
        sqlTemplate: '{columnRef} >= {min} AND {columnRef} <= {max}',
        templateParams: {
          min,
          max,
        },
        validate: (v: unknown) => {
          return typeof v === 'number' && v >= Number(min) && v <= Number(max);
        },
        validate_error: `Value must be between ${String(min)} and ${String(max)}`,
      };
    }

    case 'regex': {
      const pattern = rule.config.pattern;
      return {
        sqlTemplate: '{columnRef} ~ {pattern}',
        templateParams: {
          pattern,
        },
        validate: (v: unknown) => {
          const regex = new RegExp(String(pattern));
          return typeof v === 'string' && regex.test(v);
        },
        validate_error: `Value must match pattern: ${String(pattern)}`,
      };
    }

    case 'enum_set':
      return {
        sqlTemplate: '{columnRef} IN ({values})',
        templateParams: {
          values: rule.config.values,
        },
        validate: (v) => {
          const allowedValues = rule.config.values as unknown[];
          return allowedValues.includes(v);
        },
        validate_error: `Value must be one of: ${(rule.config.values as unknown[]).join(', ')}`,
      };

    case 'fk_exists':
      return {
        sqlTemplate:
          'EXISTS (SELECT 1 FROM {refTable} WHERE {refColumn} = {columnRef})',
        templateParams: {
          refTable: rule.config.refTable,
          refColumn: rule.config.refColumn,
        },
      };

    case 'sum_matches_total':
      return {
        sqlTemplate:
          'SUM({sumColumn}) = {totalColumn}',
        templateParams: {
          sumColumn: rule.config.sumColumn,
          totalColumn: rule.config.totalColumn,
        },
      };

    case 'debits_equal_credits':
      return {
        sqlTemplate:
          'SUM(CASE WHEN {typeColumn} = \'debit\' THEN {amountColumn} ELSE 0 END) = SUM(CASE WHEN {typeColumn} = \'credit\' THEN {amountColumn} ELSE 0 END)',
        templateParams: {
          typeColumn: rule.config.typeColumn,
          amountColumn: rule.config.amountColumn,
        },
      };

    default:
      // Exhaustive switch check ensures all QualityRuleType cases are handled
      return {} as never;
  }
}

/**
 * Score quality tier from a collection of check results
 * Q2 invariant: Deterministic - same results always produce same tier
 *
 * Scoring logic:
 * - All passed → 'gold'
 * - 100% pass on warnings + above → 'silver'
 * - Any failures on 'error' severity → 'bronze'
 * - Empty results → 'silver' (no data to fail on)
 */
export function scoreQualityTier(results: QualityCheckResult[]): MetaQualityTier {
  if (results.length === 0) {
    return 'silver'; // No data to judge
  }

  const errorFailures = results.filter((r) => !r.passed && r.rule.severity === 'error');
  const warningFailures = results.filter((r) => !r.passed && r.rule.severity === 'warning');

  if (errorFailures.length > 0) {
    return 'bronze'; // Any error failures → bronze
  }

  if (warningFailures.length > 0) {
    return 'silver'; // Warnings but no errors → silver
  }

  return 'gold'; // All passed → gold
}
