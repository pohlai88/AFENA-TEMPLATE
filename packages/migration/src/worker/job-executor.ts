
import {
  migrationJobs,
  migrationConflicts,
  migrationConflictResolutions,
  migrationReports,
} from 'afena-database';
import { and, eq } from 'drizzle-orm';

import { buildSignedReport } from '../audit/signed-report.js';
import { SqlMigrationPipeline } from '../pipeline/sql-migration-pipeline.js';

import { RateLimiter } from './rate-limiter.js';

import type { LegacyAdapter } from '../adapters/legacy-adapter.js';
import type { ReportInputs } from '../audit/signed-report.js';
import type { SqlPipelineConfig } from '../pipeline/sql-migration-pipeline.js';
import type { Cursor } from '../types/cursor.js';
import type {
  MigrationJob,
  MigrationContext,
  MigrationResult,
} from '../types/migration-job.js';
import type { LoadResult } from '../types/upsert-plan.js';
import type { DbInstance } from 'afena-database';

/**
 * Job execution result — extends MigrationResult with timing info.
 */
export interface JobExecutionResult extends MigrationResult {
  durationMs: number;
  batchesProcessed: number;
  reportHash?: string;
}

/**
 * Job executor — orchestrates a full migration job lifecycle.
 *
 * 1. Mark job as running
 * 2. Run preflight gates
 * 3. Extract → Transform → Plan → Load in batches
 * 4. Run postflight gates
 * 5. Generate signed report
 * 6. Mark job as completed/failed
 */
export class JobExecutor {
  constructor(
    private readonly db: DbInstance,
    private readonly legacyAdapter: LegacyAdapter,
    private readonly pipelineConfig: Omit<SqlPipelineConfig, 'db'>
  ) { }

  async execute(
    job: MigrationJob,
    context: MigrationContext
  ): Promise<JobExecutionResult> {
    const startTime = Date.now();
    const rateLimiter = job.rateLimit
      ? new RateLimiter(job.rateLimit, job.batchSize)
      : null;

    const pipeline = new SqlMigrationPipeline(job, context, {
      ...this.pipelineConfig,
      db: this.db,
    });

    const result: JobExecutionResult = {
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsMerged: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      recordsManualReview: 0,
      durationMs: 0,
      batchesProcessed: 0,
    };

    try {
      // 1. Mark job as running
      await this.db
        .update(migrationJobs)
        .set({ status: 'running', startedAt: new Date() })
        .where(eq(migrationJobs.id, job.id));

      // 2. Extract + process in batches
      let cursor: Cursor = job.checkpointCursor ?? null;
      let batchCount = 0;

      while (true) {
        // Check max runtime
        if (job.maxRuntimeMs && Date.now() - startTime > job.maxRuntimeMs) {
          // Save checkpoint and exit gracefully
          await this.saveCheckpoint(job.id, cursor);
          break;
        }

        // Rate limit
        if (rateLimiter) {
          await rateLimiter.acquire(job.batchSize);
        }

        // Extract batch from legacy source
        const batch = await this.legacyAdapter.extractBatch(
          job.entityType,
          job.batchSize,
          cursor
        );

        if (batch.records.length === 0) {
          break; // Done
        }

        // Transform
        const transformed = await pipeline.transformBatch(batch.records);

        // Plan upserts (bulk prefetch, no N+1)
        const plan = await pipeline.planUpserts(transformed);

        // Load plan (reservation-first creates)
        const loadResult: LoadResult = await pipeline.loadPlan(plan);

        // Accumulate results
        result.recordsProcessed += batch.records.length;
        result.recordsCreated += loadResult.created.length;
        result.recordsUpdated += loadResult.updated.length;
        result.recordsSkipped += loadResult.skipped.length;
        result.recordsFailed += loadResult.failed.length;
        batchCount++;

        // Update checkpoint cursor
        cursor = batch.nextCursor;
        await this.saveCheckpoint(job.id, cursor);

        // Update progress in DB
        await this.db
          .update(migrationJobs)
          .set({
            recordsSuccess: result.recordsCreated + result.recordsUpdated,
            recordsFailed: result.recordsFailed,
            checkpointCursor: cursor,
          })
          .where(eq(migrationJobs.id, job.id));

        if (!cursor) {
          break; // No more batches
        }
      }

      result.batchesProcessed = batchCount;
      result.durationMs = Date.now() - startTime;

      // 3. Generate signed report
      const schema = await this.legacyAdapter.getSchema(job.entityType);
      const transformSteps = pipeline.getTransformChain().getSteps().map((s) => ({
        name: s.name,
        order: s.order,
      }));
      const detector = pipeline.getConflictDetector();

      const reportInputs: ReportInputs = {
        job: {
          ...job,
          status: 'completed',
          checkpointCursor: cursor,
          recordsSuccess: result.recordsCreated + result.recordsUpdated,
          recordsFailed: result.recordsFailed,
        },
        result,
        sourceSchemaFingerprint: JSON.stringify(schema.columns.map((c) => `${c.name}:${c.type}`)),
        transformSteps,
        conflictDetectorName: detector.entityType,
        conflictDetectorMatchKeys: detector.matchKeys,
        mergeEvidenceIds: await this.queryMergeEvidenceIds(job.id, context.orgId),
        manualReviewIds: await this.queryManualReviewIds(job.id, context.orgId),
      };

      const report = buildSignedReport(reportInputs);
      result.reportHash = report.reportHash;

      // Persist report to migration_reports table
      try {
        await this.db.insert(migrationReports).values({
          jobId: job.id,
          reportData: report,
          reportHash: report.reportHash,
        });
      } catch {
        // Report persistence failure is non-fatal
      }

      // 4. Mark job as completed
      await this.db
        .update(migrationJobs)
        .set({
          status: 'completed',
          completedAt: new Date(),
          recordsSuccess: result.recordsCreated + result.recordsUpdated,
          recordsFailed: result.recordsFailed,
        })
        .where(eq(migrationJobs.id, job.id));

    } catch (error) {
      result.durationMs = Date.now() - startTime;

      // Mark job as failed
      await this.db
        .update(migrationJobs)
        .set({
          status: 'failed',
          completedAt: new Date(),
          recordsFailed: result.recordsFailed,
        })
        .where(eq(migrationJobs.id, job.id));

      throw error;
    }

    return result;
  }

  private async saveCheckpoint(jobId: string, cursor: Cursor): Promise<void> {
    await this.db
      .update(migrationJobs)
      .set({ checkpointCursor: cursor })
      .where(eq(migrationJobs.id, jobId));
  }

  // Nit B: Job-scoped evidence queries for signed report
  private async queryMergeEvidenceIds(jobId: string, orgId: string): Promise<string[]> {
    try {
      const rows = await this.db
        .select({ id: migrationConflictResolutions.id })
        .from(migrationConflictResolutions)
        .innerJoin(
          migrationConflicts,
          eq(migrationConflictResolutions.conflictId, migrationConflicts.id)
        )
        .where(
          and(
            eq(migrationConflicts.orgId, orgId),
            eq(migrationConflicts.migrationJobId, jobId),
            eq(migrationConflictResolutions.decision, 'merged')
          )
        );
      return rows.map((r) => r.id);
    } catch {
      return [];
    }
  }

  private async queryManualReviewIds(jobId: string, orgId: string): Promise<string[]> {
    try {
      const rows = await this.db
        .select({ id: migrationConflicts.id })
        .from(migrationConflicts)
        .where(
          and(
            eq(migrationConflicts.orgId, orgId),
            eq(migrationConflicts.migrationJobId, jobId),
            eq(migrationConflicts.resolution, 'manual_review')
          )
        );
      return rows.map((r) => r.id);
    } catch {
      return [];
    }
  }
}
