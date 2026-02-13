import type {
  Cursor,
  LegacyKey,
  UpsertPlan,
  LoadResult,
  EntityType,
  MigrationJob,
  MigrationContext,
  MigrationResult,
  BatchResult,
  LegacyRecord,
  TransformedRecord,
  GateResult,
} from '../types/index.js';

/**
 * Database abstraction for pipeline operations.
 * Concrete implementations inject the real Drizzle instance.
 */
export interface PipelineDb {
  insertLineageReservation(params: {
    id: string;
    orgId: string;
    migrationJobId: string;
    entityType: EntityType;
    legacyId: string;
    legacySystem: string;
    reservedBy: string;
  }): Promise<{ id: string } | null>;

  reclaimStaleReservation(params: {
    orgId: string;
    entityType: EntityType;
    legacySystem: string;
    legacyId: string;
    migrationJobId: string;
    reservedBy: string;
    expiryThreshold: Date;
  }): Promise<{ id: string } | null>;

  commitLineage(lineageId: string, afenaId: string): Promise<boolean>;

  deleteReservation(lineageId: string): Promise<void>;

  bulkInsertLineageReservations(params: Array<{
    id: string;
    orgId: string;
    migrationJobId: string;
    entityType: EntityType;
    legacyId: string;
    legacySystem: string;
    reservedBy: string;
  }>): Promise<Array<{ id: string; legacyId: string }>>;
}

/**
 * Migration pipeline base — Template Method pattern.
 *
 * Fix 1: Lineage State Machine with atomic reservations
 * - reserveLineage()  → INSERT … ON CONFLICT DO NOTHING RETURNING
 * - reclaimStale()    → single-statement UPDATE … RETURNING (D0.1)
 * - commitLineage()   → state transition reserved → committed
 * - delete only by lineageId (D0.2)
 */
export abstract class MigrationPipelineBase {
  constructor(
    protected readonly job: MigrationJob,
    protected readonly context: MigrationContext,
    protected readonly db: PipelineDb
  ) { }

  // ── Template method (fixed skeleton) ──────────────────────

  async run(): Promise<MigrationResult> {
    const result: MigrationResult = {
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsMerged: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      recordsManualReview: 0,
    };

    const preflightResult = await this.runPreflightGates();
    if (!preflightResult.passed) {
      throw new Error(`Preflight gate failed: ${preflightResult.reason}`);
    }

    let cursor: Cursor = this.job.checkpointCursor ?? null;

    while (true) {
      const batch = await this.extractBatch(cursor);
      if (batch.records.length === 0) break;

      const transformed = await this.transformBatch(batch.records);
      const plan = await this.planUpserts(transformed);
      const loadResult = await this.loadPlan(plan);

      result.recordsProcessed += batch.records.length;
      result.recordsCreated += loadResult.created.length;
      result.recordsUpdated += loadResult.updated.length;
      result.recordsSkipped += loadResult.skipped.length;
      result.recordsFailed += loadResult.failed.length;

      cursor = batch.nextCursor;
    }

    const postflightResult = await this.runPostflightGates(result);
    if (!postflightResult.passed) {
      throw new Error(`Postflight gate failed: ${postflightResult.reason}`);
    }

    return result;
  }

  // ── Fix 1: Atomic reservation with lease expiry ───────────

  protected async reserveLineage(
    jobId: string,
    entityType: EntityType,
    legacyKey: LegacyKey
  ): Promise<{ isWinner: boolean; lineageId?: string }> {
    const workerId = this.context.workerId ?? jobId;

    // 1) Attempt insert reservation (winner if inserted)
    const inserted = await this.db.insertLineageReservation({
      id: crypto.randomUUID(),
      orgId: this.context.orgId,
      migrationJobId: jobId,
      entityType,
      legacyId: legacyKey.legacyId,
      legacySystem: legacyKey.legacySystem,
      reservedBy: workerId,
    });

    if (inserted) {
      return { isWinner: true, lineageId: inserted.id };
    }

    // 2) Attempt reclaim stale reservation (winner if updated)
    return this.reclaimStaleReservation(jobId, entityType, legacyKey, workerId);
  }

  // D0.1: Single-statement atomic reclaim
  protected async reclaimStaleReservation(
    jobId: string,
    entityType: EntityType,
    legacyKey: LegacyKey,
    workerId: string
  ): Promise<{ isWinner: boolean; lineageId?: string }> {
    const LEASE_EXPIRY_MINUTES = 15;
    const expiryThreshold = new Date(Date.now() - LEASE_EXPIRY_MINUTES * 60 * 1000);

    const claimed = await this.db.reclaimStaleReservation({
      orgId: this.context.orgId,
      entityType,
      legacySystem: legacyKey.legacySystem,
      legacyId: legacyKey.legacyId,
      migrationJobId: jobId,
      reservedBy: workerId,
      expiryThreshold,
    });

    if (claimed) return { isWinner: true, lineageId: claimed.id };
    return { isWinner: false };
  }

  // Fix 1: Commit with state transition enforcement
  protected async commitLineage(lineageId: string, afenaId: string): Promise<void> {
    const ok = await this.db.commitLineage(lineageId, afenaId);
    if (!ok) {
      throw new Error(`Lineage commit failed (not reserved): ${lineageId}`);
    }
  }

  // ── Abstract hooks (subclasses override) ──────────────────

  protected abstract planUpserts(records: TransformedRecord[]): Promise<UpsertPlan>;
  protected abstract loadPlan(plan: UpsertPlan): Promise<LoadResult>;
  protected abstract extractBatch(cursor: Cursor): Promise<BatchResult>;
  protected abstract transformBatch(records: LegacyRecord[]): Promise<TransformedRecord[]>;
  protected abstract runPreflightGates(): Promise<GateResult>;
  protected abstract runPostflightGates(result: MigrationResult): Promise<GateResult>;
}
