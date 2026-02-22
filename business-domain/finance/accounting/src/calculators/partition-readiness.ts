import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * DA-09 — Partition Readiness Assessment for High-Volume Tables
 * Pure function — no I/O.
 */

export type TableStats = { tableName: string; rowCount: number; sizeBytes: number; hasPartitionKey: boolean; partitionKeyColumn: string | null };

export type PartitionRecommendation = { tableName: string; shouldPartition: boolean; reason: string; suggestedStrategy: 'range_by_date' | 'list_by_org' | 'hash' | 'none' };

export type PartitionResult = { recommendations: PartitionRecommendation[]; tablesNeedingPartition: number; totalSizeBytes: number };

const PARTITION_THRESHOLD_ROWS = 10_000_000;
const PARTITION_THRESHOLD_BYTES = 1_073_741_824; // 1GB

export function assessPartitionReadiness(tables: TableStats[]): CalculatorResult<PartitionResult> {
  if (tables.length === 0) throw new DomainError('VALIDATION_FAILED', 'No tables');
  const recommendations: PartitionRecommendation[] = tables.map((t) => {
    const needsPartition = t.rowCount > PARTITION_THRESHOLD_ROWS || t.sizeBytes > PARTITION_THRESHOLD_BYTES;
    const strategy = !needsPartition ? 'none' as const : t.hasPartitionKey ? 'range_by_date' as const : 'list_by_org' as const;
    return { tableName: t.tableName, shouldPartition: needsPartition, reason: needsPartition ? `${t.rowCount} rows / ${Math.round(t.sizeBytes / 1048576)}MB` : 'Below threshold', suggestedStrategy: strategy };
  });
  return { result: { recommendations, tablesNeedingPartition: recommendations.filter((r) => r.shouldPartition).length, totalSizeBytes: tables.reduce((s, t) => s + t.sizeBytes, 0) }, inputs: { tableCount: tables.length }, explanation: `Partition assessment: ${recommendations.filter((r) => r.shouldPartition).length}/${tables.length} need partitioning` };
}
