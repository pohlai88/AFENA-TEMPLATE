import { and, count, desc, eq, sql } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import {
  getDb,
  migrationJobs,
  migrationQuarantine,
  migrationCheckpoints,
  migrationMergeExplanations,
  migrationLineage,
} from 'afena-database';

/**
 * SPD-05: Create a control plane instance routed to the read replica by default.
 * Use `forcePrimary: true` for read-after-write consistency.
 */
export function createControlPlane(options?: { forcePrimary?: boolean }): MigrationControlPlane {
  return new MigrationControlPlane(getDb(options));
}

/**
 * OPS-04: Control Plane — Read-only query layer for migration observability.
 *
 * All methods are tenant-scoped (orgId required).
 * Designed to be consumed by API routes or server actions.
 */

// ── Types ─────────────────────────────────────────────────

export interface JobSummary {
  id: string;
  entityType: string;
  status: string;
  recordsSuccess: number;
  recordsFailed: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface QuarantineEntry {
  id: string;
  entityType: string;
  legacyId: string;
  legacySystem: string;
  failureStage: string;
  errorClass: string;
  errorCode: string;
  errorMessage: string | null;
  retryCount: number;
  status: string;
  createdAt: Date;
}

export interface CheckpointEntry {
  entityType: string;
  batchIndex: number;
  loadedUpTo: number;
  transformVersion: string;
  updatedAt: Date;
}

export interface MergeExplanationEntry {
  id: string;
  entityType: string;
  legacyId: string;
  targetId: string;
  decision: string;
  scoreTotal: number;
  reasons: unknown;
  createdAt: Date;
}

export interface JobStats {
  totalRecords: number;
  quarantinedCount: number;
  mergeExplanationCount: number;
  lineageCommittedCount: number;
  lineageReservedCount: number;
}

// ── Query class ───────────────────────────────────────────

export class MigrationControlPlane {
  constructor(private readonly db: DbInstance) { }

  // ── Jobs ──────────────────────────────────────────────

  async listJobs(orgId: string, opts?: { limit?: number; offset?: number }): Promise<JobSummary[]> {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    const rows = await this.db
      .select({
        id: migrationJobs.id,
        entityType: migrationJobs.entityType,
        status: migrationJobs.status,
        recordsSuccess: migrationJobs.recordsSuccess,
        recordsFailed: migrationJobs.recordsFailed,
        createdAt: migrationJobs.createdAt,
        startedAt: migrationJobs.startedAt,
        completedAt: migrationJobs.completedAt,
      })
      .from(migrationJobs)
      .where(eq(migrationJobs.orgId, orgId))
      .orderBy(desc(migrationJobs.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async getJob(orgId: string, jobId: string): Promise<JobSummary | null> {
    const rows = await this.db
      .select({
        id: migrationJobs.id,
        entityType: migrationJobs.entityType,
        status: migrationJobs.status,
        recordsSuccess: migrationJobs.recordsSuccess,
        recordsFailed: migrationJobs.recordsFailed,
        createdAt: migrationJobs.createdAt,
        startedAt: migrationJobs.startedAt,
        completedAt: migrationJobs.completedAt,
      })
      .from(migrationJobs)
      .where(and(eq(migrationJobs.orgId, orgId), eq(migrationJobs.id, jobId)))
      .limit(1);

    return rows[0] ?? null;
  }

  // ── Quarantine ────────────────────────────────────────

  async listQuarantine(
    orgId: string,
    jobId: string,
    opts?: { status?: string; limit?: number; offset?: number },
  ): Promise<QuarantineEntry[]> {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    const conditions = [
      eq(migrationQuarantine.orgId, orgId),
      eq(migrationQuarantine.migrationJobId, jobId),
    ];
    if (opts?.status) {
      conditions.push(eq(migrationQuarantine.status, opts.status));
    }

    const rows = await this.db
      .select({
        id: migrationQuarantine.id,
        entityType: migrationQuarantine.entityType,
        legacyId: migrationQuarantine.legacyId,
        legacySystem: migrationQuarantine.legacySystem,
        failureStage: migrationQuarantine.failureStage,
        errorClass: migrationQuarantine.errorClass,
        errorCode: migrationQuarantine.errorCode,
        errorMessage: migrationQuarantine.errorMessage,
        retryCount: migrationQuarantine.retryCount,
        status: migrationQuarantine.status,
        createdAt: migrationQuarantine.createdAt,
      })
      .from(migrationQuarantine)
      .where(and(...conditions))
      .orderBy(desc(migrationQuarantine.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  // ── Checkpoints ───────────────────────────────────────

  async getCheckpoints(orgId: string, jobId: string): Promise<CheckpointEntry[]> {
    const rows = await this.db
      .select({
        entityType: migrationCheckpoints.entityType,
        batchIndex: migrationCheckpoints.batchIndex,
        loadedUpTo: migrationCheckpoints.loadedUpTo,
        transformVersion: migrationCheckpoints.transformVersion,
        updatedAt: migrationCheckpoints.updatedAt,
      })
      .from(migrationCheckpoints)
      .where(
        and(
          eq(migrationCheckpoints.orgId, orgId),
          eq(migrationCheckpoints.migrationJobId, jobId),
        ),
      );

    return rows;
  }

  // ── Merge Explanations ────────────────────────────────

  async listMergeExplanations(
    orgId: string,
    jobId: string,
    opts?: { decision?: string; limit?: number; offset?: number },
  ): Promise<MergeExplanationEntry[]> {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    const conditions = [
      eq(migrationMergeExplanations.orgId, orgId),
      eq(migrationMergeExplanations.migrationJobId, jobId),
    ];
    if (opts?.decision) {
      conditions.push(eq(migrationMergeExplanations.decision, opts.decision));
    }

    const rows = await this.db
      .select({
        id: migrationMergeExplanations.id,
        entityType: migrationMergeExplanations.entityType,
        legacyId: migrationMergeExplanations.legacyId,
        targetId: migrationMergeExplanations.targetId,
        decision: migrationMergeExplanations.decision,
        scoreTotal: migrationMergeExplanations.scoreTotal,
        reasons: migrationMergeExplanations.reasons,
        createdAt: migrationMergeExplanations.createdAt,
      })
      .from(migrationMergeExplanations)
      .where(and(...conditions))
      .orderBy(desc(migrationMergeExplanations.createdAt))
      .limit(limit)
      .offset(offset);

    return rows;
  }

  // ── Aggregate Stats ───────────────────────────────────

  async getJobStats(orgId: string, jobId: string): Promise<JobStats> {
    const [quarantined, explanations, committed, reserved] = await Promise.all([
      this.db
        .select({ value: count() })
        .from(migrationQuarantine)
        .where(
          and(
            eq(migrationQuarantine.orgId, orgId),
            eq(migrationQuarantine.migrationJobId, jobId),
          ),
        ),
      this.db
        .select({ value: count() })
        .from(migrationMergeExplanations)
        .where(
          and(
            eq(migrationMergeExplanations.orgId, orgId),
            eq(migrationMergeExplanations.migrationJobId, jobId),
          ),
        ),
      this.db
        .select({ value: count() })
        .from(migrationLineage)
        .where(
          and(
            eq(migrationLineage.orgId, orgId),
            eq(migrationLineage.migrationJobId, jobId),
            eq(migrationLineage.state, 'committed'),
          ),
        ),
      this.db
        .select({ value: count() })
        .from(migrationLineage)
        .where(
          and(
            eq(migrationLineage.orgId, orgId),
            eq(migrationLineage.migrationJobId, jobId),
            eq(migrationLineage.state, 'reserved'),
          ),
        ),
    ]);

    const job = await this.getJob(orgId, jobId);

    return {
      totalRecords: (job?.recordsSuccess ?? 0) + (job?.recordsFailed ?? 0),
      quarantinedCount: quarantined[0]?.value ?? 0,
      mergeExplanationCount: explanations[0]?.value ?? 0,
      lineageCommittedCount: committed[0]?.value ?? 0,
      lineageReservedCount: reserved[0]?.value ?? 0,
    };
  }
}
