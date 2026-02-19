/**
 * CSV Type Inference
 *
 * Infers Canon DataType from sample CSV column values.
 * Used in data discovery and migration pipelines.
 *
 * Features:
 * - Stratified sampling (head + tail + random)
 * - Low distinct value detection (enum candidates)
 * - High distinct value detection (text candidates)
 * - Mostly empty column detection
 * - Deterministic locale-independent parsing
 */

import type { DataType } from '../enums/data-types';
import { CONFIDENCE_SEMANTICS } from './postgres-types';
import { buildReasonCodes, type MappingReasonCode } from './reason-codes';
import type { MappingWarning } from './warnings';

/**
 * Sampling strategy for CSV inference
 */
export type SamplingStrategy = 'head' | 'random' | 'stratified';

/**
 * CSV inference options
 */
export interface CsvInferenceOptions {
  sampleSize?: number;
  sampleStrategy?: SamplingStrategy;
  maxDistinctSamples?: number;
  columnName?: string;
}

/**
 * Random sampling helper
 */
function sampleRandom<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  while (result.length < count && result.length < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      const item = arr[idx];
      if (item !== undefined) {
        result.push(item);
      }
    }
  }
  return result;
}

/**
 * Infer Canon DataType from a sample of CSV column values
 *
 * Strategy:
 * 1. Stratified sampling (head + tail + random)
 * 2. Early rejection for mostly empty columns
 * 3. Low distinct values → enum/boolean candidate
 * 4. High distinct values → text candidate
 * 5. Type-specific detection (date, integer, etc.)
 * 6. Fallback to text based on average length
 */
export function inferCsvColumnType(
  values: string[],
  opts?: CsvInferenceOptions
): {
  canonType: DataType;
  confidence: number;
  reasonCodes: MappingReasonCode[];
  warnings: MappingWarning[];
  notes?: string;
} {
  const strategy = opts?.sampleStrategy ?? 'stratified';
  const maxSamples = opts?.sampleSize ?? Math.min(1000, values.length);
  const maxDistinct = opts?.maxDistinctSamples ?? 100;

  // Empty check
  if (values.length === 0) {
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
      reasonCodes: buildReasonCodes({ primary: 'LOSSY_FALLBACK', flags: ['MOSTLY_EMPTY'] }),
      warnings: [{
        code: 'MOSTLY_EMPTY',
        message: 'No values provided; defaulted to short_text',
      }],
      notes: 'No sample values provided',
    };
  }

  // Stratified sampling (bypass for small datasets to avoid missing values)
  let samples: string[];
  if (values.length <= maxSamples) {
    samples = [...values];
  } else if (strategy === 'stratified') {
    const third = Math.floor(maxSamples / 3);
    samples = [
      ...values.slice(0, third),
      ...values.slice(-third),
      ...sampleRandom(values, third),
    ];
  } else if (strategy === 'random') {
    samples = sampleRandom(values, maxSamples);
  } else {
    samples = values.slice(0, maxSamples);
  }

  // Early rejection: mostly empty
  const nonEmpty = samples.filter(s => s.trim() !== '');
  if (nonEmpty.length < samples.length * 0.1) {
    const warning: MappingWarning = {
      code: 'MOSTLY_EMPTY',
      message: `Only ${nonEmpty.length}/${samples.length} non-empty samples`,
    };
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
      reasonCodes: buildReasonCodes({ primary: 'LOSSY_FALLBACK', flags: ['MOSTLY_EMPTY'] }),
      warnings: [warning],
      notes: 'Insufficient evidence, defaulted to short_text',
    };
  }

  // Confidence adjustment for mostly-empty columns
  const emptyRatio = 1 - (nonEmpty.length / samples.length);
  const confidenceAdjust = emptyRatio > 0.5 ? 0.7 : 1.0;

  // Check distinct values
  const distinct = new Set(nonEmpty);

  // Low distinct: check boolean first (before type-specific detection)
  if (distinct.size <= 2 && distinct.size <= nonEmpty.length * 0.5 && [...distinct].every(isBoolean)) {
    return {
      canonType: 'boolean',
      confidence: 0.95 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'SEMANTIC_EQUIV', flags: ['LOW_DISTINCT_VALUES'] }),
      warnings: [],
      notes: `${distinct.size} distinct boolean values`,
    };
  }

  // Type-specific detection (order matters: most specific first)

  // ISO date (YYYY-MM-DD)
  if (nonEmpty.every(isIsoDate)) {
    return {
      canonType: 'date',
      confidence: 1.0 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'EXACT_MATCH' }),
      warnings: [],
      notes: `All ${nonEmpty.length} samples matched ISO date format`,
    };
  }

  // ISO datetime (YYYY-MM-DDTHH:mm:ssZ)
  if (nonEmpty.every(isIsoDateTime)) {
    return {
      canonType: 'datetime',
      confidence: 1.0 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'EXACT_MATCH' }),
      warnings: [],
      notes: `All ${nonEmpty.length} samples matched ISO datetime format`,
    };
  }

  // Integer
  if (nonEmpty.every(isInteger)) {
    return {
      canonType: 'integer',
      confidence: 1.0 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'EXACT_MATCH' }),
      warnings: [],
      notes: `All ${nonEmpty.length} samples are integers`,
    };
  }

  // Decimal number
  if (nonEmpty.every(isDecimal)) {
    return {
      canonType: 'decimal',
      confidence: 1.0 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'EXACT_MATCH' }),
      warnings: [],
      notes: `All ${nonEmpty.length} samples are decimal numbers`,
    };
  }

  // UUID
  if (nonEmpty.every(isUuid)) {
    return {
      canonType: 'entity_ref',
      confidence: 0.9 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'SEMANTIC_EQUIV' }),
      warnings: [],
      notes: `All ${nonEmpty.length} samples matched UUID format`,
    };
  }

  // Low distinct (after type-specific): likely enum/select
  if (distinct.size <= 10 && distinct.size <= nonEmpty.length * 0.5) {
    return {
      canonType: 'enum',
      confidence: 0.85 * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'NARROWING_WITH_METADATA', flags: ['LOW_DISTINCT_VALUES'] }),
      warnings: [],
      notes: `${distinct.size} distinct values suggest enum`,
    };
  }

  // High distinct: likely text (after type-specific checks so numeric columns aren't misclassified)
  if (distinct.size > maxDistinct) {
    const avgLength = nonEmpty.reduce((sum, s) => sum + s.length, 0) / nonEmpty.length;
    return {
      canonType: avgLength < 100 ? 'short_text' : 'long_text',
      confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'NARROWING_WITH_METADATA', flags: ['HIGH_DISTINCT_VALUES'] }),
      warnings: [],
      notes: `${distinct.size} distinct values, avg length ${Math.round(avgLength)}`,
    };
  }

  // Fallback to text based on average length
  const avgLength = nonEmpty.reduce((sum, s) => sum + s.length, 0) / nonEmpty.length;
  if (avgLength < 100) {
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA * confidenceAdjust,
      reasonCodes: buildReasonCodes({ primary: 'NARROWING_WITH_METADATA' }),
      warnings: [],
      notes: `Inferred short_text based on average sample length ${Math.round(avgLength)} chars`,
    };
  }

  // Long text (>= 100 chars average)
  return {
    canonType: 'long_text',
    confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA * confidenceAdjust,
    reasonCodes: buildReasonCodes({ primary: 'NARROWING_WITH_METADATA' }),
    warnings: [],
    notes: `Inferred long_text based on average sample length ${Math.round(avgLength)} chars`,
  };
}

// Helper functions for type detection
// All use strict patterns to avoid locale-sensitive parsing

function isIsoDate(s: string): boolean {
  // Strict pattern match only (no Date constructor for determinism)
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(s)) return false;

  // Manual validation (no Date constructor)
  const parts = s.split('-').map(Number);
  if (parts.length !== 3) return false;

  const month = parts[1];
  const day = parts[2];

  if (month === undefined || month < 1 || month > 12) return false;
  if (day === undefined || day < 1 || day > 31) return false;

  return true;
}

function isIsoDateTime(s: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})?$/;
  return pattern.test(s);
}

function isBoolean(s: string): boolean {
  const lower = s.toLowerCase().trim();
  return ['true', 'false', 'yes', 'no', '1', '0', 't', 'f'].includes(lower);
}

function isInteger(s: string): boolean {
  const trimmed = s.trim();
  return /^-?\d+$/.test(trimmed);
}

function isDecimal(s: string): boolean {
  const trimmed = s.trim();
  return /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed);
}

function isUuid(s: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return pattern.test(s.trim());
}
