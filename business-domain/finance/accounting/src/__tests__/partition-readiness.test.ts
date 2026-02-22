import { describe, expect, it } from 'vitest';
import { assessPartitionReadiness } from '../calculators/partition-readiness';

describe('assessPartitionReadiness', () => {
  it('recommends partitioning for large tables', () => {
    const r = assessPartitionReadiness([
      { tableName: 'journal_lines', rowCount: 15_000_000, sizeBytes: 2_000_000_000, hasPartitionKey: true, partitionKeyColumn: 'posted_at' },
      { tableName: 'contacts', rowCount: 50_000, sizeBytes: 5_000_000, hasPartitionKey: false, partitionKeyColumn: null },
    ]);
    expect(r.result.tablesNeedingPartition).toBe(1);
    expect(r.result.recommendations[0]!.suggestedStrategy).toBe('range_by_date');
  });

  it('returns none for small tables', () => {
    const r = assessPartitionReadiness([{ tableName: 'settings', rowCount: 100, sizeBytes: 10000, hasPartitionKey: false, partitionKeyColumn: null }]);
    expect(r.result.tablesNeedingPartition).toBe(0);
  });

  it('throws on empty tables', () => {
    expect(() => assessPartitionReadiness([])).toThrow();
  });
});
