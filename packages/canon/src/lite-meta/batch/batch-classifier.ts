/**
 * Batch Column Classification
 * 
 * Pure, synchronous batch operations for classifying multiple columns.
 * Uses chunking to avoid blocking the event loop on large batches.
 */

import type { MetaClassification } from '../../enums/meta-classification';
import { classifyColumn, classifyColumns } from '../core/classification';

/**
 * Column info for batch classification
 */
export interface ColumnInfo {
  fieldName: string;
  sampleValues?: unknown[];
}

/**
 * Classification result with column context
 */
export interface ColumnClassificationResult {
  fieldName: string;
  classification: MetaClassification | null;
  confidence: number;
}

/**
 * Classify multiple columns in batch
 * 
 * Pure function - processes all columns synchronously with chunking.
 * 
 * @param columns - Array of column info to classify
 * @param chunkSize - Number of columns to process per chunk (default: 50)
 * @returns Array of classification results in same order as input
 */
export function classifyColumnsBatch(
  columns: ColumnInfo[],
  chunkSize = 50
): ColumnClassificationResult[] {
  const results: ColumnClassificationResult[] = [];

  // Process in chunks to avoid blocking
  for (let i = 0; i < columns.length; i += chunkSize) {
    const chunk = columns.slice(i, i + chunkSize);

    for (const col of chunk) {
      const result = classifyColumn(col.fieldName, col.sampleValues);

      results.push({
        fieldName: col.fieldName,
        classification: result?.classification ?? null,
        confidence: result?.confidence ?? 0,
      });
    }
  }

  return results;
}

/**
 * Classify columns and filter to PII only
 * 
 * @param columns - Array of column info to classify
 * @param chunkSize - Number of columns to process per chunk (default: 50)
 * @returns Array of PII classification results only
 */
export function classifyColumnsBatchPII(
  columns: ColumnInfo[],
  chunkSize = 50
): ColumnClassificationResult[] {
  return classifyColumnsBatch(columns, chunkSize).filter(
    (result) => result.classification === 'pii'
  );
}

/**
 * Classify columns and group by classification type
 * 
 * @param columns - Array of column info to classify
 * @param chunkSize - Number of columns to process per chunk (default: 50)
 * @returns Map of classification type to column results
 */
export function classifyColumnsBatchGrouped(
  columns: ColumnInfo[],
  chunkSize = 50
): Map<MetaClassification | 'unclassified', ColumnClassificationResult[]> {
  const results = classifyColumnsBatch(columns, chunkSize);
  const grouped = new Map<MetaClassification | 'unclassified', ColumnClassificationResult[]>();

  for (const result of results) {
    const key = result.classification ?? 'unclassified';
    const existing = grouped.get(key) ?? [];
    existing.push(result);
    grouped.set(key, existing);
  }

  return grouped;
}

/**
 * Batch classification statistics
 */
export interface BatchClassificationStats {
  total: number;
  classified: number;
  unclassified: number;
  classificationRate: number;
  byType: Record<string, number>;
  averageConfidence: number;
}

/**
 * Classify columns and collect statistics
 * 
 * @param columns - Array of column info to classify
 * @param chunkSize - Number of columns to process per chunk (default: 50)
 * @returns Statistics about the batch classification operation
 */
export function classifyColumnsBatchStats(
  columns: ColumnInfo[],
  chunkSize = 50
): BatchClassificationStats {
  const results = classifyColumnsBatch(columns, chunkSize);

  const classified = results.filter((r) => r.classification !== null).length;
  const unclassified = results.length - classified;

  // Count by classification type
  const byType: Record<string, number> = {};
  let totalConfidence = 0;

  for (const result of results) {
    if (result.classification) {
      byType[result.classification] = (byType[result.classification] || 0) + 1;
      totalConfidence += result.confidence;
    }
  }

  return {
    total: results.length,
    classified,
    unclassified,
    classificationRate: results.length > 0 ? classified / results.length : 0,
    byType,
    averageConfidence: classified > 0 ? totalConfidence / classified : 0,
  };
}

/**
 * Batch classify using the multi-column classifier
 * 
 * This uses the core classifyColumns function which processes
 * multiple columns together for better context.
 * 
 * @param fieldNames - Array of field names to classify
 * @returns Array of classification results
 */
export function classifyColumnsMulti(
  fieldNames: string[]
): ColumnClassificationResult[] {
  // Convert string array to column objects
  const columns = fieldNames.map((name) => ({ name }));
  const results = classifyColumns(columns);

  return fieldNames.map((fieldName) => {
    const result = results.get(fieldName);
    return {
      fieldName,
      classification: result?.classification ?? null,
      confidence: result?.confidence ?? 0,
    };
  });
}
