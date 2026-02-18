/**
 * CSV Type Inference
 *
 * Infers Canon DataType from sample CSV column values.
 * Used in data discovery and migration pipelines.
 */

import { CONFIDENCE_SEMANTICS } from './postgres-types';

import type { DataType } from '../enums/data-types';

/**
 * Infer Canon DataType from a sample of CSV column values
 *
 * Strategy:
 * 1. Try to match all values to a specific type
 * 2. If 100% match → return that type with confidence 1.0
 * 3. If mixed → return safe fallback (short_text) with lower confidence
 * 4. If empty → return short_text with low confidence
 */
export function inferCsvColumnType(
  values: string[],
  opts?: { sampleSize?: number }
): {
  canonType: DataType;
  confidence: number;
  notes?: string;
} {
  const sampleSize = opts?.sampleSize ?? values.length;
  const sample = values.slice(0, sampleSize);

  if (sample.length === 0) {
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.LOSSY_FALLBACK,
      notes: 'No sample values provided; defaulted to short_text',
    };
  }

  // Try each type in order of specificity
  // Most specific first, so we catch types earliest

  // ISO date (YYYY-MM-DD)
  if (sample.every(isIsoDate)) {
    return {
      canonType: 'date',
      confidence: 1.0,
      notes: `All ${sample.length} samples matched ISO date format`,
    };
  }

  // ISO datetime (YYYY-MM-DDTHH:mm:ssZ)
  if (sample.every(isIsoDateTime)) {
    return {
      canonType: 'datetime',
      confidence: 1.0,
      notes: `All ${sample.length} samples matched ISO datetime format`,
    };
  }

  // Boolean (true/false, yes/no, 1/0)
  if (sample.every(isBoolean)) {
    return {
      canonType: 'boolean',
      confidence: 0.95,
      notes: `All ${sample.length} samples matched boolean values`,
    };
  }

  // Integer
  if (sample.every(isInteger)) {
    return {
      canonType: 'integer',
      confidence: 1.0,
      notes: `All ${sample.length} samples are integers`,
    };
  }

  // Decimal number
  if (sample.every(isDecimal)) {
    return {
      canonType: 'decimal',
      confidence: 1.0,
      notes: `All ${sample.length} samples are decimal numbers`,
    };
  }

  // UUID
  if (sample.every(isUuid)) {
    return {
      canonType: 'entity_ref',
      confidence: 0.9,
      notes: `All ${sample.length} samples matched UUID format`,
    };
  }

  // Short text (< 100 chars average)
  const avgLength = sample.reduce((sum, s) => sum + s.length, 0) / sample.length;
  if (avgLength < 100) {
    return {
      canonType: 'short_text',
      confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA,
      notes: `Inferred short_text based on average sample length ${Math.round(avgLength)} chars`,
    };
  }

  // Long text (>= 100 chars average)
  return {
    canonType: 'long_text',
    confidence: CONFIDENCE_SEMANTICS.NARROWING_WITH_METADATA,
    notes: `Inferred long_text based on average sample length ${Math.round(avgLength)} chars`,
  };
}

// Helper functions for type detection

function isIsoDate(s: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(s)) return false;
  const date = new Date(s);
  return !isNaN(date.getTime());
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
