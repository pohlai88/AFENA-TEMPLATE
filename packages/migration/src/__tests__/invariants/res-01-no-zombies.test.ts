import { describe, it, expect, vi } from 'vitest';
import type { PipelineDb } from '../../pipeline/pipeline-base.js';
import { MigrationPipelineBase } from '../../pipeline/pipeline-base.js';
import type {
  UpsertPlan,
  LoadResult,
  BatchResult,
  LegacyRecord,
  TransformedRecord,
  GateResult,
} from '../../types/index.js';

/**
 * RES-01: No zombie reservations.
 *
 * - reserveLineage inserts with state='reserved'
 * - if insert conflicts, attempts reclaim of stale reservation
 * - commitLineage enforces state transition reserved → committed
 * - double-commit throws
 * - failed create deletes reservation by lineageId only (D0.2)
 */

// Minimal concrete pipeline for testing
class TestPipeline extends MigrationPipelineBase {
  protected async planUpserts(): Promise<UpsertPlan> {
    return { jobId: '', entityType: '', actions: [] };
  }
  protected async loadPlan(): Promise<LoadResult> {
    return { created: [], updated: [], skipped: [], failed: [] };
  }
  protected async extractBatch(): Promise<BatchResult> {
    return { records: [], nextCursor: null };
  }
  protected async transformBatch(records: LegacyRecord[]): Promise<TransformedRecord[]> {
    return records;
  }
  protected async runPreflightGates(): Promise<GateResult> {
    return { passed: true };
  }
  protected async runPostflightGates(): Promise<GateResult> {
    return { passed: true };
  }

  // Expose protected methods for testing
  public testReserveLineage(
    jobId: string,
    entityType: string,
    legacyKey: { legacySystem: string; legacyId: string }
  ) {
    return this.reserveLineage(jobId, entityType, legacyKey);
  }

  public testCommitLineage(lineageId: string, afenaId: string) {
    return this.commitLineage(lineageId, afenaId);
  }
}

function makePipeline(db: PipelineDb): TestPipeline {
  return new TestPipeline(
    {
      id: 'job-1',
      orgId: 'org-1',
      entityType: 'contacts',
      sourceConfig: { transport: 'csv', systemName: 'legacy', filePath: '' },
      fieldMappings: [],
      mergePolicies: [],
      conflictStrategy: 'skip',
      status: 'running',
      checkpointCursor: null,
      recordsSuccess: 0,
      recordsFailed: 0,
    },
    { orgId: 'org-1', workerId: 'worker-1', requestId: 'req-1' },
    db
  );
}

describe('RES-01: No zombie reservations', () => {
  it('should win reservation when insert succeeds', async () => {
    const db: PipelineDb = {
      insertLineageReservation: vi.fn().mockResolvedValue({ id: 'lineage-1' }),
      reclaimStaleReservation: vi.fn().mockResolvedValue(null),
      commitLineage: vi.fn().mockResolvedValue(true),
      deleteReservation: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = makePipeline(db);
    const result = await pipeline.testReserveLineage('job-1', 'contacts', {
      legacySystem: 'legacy',
      legacyId: '12345',
    });

    expect(result.isWinner).toBe(true);
    expect(result.lineageId).toBe('lineage-1');
    expect(db.insertLineageReservation).toHaveBeenCalledOnce();
  });

  it('should attempt reclaim when insert conflicts', async () => {
    const db: PipelineDb = {
      insertLineageReservation: vi.fn().mockResolvedValue(null), // conflict
      reclaimStaleReservation: vi.fn().mockResolvedValue({ id: 'reclaimed-1' }),
      commitLineage: vi.fn().mockResolvedValue(true),
      deleteReservation: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = makePipeline(db);
    const result = await pipeline.testReserveLineage('job-1', 'contacts', {
      legacySystem: 'legacy',
      legacyId: '12345',
    });

    expect(result.isWinner).toBe(true);
    expect(result.lineageId).toBe('reclaimed-1');
    expect(db.reclaimStaleReservation).toHaveBeenCalledOnce();
  });

  it('should lose when insert conflicts and reclaim fails', async () => {
    const db: PipelineDb = {
      insertLineageReservation: vi.fn().mockResolvedValue(null),
      reclaimStaleReservation: vi.fn().mockResolvedValue(null), // not stale
      commitLineage: vi.fn().mockResolvedValue(true),
      deleteReservation: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = makePipeline(db);
    const result = await pipeline.testReserveLineage('job-1', 'contacts', {
      legacySystem: 'legacy',
      legacyId: '12345',
    });

    expect(result.isWinner).toBe(false);
  });

  it('should enforce state transition on commit', async () => {
    const db: PipelineDb = {
      insertLineageReservation: vi.fn().mockResolvedValue({ id: 'lineage-1' }),
      reclaimStaleReservation: vi.fn().mockResolvedValue(null),
      commitLineage: vi.fn().mockResolvedValue(true),
      deleteReservation: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = makePipeline(db);
    await pipeline.testCommitLineage('lineage-1', 'afena-uuid');

    expect(db.commitLineage).toHaveBeenCalledWith('lineage-1', 'afena-uuid');
  });

  it('should throw on double-commit (not reserved)', async () => {
    const db: PipelineDb = {
      insertLineageReservation: vi.fn().mockResolvedValue({ id: 'lineage-1' }),
      reclaimStaleReservation: vi.fn().mockResolvedValue(null),
      commitLineage: vi.fn().mockResolvedValue(false), // already committed
      deleteReservation: vi.fn().mockResolvedValue(undefined),
    };

    const pipeline = makePipeline(db);
    await expect(
      pipeline.testCommitLineage('lineage-1', 'afena-uuid')
    ).rejects.toThrow('Lineage commit failed (not reserved): lineage-1');
  });
});
