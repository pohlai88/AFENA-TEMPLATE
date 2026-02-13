import { and, eq, inArray } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import {
  migrationLineage,
  migrationConflicts,
  migrationRowSnapshots,
} from 'afena-database';

import type {
  Cursor,
  LegacyKey,
  UpsertPlan,
  UpsertAction,
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
import type { QueryBuilder } from '../adapters/query-builder.js';
import type { EntityWriteAdapter } from '../adapters/entity-write-adapter.js';
import type { ConflictDetector, Conflict } from '../strategies/conflict-detector.js';
import type { TransformChain, DataType } from '../transforms/transform-chain.js';
import type { PreflightGate, PostflightGate } from '../gates/gate-chain.js';
import { PreflightGateChain, PostflightGateChain } from '../gates/gate-chain.js';
import { MigrationPipelineBase } from './pipeline-base.js';
import type { PipelineDb } from './pipeline-base.js';

/**
 * Concrete SQL migration pipeline.
 *
 * - Hardening 1: Bulk lineage prefetch + bulk conflict detection (no N+1)
 * - Hardening 2: Reservation-first create pattern (concurrency-safe)
 * - Hardening 4: Snapshot round-tripping via write-shape adapter
 */
export interface SqlPipelineConfig {
  db: DbInstance;
  pipelineDb: PipelineDb;
  queryBuilder: QueryBuilder;
  conflictDetector: ConflictDetector;
  writeAdapter: EntityWriteAdapter;
  transformChain: TransformChain;
  batchSize?: number;
  fieldDataTypes?: Record<string, DataType>;
  preflightGates?: PreflightGate[];
  postflightGates?: PostflightGate[];
}

export class SqlMigrationPipeline extends MigrationPipelineBase {
  private readonly afenaDb: DbInstance;
  private readonly queryBuilder: QueryBuilder;
  private readonly conflictDetector: ConflictDetector;
  private readonly writeAdapter: EntityWriteAdapter;
  private readonly transformChain: TransformChain;
  private readonly batchSize: number;
  private readonly fieldDataTypes: Record<string, DataType>;
  private readonly preflightChain: PreflightGateChain;
  private readonly postflightChain: PostflightGateChain;

  constructor(
    job: MigrationJob,
    context: MigrationContext,
    config: SqlPipelineConfig
  ) {
    super(job, context, config.pipelineDb);
    this.afenaDb = config.db;
    this.queryBuilder = config.queryBuilder;
    this.conflictDetector = config.conflictDetector;
    this.writeAdapter = config.writeAdapter;
    this.transformChain = config.transformChain;
    this.batchSize = config.batchSize ?? 500;
    this.fieldDataTypes = config.fieldDataTypes ?? {};

    this.preflightChain = new PreflightGateChain();
    for (const gate of config.preflightGates ?? []) {
      this.preflightChain.addGate(gate);
    }

    this.postflightChain = new PostflightGateChain();
    for (const gate of config.postflightGates ?? []) {
      this.postflightChain.addGate(gate);
    }
  }

  // ── Expose for signed report generation ───────────────────

  getTransformChain(): TransformChain {
    return this.transformChain;
  }

  getConflictDetector(): ConflictDetector {
    return this.conflictDetector;
  }

  // ── Extract ───────────────────────────────────────────────

  protected async extractBatch(cursor: Cursor): Promise<BatchResult> {
    const query = this.queryBuilder.buildBatchQuery(
      this.job.entityType,
      this.batchSize,
      cursor
    );

    // Execute against legacy source (placeholder — real impl uses legacy pool)
    // For now, return empty to allow compilation; concrete adapters override.
    void query;
    return { records: [], nextCursor: null };
  }

  // ── Transform ─────────────────────────────────────────────

  protected async transformBatch(records: LegacyRecord[]): Promise<TransformedRecord[]> {
    const results: TransformedRecord[] = [];

    for (const record of records) {
      const transformed: Record<string, unknown> = {};

      for (const mapping of this.job.fieldMappings) {
        const rawValue = record.data[mapping.sourceField];
        const dataType = this.fieldDataTypes[mapping.targetField] ?? 'short_text';

        const value = await this.transformChain.transform(
          rawValue,
          mapping.targetField,
          dataType,
          {
            entityType: this.job.entityType,
            orgId: this.context.orgId,
          }
        );

        transformed[mapping.targetField] = value;
      }

      results.push({ legacyId: record.legacyId, data: transformed });
    }

    return results;
  }

  // ── Plan (Hardening 1: Bulk prefetch, no N+1) ────────────

  protected async planUpserts(records: TransformedRecord[]): Promise<UpsertPlan> {
    const actions: UpsertAction[] = [];
    const legacyIds = records.map((r) => r.legacyId);
    const systemName = this.resolveSystemName();

    // 1. Bulk lineage prefetch (single query)
    const existingLineage = await this.afenaDb
      .select()
      .from(migrationLineage)
      .where(
        and(
          eq(migrationLineage.orgId, this.context.orgId),
          eq(migrationLineage.entityType, this.job.entityType),
          eq(migrationLineage.legacySystem, systemName),
          inArray(migrationLineage.legacyId, legacyIds)
        )
      );

    const lineageMap = new Map<string, { afenaId: string | null; state: string }>();
    for (const line of existingLineage) {
      lineageMap.set(line.legacyId, { afenaId: line.afenaId, state: line.state });
    }

    // 2. Separate: already-migrated vs new
    const alreadyMigrated: TransformedRecord[] = [];
    const newRecords: TransformedRecord[] = [];

    for (const record of records) {
      const lineage = lineageMap.get(record.legacyId);
      if (lineage?.state === 'committed' && lineage.afenaId) {
        alreadyMigrated.push(record);
      } else {
        newRecords.push(record);
      }
    }

    // 3. Handle already-migrated
    for (const record of alreadyMigrated) {
      const legacyKey: LegacyKey = { legacySystem: systemName, legacyId: record.legacyId };
      const afenaId = lineageMap.get(record.legacyId)!.afenaId!;

      if (this.job.conflictStrategy === 'skip') {
        actions.push({ kind: 'skip', legacyKey, reason: 'Already migrated' });
      } else {
        actions.push({ kind: 'update', targetId: afenaId, legacyKey, data: record.data });
      }
    }

    // 4. Bulk conflict detection for new records (single query)
    if (newRecords.length > 0) {
      const conflicts = await this.conflictDetector.detectBulk(newRecords, {
        orgId: this.context.orgId,
      });

      const conflictMap = new Map<string, Conflict>();
      for (const conflict of conflicts) {
        conflictMap.set(conflict.legacyRecord.legacyId, conflict);
      }

      // 5. Plan actions for new records
      for (const record of newRecords) {
        const legacyKey: LegacyKey = { legacySystem: systemName, legacyId: record.legacyId };
        const conflict = conflictMap.get(record.legacyId);

        if (!conflict) {
          actions.push({ kind: 'create', legacyKey, data: record.data });
          continue;
        }

        // Conflict resolution based on strategy
        switch (this.job.conflictStrategy) {
          case 'skip':
            actions.push({ kind: 'skip', legacyKey, reason: 'Conflict detected, skipped' });
            break;
          case 'overwrite':
            if (conflict.matches.length > 0) {
              const best = conflict.matches[0]!;
              actions.push({
                kind: 'update',
                targetId: best.entityId,
                legacyKey,
                data: record.data,
              });
            }
            break;
          case 'merge':
            if (conflict.matches.length > 0) {
              const best = conflict.matches[0]!;
              actions.push({
                kind: 'merge',
                targetId: best.entityId,
                legacyKey,
                data: record.data,
                evidence: {
                  conflictId: conflict.id,
                  chosenCandidate: best.entityId,
                  fieldDecisions: [],
                  resolver: 'auto',
                },
              });
            }
            break;
          case 'manual':
            actions.push({
              kind: 'manual',
              legacyKey,
              reason: 'Manual review required',
              candidates: conflict.matches,
            });
            break;
        }
      }
    }

    return { jobId: this.job.id, entityType: this.job.entityType, actions };
  }

  // ── Load (Hardening 2: Reservation-first create) ─────────

  protected async loadPlan(plan: UpsertPlan): Promise<LoadResult> {
    const result: LoadResult = {
      created: [],
      updated: [],
      skipped: [],
      failed: [],
    };

    for (const action of plan.actions) {
      try {
        switch (action.kind) {
          case 'create': {
            // Reserve lineage FIRST (concurrency-safe)
            const reservation = await this.reserveLineage(
              plan.jobId,
              plan.entityType,
              action.legacyKey
            );

            if (!reservation.isWinner) {
              result.skipped.push({
                legacyId: action.legacyKey.legacyId,
                reason: 'Concurrent create detected, skipped',
              });
              continue;
            }

            try {
              // TODO: Call mutate() via crud kernel when wired
              // For now, generate a placeholder afenaId
              const afenaId = crypto.randomUUID();

              // Commit lineage with real afenaId
              await this.commitLineage(reservation.lineageId!, afenaId);

              result.created.push({
                legacyId: action.legacyKey.legacyId,
                afenaId,
              });
            } catch (createError) {
              // D0.2: Delete reservation by lineageId only
              await this.db.deleteReservation(reservation.lineageId!);
              throw createError;
            }
            break;
          }

          case 'update':
          case 'merge': {
            // Capture snapshot BEFORE update (Fix 4)
            await this.captureSnapshot(
              plan.jobId,
              plan.entityType,
              action.targetId
            );

            // TODO: Call mutate() via crud kernel when wired
            result.updated.push({
              legacyId: action.legacyKey.legacyId,
              afenaId: action.targetId,
            });

            // Record merge evidence if merge action
            if (action.kind === 'merge' && action.evidence) {
              // TODO: Insert into migration_conflict_resolutions
            }
            break;
          }

          case 'skip': {
            result.skipped.push({
              legacyId: action.legacyKey.legacyId,
              reason: action.reason,
            });
            break;
          }

          case 'manual': {
            // Log conflict for manual review — DO NOT create lineage
            await this.afenaDb.insert(migrationConflicts).values({
              orgId: this.context.orgId,
              migrationJobId: plan.jobId,
              entityType: plan.entityType,
              legacyRecord: { legacyKey: action.legacyKey, data: {} },
              candidateMatches: action.candidates ?? [],
              confidence: 'medium',
              resolution: 'manual_review',
            });

            result.skipped.push({
              legacyId: action.legacyKey.legacyId,
              reason: action.reason,
            });
            break;
          }
        }
      } catch (error) {
        result.failed.push({
          legacyId: action.legacyKey.legacyId,
          error: String(error),
        });
      }
    }

    return result;
  }

  // ── Snapshot capture (Hardening 4) ────────────────────────

  protected async captureSnapshot(
    jobId: string,
    entityType: EntityType,
    entityId: string
  ): Promise<void> {
    // Read raw DB row (not DTO) — uses write adapter to separate core/custom
    // TODO: Replace with real table lookup when entity registry is wired
    const rawRow: Record<string, unknown> = {};

    const { core, custom } = this.writeAdapter.toWriteShape(rawRow);

    await this.afenaDb
      .insert(migrationRowSnapshots)
      .values({
        orgId: this.context.orgId,
        migrationJobId: jobId,
        entityType,
        entityId,
        beforeWriteCore: core,
        beforeWriteCustom: custom,
      })
      .onConflictDoNothing();
  }

  // ── Gates ─────────────────────────────────────────────────

  protected async runPreflightGates(): Promise<GateResult> {
    return this.preflightChain.run(this.job);
  }

  protected async runPostflightGates(result: MigrationResult): Promise<GateResult> {
    return this.postflightChain.run(this.job, result);
  }

  // ── Private helpers ───────────────────────────────────────

  private resolveSystemName(): string {
    return this.job.sourceConfig.systemName;
  }
}
