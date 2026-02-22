/**
 * Column Classification
 *
 * Pattern-based classification of columns to detect PII, financial, and other sensitive data.
 * Used in migration pipelines for automated data discovery and compliance.
 *
 * Invariants (locked - see canon.architecture.md §7.6):
 * C1: Pattern matching works
 * C2: Unknown → null (no over-classification)
 */

import type { MetaClassification } from '../../enums/meta-classification';

/**
 * PII detection pattern
 */
export interface PIIPattern {
  fieldNamePattern: RegExp;
  classification: MetaClassification;
  confidence: number;
}

/**
 * Patterns used for column classification
 * C1 invariant: classifyColumn('email', []) must return pii
 */
export const PII_PATTERNS: PIIPattern[] = [
  // PII - Personally Identifiable Information
  { fieldNamePattern: /email/i, classification: 'pii', confidence: 0.95 },
  {
    fieldNamePattern: /ssn|social_security|social-security/i,
    classification: 'pii',
    confidence: 0.99,
  },
  { fieldNamePattern: /phone|mobile|tel|telephone/i, classification: 'pii', confidence: 0.9 },
  {
    fieldNamePattern: /address|street|city|zip|postal|postcode/i,
    classification: 'pii',
    confidence: 0.85,
  },
  { fieldNamePattern: /passport|identity|national_id|id_number/i, classification: 'pii', confidence: 0.99 },
  {
    fieldNamePattern: /password|secret|token|api_key|api-key|apikey/i,
    classification: 'pii',
    confidence: 0.99,
  },

  // Financial
  {
    fieldNamePattern: /salary|wage|compensation|payroll/i,
    classification: 'financial',
    confidence: 0.9,
  },
  {
    fieldNamePattern: /revenue|profit|loss|balance|margin/i,
    classification: 'financial',
    confidence: 0.85,
  },
  {
    fieldNamePattern: /credit_limit|credit-limit|creditlimit/i,
    classification: 'financial',
    confidence: 0.95,
  },
  { fieldNamePattern: /interest_rate|interest-rate/i, classification: 'financial', confidence: 0.9 },

  // Additional PII patterns
  { fieldNamePattern: /birth|dob|date of birth/i, classification: 'pii', confidence: 0.95 },
  { fieldNamePattern: /driver.?license|drivers.?license/i, classification: 'pii', confidence: 0.99 },
  { fieldNamePattern: /credit.?card|creditcard|ccn|card_number/i, classification: 'pii', confidence: 0.99 },
];

/**
 * Classify a column based on field name and optional sample values
 * Returns classification and confidence; null if no pattern matches
 *
 * C2 invariant: Unknown patterns return null (no over-classification)
 */
export function classifyColumn(
  fieldName: string,
  _sampleValues?: unknown[]
): { classification: MetaClassification; confidence: number } | null {
  if (!fieldName) return null;

  // Match field name against patterns
  for (const pattern of PII_PATTERNS) {
    if (pattern.fieldNamePattern.test(fieldName)) {
      // Additional value-based heuristics could go here
      // For now, just return pattern match

      return {
        classification: pattern.classification,
        confidence: pattern.confidence,
      };
    }
  }

  // C2 invariant: Unknown → null
  return null;
}

/**
 * Classify multiple columns at once
 * Returns a map of column name → classification
 */
export function classifyColumns(
  columns: Array<{ name: string; sampleValues?: unknown[] }>
): Map<string, { classification: MetaClassification; confidence: number }> {
  const result = new Map<string, { classification: MetaClassification; confidence: number }>();

  for (const col of columns) {
    const classification = classifyColumn(col.name, col.sampleValues);
    if (classification) {
      result.set(col.name, classification);
    }
  }

  return result;
}
