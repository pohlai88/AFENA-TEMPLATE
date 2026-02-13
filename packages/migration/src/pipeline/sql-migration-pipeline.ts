import { and, eq, inArray, sql } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import {
  migrationLineage,
  migrationConflicts,
  migrationConflictResolutions,
  migrationRowSnapshots,
  migrationCheckpoints,
  migrationQuarantine,
  migrationMergeExplanations,
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
  RecordOutcome,
  StepCheckpoint,
  ConflictThresholds,
} from '../types/index.js';
import { DEFAULT_CONFLICT_THRESHOLDS } from '../types/index.js';
import type { QueryBuilder } from '../adapters/query-builder.js';
import type { EntityWriteAdapter } from '../adapters/entity-write-adapter.js';
import type { ConflictDetector, Conflict, DetectorQueryFn } from '../strategies/conflict-detector.js';
import type { TransformChain, DataType } from '../transforms/transform-chain.js';
import type { PreflightGate, PostflightGate } from '../gates/gate-chain.js';
import { PreflightGateChain, PostflightGateChain } from '../gates/gate-chain.js';
import { MigrationPipelineBase } from './pipeline-base.js';
import type { PipelineDb } from './pipeline-base.js';
import type { CrudBridge } from './crud-bridge.js';
import type { LegacyAdapter } from '../adapters/legacy-adapter.js';
import pLimit from 'p-limit';

import { withTerminalOutcome } from './with-terminal-outcome.js';
import { PerfTracker } from './perf-tracker.js';
import { hashCanonical } from '../audit/canonical-json.js';

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
  crudBridge?: CrudBridge;
  legacyAdapter?: LegacyAdapter;
  detectorQueryFn?: DetectorQueryFn;
  batchSize?: number;
  fieldDataTypes?: Record<string, DataType>;
  preflightGates?: PreflightGate[];
  postflightGates?: PostflightGate[];
  checkpointInterval?: number;
  createConcurrency?: number;
  conflictThresholds?: ConflictThresholds;
}

export class SqlMigrationPipeline extends MigrationPipelineBase {
  private readonly afenaDb: DbInstance;
  private readonly queryBuilder: QueryBuilder;
  private readonly conflictDetector: ConflictDetector;
  private readonly writeAdapter: EntityWriteAdapter;
  private readonly transformChain: TransformChain;
  private readonly batchSize: number;
  private readonly fieldDataTypes: Record<string, DataType>;
  private readonly crudBridge: CrudBridge | null;
  private readonly legacyAdapter: LegacyAdapter | null;
  private readonly detectorQueryFn: DetectorQueryFn | null;
  private readonly preflightChain: PreflightGateChain;
  private readonly postflightChain: PostflightGateChain;
  private readonly checkpointInterval: number;
  private readonly createConcurrency: number;
  private readonly conflictThresholds: ConflictThresholds;
  readonly perf: PerfTracker = new PerfTracker();
  private lastOutcomes: RecordOutcome[] = [];

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
    this.crudBridge = config.crudBridge ?? null;
    this.legacyAdapter = config.legacyAdapter ?? null;
    this.detectorQueryFn = config.detectorQueryFn ?? null;
    this.checkpointInterval = config.checkpointInterval ?? 50;
    this.createConcurrency = config.createConcurrency ?? 10;
    this.conflictThresholds = config.conflictThresholds ?? DEFAULT_CONFLICT_THRESHOLDS;

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
    if (this.legacyAdapter) {
      return this.legacyAdapter.extractBatch(
        this.job.entityType,
        this.batchSize,
        cursor
      );
    }

    // Fallback: use query builder (for cases where legacy adapter is not set)
    const query = this.queryBuilder.buildBatchQuery(
      this.job.entityType,
      this.batchSize,
      cursor
    );
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
        queryFn: this.detectorQueryFn ?? undefined,
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
              const score = best.score ?? 0;

              if (score >= this.conflictThresholds.autoMerge) {
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
                await this.writeMergeExplanation(
                  this.job.id, this.job.entityType, record.legacyId,
                  best.entityId, 'merged', score, best.explanations ?? [],
                );
              } else if (score >= this.conflictThresholds.manualReview) {
                actions.push({
                  kind: 'manual',
                  legacyKey,
                  reason: `Score ${score} below auto-merge threshold (${this.conflictThresholds.autoMerge})`,
                  candidates: conflict.matches,
                });
                await this.writeMergeExplanation(
                  this.job.id, this.job.entityType, record.legacyId,
                  best.entityId, 'manual_review', score, best.explanations ?? [],
                );
              } else {
                actions.push({ kind: 'create', legacyKey, data: record.data });
                await this.writeMergeExplanation(
                  this.job.id, this.job.entityType, record.legacyId,
                  '', 'created_new', score, best.explanations ?? [],
                );
              }
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

  // ── Load (Hardening 2 + OPS-01 + OPS-02 + SPD-01) ─────────

  protected async loadPlan(plan: UpsertPlan): Promise<LoadResult> {
    const result: LoadResult = {
      created: [],
      updated: [],
      skipped: [],
      failed: [],
    };
    const outcomes: RecordOutcome[] = [];
    const limit = pLimit(this.createConcurrency);

    let i = 0;
    while (i < plan.actions.length) {
      // SPD-01: Collect consecutive create actions into a parallel batch
      if (plan.actions[i]!.kind === 'create') {
        const createBatch: { index: number; action: UpsertAction }[] = [];
        while (i < plan.actions.length && plan.actions[i]!.kind === 'create') {
          createBatch.push({ index: i, action: plan.actions[i]! });
          i++;
        }

        const settledResults = await Promise.allSettled(
          createBatch.map(({ action }) =>
            limit(() => this.executeCreate(plan, action as Extract<UpsertAction, { kind: 'create' }>, result))
          )
        );

        for (let b = 0; b < settledResults.length; b++) {
          const settled = settledResults[b]!;
          const batchAction = createBatch[b]!.action;
          const outcome: RecordOutcome = settled.status === 'fulfilled'
            ? settled.value
            : {
              entityType: plan.entityType,
              legacyId: batchAction.legacyKey.legacyId,
              status: 'quarantined',
              errorClass: 'permanent',
              errorCode: settled.reason instanceof Error ? settled.reason.message.slice(0, 100) : 'UNKNOWN',
              failureStage: 'load',
            };
          const batchIdx = createBatch[b]!.index;

          if (outcome.status === 'quarantined') {
            await this.writeQuarantineRow(plan.jobId, plan.entityType, batchAction, outcome);
            result.failed.push({ legacyId: batchAction.legacyKey.legacyId, error: outcome.errorCode ?? 'quarantined' });
          }

          outcomes.push(outcome);

          if (this.checkpointInterval > 0 && batchIdx % this.checkpointInterval === 0 && batchIdx > 0) {
            await this.writeCheckpoint(plan.jobId, plan.entityType, {
              cursor: this.job.checkpointCursor,
              batchIndex: 0,
              loadedUpTo: batchIdx,
              transformVersion: hashCanonical(this.transformChain.getSteps().map(s => ({ name: s.name, order: s.order }))),
            });
          }
        }
        continue;
      }

      // Sequential processing for skip, manual, update, merge
      const action = plan.actions[i]!;
      const entityType = plan.entityType;
      const legacyId = action.legacyKey.legacyId;

      let outcome: RecordOutcome;

      switch (action.kind) {
        case 'skip': {
          result.skipped.push({ legacyId, reason: action.reason });
          outcome = { entityType, legacyId, status: 'skipped', action: 'skip' };
          break;
        }

        case 'manual': {
          await this.afenaDb.insert(migrationConflicts).values({
            orgId: this.context.orgId,
            migrationJobId: plan.jobId,
            entityType,
            legacyRecord: { legacyKey: action.legacyKey, data: {} },
            candidateMatches: action.candidates ?? [],
            confidence: 'medium',
            resolution: 'manual_review',
          });
          result.skipped.push({ legacyId, reason: action.reason });
          outcome = { entityType, legacyId, status: 'manual_review' };
          break;
        }

        case 'update':
        case 'merge': {
          const actionKind = action.kind;
          outcome = await withTerminalOutcome({ entityType, legacyId }, async () => {
            const endMutate = this.perf.start(`mutate_${actionKind}_ms`);
            try {
              await this.captureSnapshot(plan.jobId, entityType, action.targetId);

              if (this.crudBridge) {
                const currentRow = await this.crudBridge.readRawRow(entityType, action.targetId);
                const currentVersion = currentRow
                  ? (currentRow['version'] as number | undefined)
                  : undefined;

                const mutateResult = await this.crudBridge.mutate({
                  actionType: `${entityType}.update`,
                  entityType,
                  entityId: action.targetId,
                  input: action.data,
                  expectedVersion: currentVersion,
                });

                if (mutateResult.status !== 'ok') {
                  throw Object.assign(
                    new Error(`Update failed: ${mutateResult.errorCode ?? 'unknown'} — ${mutateResult.errorMessage ?? ''}`),
                    { stage: 'load' }
                  );
                }
              }

              result.updated.push({ legacyId, afenaId: action.targetId });

              if (actionKind === 'merge' && 'evidence' in action && action.evidence) {
                await this.afenaDb.insert(migrationConflictResolutions).values({
                  orgId: this.context.orgId,
                  migrationJobId: plan.jobId,
                  conflictId: action.evidence.conflictId,
                  decision: 'merged',
                  chosenCandidateId: action.evidence.chosenCandidate,
                  fieldDecisions: action.evidence.fieldDecisions,
                  resolver: action.evidence.resolver,
                });
              }

              return {
                entityType, legacyId,
                status: 'loaded' as const,
                action: actionKind as 'update' | 'merge',
                targetId: action.targetId,
              };
            } finally {
              endMutate();
            }
          });
          break;
        }

        default: {
          outcome = { entityType, legacyId, status: 'skipped' };
          break;
        }
      }

      if (outcome.status === 'quarantined') {
        await this.writeQuarantineRow(plan.jobId, plan.entityType, action, outcome);
        result.failed.push({ legacyId, error: outcome.errorCode ?? 'quarantined' });
      }

      outcomes.push(outcome);

      if (this.checkpointInterval > 0 && i % this.checkpointInterval === 0 && i > 0) {
        await this.writeCheckpoint(plan.jobId, plan.entityType, {
          cursor: this.job.checkpointCursor,
          batchIndex: 0,
          loadedUpTo: i,
          transformVersion: hashCanonical(this.transformChain.getSteps().map(s => ({ name: s.name, order: s.order }))),
        });
      }

      i++;
    }

    // P0-3: Batch completion checkpoint — advance cursor, reset loadedUpTo
    if (this.checkpointInterval > 0 && outcomes.length > 0) {
      await this.writeCheckpoint(plan.jobId, plan.entityType, {
        cursor: this.job.checkpointCursor,
        batchIndex: 0,
        loadedUpTo: plan.actions.length,
        transformVersion: hashCanonical(this.transformChain.getSteps().map(s => ({ name: s.name, order: s.order }))),
      });
    }

    this.lastOutcomes = outcomes;
    return result;
  }

  // ── SPD-01: Parallel create execution ───────────────────────

  private async executeCreate(
    plan: UpsertPlan,
    action: Extract<UpsertAction, { kind: 'create' }>,
    result: LoadResult,
  ): Promise<RecordOutcome> {
    const entityType = plan.entityType;
    const legacyId = action.legacyKey.legacyId;

    return withTerminalOutcome({ entityType, legacyId }, async () => {
      const endMutate = this.perf.start('mutate_create_ms');
      try {
        const reservation = await this.reserveLineage(
          plan.jobId, entityType, action.legacyKey
        );

        if (!reservation.isWinner) {
          result.skipped.push({ legacyId, reason: 'Concurrent create detected, skipped' });
          return { entityType, legacyId, status: 'skipped' as const, action: 'skip' as const };
        }

        try {
          let afenaId: string;

          if (this.crudBridge) {
            const mutateResult = await this.crudBridge.mutate({
              actionType: `${entityType}.create`,
              entityType,
              input: action.data,
              idempotencyKey: `mig:${plan.jobId}:${legacyId}`,
            });

            if (mutateResult.status !== 'ok' || !mutateResult.entityId) {
              throw Object.assign(
                new Error(`Create failed: ${mutateResult.errorCode ?? 'unknown'} — ${mutateResult.errorMessage ?? ''}`),
                { stage: 'load' }
              );
            }
            afenaId = mutateResult.entityId;
          } else {
            afenaId = crypto.randomUUID();
          }

          await this.commitLineage(reservation.lineageId!, afenaId);
          result.created.push({ legacyId, afenaId });
          return { entityType, legacyId, status: 'loaded' as const, action: 'create' as const, targetId: afenaId };
        } catch (createError) {
          await this.db.deleteReservation(reservation.lineageId!);
          throw createError;
        }
      } finally {
        endMutate();
      }
    });
  }

  getLastOutcomes(): RecordOutcome[] {
    return this.lastOutcomes;
  }

  // ── P2-1: Quarantine replay ─────────────────────────────────

  async replayQuarantinedRecord(quarantineId: string): Promise<RecordOutcome> {
    const rows = await this.afenaDb
      .select()
      .from(migrationQuarantine)
      .where(
        and(
          eq(migrationQuarantine.id, quarantineId),
          eq(migrationQuarantine.status, 'quarantined'),
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) {
      return {
        entityType: 'unknown',
        legacyId: 'unknown',
        status: 'skipped',
        action: 'skip',
      };
    }

    const legacyKey = { legacySystem: row.legacySystem, legacyId: row.legacyId };
    const data = row.recordData as Record<string, unknown>;

    const outcome = await withTerminalOutcome(
      { entityType: row.entityType, legacyId: row.legacyId },
      async () => {
        const reservation = await this.reserveLineage(
          row.migrationJobId, row.entityType, legacyKey
        );

        if (!reservation.isWinner) {
          return {
            entityType: row.entityType,
            legacyId: row.legacyId,
            status: 'skipped' as const,
            action: 'skip' as const,
          };
        }

        try {
          let afenaId: string;
          if (this.crudBridge) {
            const mutateResult = await this.crudBridge.mutate({
              actionType: `${row.entityType}.create`,
              entityType: row.entityType,
              input: data,
              idempotencyKey: `mig:replay:${quarantineId}`,
            });
            if (mutateResult.status !== 'ok' || !mutateResult.entityId) {
              throw Object.assign(
                new Error(`Replay create failed: ${mutateResult.errorCode ?? 'unknown'}`),
                { stage: 'load' }
              );
            }
            afenaId = mutateResult.entityId;
          } else {
            afenaId = crypto.randomUUID();
          }

          await this.commitLineage(reservation.lineageId!, afenaId);
          return {
            entityType: row.entityType,
            legacyId: row.legacyId,
            status: 'loaded' as const,
            action: 'create' as const,
            targetId: afenaId,
          };
        } catch (err) {
          await this.db.deleteReservation(reservation.lineageId!);
          throw err;
        }
      },
    );

    // Mark quarantine row resolved on success
    if (outcome.status === 'loaded') {
      await this.afenaDb
        .update(migrationQuarantine)
        .set({ status: 'resolved', resolvedAt: new Date() })
        .where(eq(migrationQuarantine.id, quarantineId));
    }

    return outcome;
  }

  // ── Snapshot capture (Hardening 4) ────────────────────────

  protected async captureSnapshot(
    jobId: string,
    entityType: EntityType,
    entityId: string
  ): Promise<void> {
    // Read raw DB row via bridge (not DTO) — uses write adapter to separate core/custom
    let rawRow: Record<string, unknown> = {};

    if (this.crudBridge) {
      const row = await this.crudBridge.readRawRow(entityType, entityId);
      if (row) rawRow = row;
    }

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
        beforeVersion: typeof rawRow['version'] === 'number' ? rawRow['version'] : null,
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

  // ── Quarantine persistence ─────────────────────────────────

  private async writeQuarantineRow(
    jobId: string,
    entityType: string,
    action: UpsertAction,
    outcome: RecordOutcome,
  ): Promise<void> {
    const errorHash = hashCanonical({
      code: outcome.errorCode,
      stage: outcome.failureStage,
    });

    await this.afenaDb
      .insert(migrationQuarantine)
      .values({
        orgId: this.context.orgId,
        migrationJobId: jobId,
        entityType,
        legacyId: action.legacyKey.legacyId,
        legacySystem: this.resolveSystemName(),
        recordData: 'data' in action ? action.data : {},
        transformVersion: hashCanonical(
          this.transformChain.getSteps().map(s => ({ name: s.name, order: s.order }))
        ),
        failureStage: outcome.failureStage ?? 'load',
        errorClass: outcome.errorClass ?? 'permanent',
        errorCode: outcome.errorCode ?? 'UNKNOWN',
        errorMessage: outcome.errorCode,
        lastErrorHash: errorHash,
        status: 'quarantined',
      })
      .onConflictDoNothing();
  }

  // ── Checkpoint persistence (OPS-02) ────────────────────────

  private async writeCheckpoint(
    jobId: string,
    entityType: string,
    checkpoint: StepCheckpoint,
  ): Promise<void> {
    await this.afenaDb
      .insert(migrationCheckpoints)
      .values({
        orgId: this.context.orgId,
        migrationJobId: jobId,
        entityType,
        cursorJson: checkpoint.cursor ?? {},
        batchIndex: checkpoint.batchIndex,
        loadedUpTo: checkpoint.loadedUpTo,
        transformVersion: checkpoint.transformVersion,
        ...(checkpoint.planFingerprint ? { planFingerprint: checkpoint.planFingerprint } : {}),
      })
      .onConflictDoUpdate({
        target: [migrationCheckpoints.migrationJobId, migrationCheckpoints.entityType],
        set: {
          cursorJson: sql`excluded.cursor_json`,
          batchIndex: sql`excluded.batch_index`,
          loadedUpTo: sql`excluded.loaded_up_to`,
          transformVersion: sql`excluded.transform_version`,
          planFingerprint: sql`excluded.plan_fingerprint`,
          updatedAt: sql`now()`,
        },
      });
  }

  async loadCheckpoint(
    jobId: string,
    entityType: string,
  ): Promise<StepCheckpoint | null> {
    const rows = await this.afenaDb
      .select()
      .from(migrationCheckpoints)
      .where(
        and(
          eq(migrationCheckpoints.migrationJobId, jobId),
          eq(migrationCheckpoints.entityType, entityType),
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      cursor: row.cursorJson as StepCheckpoint['cursor'],
      batchIndex: row.batchIndex,
      loadedUpTo: row.loadedUpTo,
      transformVersion: row.transformVersion,
      ...(row.planFingerprint ? { planFingerprint: row.planFingerprint } : {}),
    };
  }

  // ── Merge explanation persistence (ACC-05) ────────────────

  private async writeMergeExplanation(
    jobId: string,
    entityType: string,
    legacyId: string,
    targetId: string,
    decision: 'merged' | 'manual_review' | 'created_new',
    scoreTotal: number,
    reasons: Array<{ field: string; matchType: string; scoreContribution: number; legacyValue?: string; candidateValue?: string }>,
  ): Promise<void> {
    await this.afenaDb
      .insert(migrationMergeExplanations)
      .values({
        orgId: this.context.orgId,
        migrationJobId: jobId,
        entityType,
        legacyId,
        targetId,
        decision,
        scoreTotal,
        reasons,
      })
      .onConflictDoNothing();
  }

  // ── Private helpers ───────────────────────────────────────

  private resolveSystemName(): string {
    return this.job.sourceConfig.systemName;
  }
}
