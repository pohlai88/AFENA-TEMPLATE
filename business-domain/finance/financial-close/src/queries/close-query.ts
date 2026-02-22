/**
 * Financial Close Queries
 *
 * Read operations against close_tasks and close_evidence tables.
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { closeEvidence, closeTasks } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

/* ---------- Close Task Read Models ---------- */

export interface CloseTaskReadModel {
  id: string;
  orgId: string;
  ledgerId: string;
  fiscalYear: string;
  periodNumber: string;
  taskCode: string;
  name: string;
  category: 'pre-close' | 'close' | 'post-close' | 'review';
  sequenceOrder: number;
  taskStatus: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'blocked';
  completedBy: string | null;
  completedAt: Date | null;
  dependsOn: unknown; // JSONB
  notes: string | null;
}

const CLOSE_TASK_SELECT = {
  id: closeTasks.id,
  orgId: closeTasks.orgId,
  ledgerId: closeTasks.ledgerId,
  fiscalYear: closeTasks.fiscalYear,
  periodNumber: closeTasks.periodNumber,
  taskCode: closeTasks.taskCode,
  name: closeTasks.name,
  category: closeTasks.category,
  sequenceOrder: closeTasks.sequenceOrder,
  taskStatus: closeTasks.taskStatus,
  completedBy: closeTasks.completedBy,
  completedAt: closeTasks.completedAt,
  dependsOn: closeTasks.dependsOn,
  notes: closeTasks.notes,
} satisfies { [K in keyof CloseTaskReadModel]: unknown };

export interface CloseEvidenceReadModel {
  id: string;
  orgId: string;
  closeTaskId: string;
  evidenceType: 'attachment' | 'sign-off' | 'report' | 'screenshot' | 'note';
  title: string;
  description: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  providedBy: string;
  providedAt: Date;
}

/* ---------- Queries ---------- */

export async function getCloseTasksByPeriod(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; fiscalYear: string; periodNumber: string },
): Promise<CloseTaskReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select(CLOSE_TASK_SELECT)
      .from(closeTasks)
      .where(
        and(
          eq(closeTasks.orgId, ctx.orgId),
          eq(closeTasks.ledgerId, input.ledgerId),
          eq(closeTasks.fiscalYear, input.fiscalYear),
          eq(closeTasks.periodNumber, input.periodNumber),
          eq(closeTasks.isDeleted, false),
        ),
      ),
  );
  return rows as CloseTaskReadModel[];
}

export async function getCloseTask(
  db: DbSession,
  ctx: DomainContext,
  taskId: string,
): Promise<CloseTaskReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select(CLOSE_TASK_SELECT)
      .from(closeTasks)
      .where(and(eq(closeTasks.orgId, ctx.orgId), eq(closeTasks.id, taskId), eq(closeTasks.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`Close task ${taskId} not found`);
  return rows[0] as CloseTaskReadModel;
}

export async function getCloseEvidence(
  db: DbSession,
  ctx: DomainContext,
  taskId: string,
): Promise<CloseEvidenceReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(closeEvidence)
      .where(and(eq(closeEvidence.orgId, ctx.orgId), eq(closeEvidence.closeTaskId, taskId), eq(closeEvidence.isDeleted, false))),
  );
  return rows as CloseEvidenceReadModel[];  // TODO: PR-2B2 — add CLOSE_EVIDENCE_SELECT constant
}
