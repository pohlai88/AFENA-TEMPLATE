/**
 * Financial Close Service
 *
 * Orchestrates period-end close:
 * - Fetches close checklist (tasks) for a period
 * - Resolves task dependencies and identifies ready tasks
 * - Completes individual tasks with evidence
 * - Finalizes close run when all tasks done
 * - Posts closing adjustments
 * - Hard-locks period after finalization
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { EvidenceRequirement } from '../calculators/close-validation';
import { summarizeValidation, validateCloseEvidence } from '../calculators/close-validation';
import type { CloseTaskNode } from '../calculators/dependency-resolver';
import {
  computeCloseProgress,
  isCloseComplete,
  resolveCloseDependencies,
} from '../calculators/dependency-resolver';
import {
  buildAdjustmentPostIntent,
  buildCompleteTaskIntent,
  buildFinalizeRunIntent,
  buildHardLockIntent,
} from '../commands/close-intent';
import { getCloseEvidence, getCloseTask, getCloseTasksByPeriod } from '../queries/close-query';

/* ---------- Read Operations ---------- */

export async function fetchCloseChecklist(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; fiscalYear: string; periodNumber: string },
): Promise<DomainResult> {
  const tasks = await getCloseTasksByPeriod(db, ctx, input);

  const nodes: CloseTaskNode[] = tasks.map((t) => ({
    id: t.id,
    taskCode: t.taskCode,
    category: t.category,
    sequenceOrder: t.sequenceOrder,
    taskStatus: t.taskStatus,
    dependsOn: Array.isArray(t.dependsOn) ? (t.dependsOn as string[]) : [],
  }));

  const { result: depResult } = resolveCloseDependencies(nodes);
  const { result: progress } = computeCloseProgress(nodes);

  return {
    kind: 'read',
    data: {
      tasks,
      executionOrder: depResult.executionOrder.map((n) => n.id),
      readyTasks: depResult.readyTasks.map((n) => n.id),
      hasCycle: depResult.hasCycle,
      progress,
    },
  };
}

export async function fetchCloseStatus(
  db: DbSession,
  ctx: DomainContext,
  input: { ledgerId: string; fiscalYear: string; periodNumber: string },
): Promise<DomainResult> {
  const tasks = await getCloseTasksByPeriod(db, ctx, input);

  const nodes: CloseTaskNode[] = tasks.map((t) => ({
    id: t.id,
    taskCode: t.taskCode,
    category: t.category,
    sequenceOrder: t.sequenceOrder,
    taskStatus: t.taskStatus,
    dependsOn: Array.isArray(t.dependsOn) ? (t.dependsOn as string[]) : [],
  }));

  const { result: progress } = computeCloseProgress(nodes);
  const { result: complete } = isCloseComplete(nodes);

  return {
    kind: 'read',
    data: { isComplete: complete, progress },
  };
}

export async function fetchTaskEvidence(
  db: DbSession,
  ctx: DomainContext,
  taskId: string,
): Promise<DomainResult> {
  const evidence = await getCloseEvidence(db, ctx, taskId);
  return { kind: 'read', data: { evidence } };
}

/* ---------- Write Operations ---------- */

export async function completeTask(
  db: DbSession,
  ctx: DomainContext,
  input: { closeRunId: string; taskId: string; evidenceRef?: string },
): Promise<DomainResult> {
  // Validate task exists and is in valid state
  const task = await getCloseTask(db, ctx, input.taskId);

  if (task.taskStatus === 'completed') {
    throw new Error(`Task ${input.taskId} is already completed`);
  }
  if (task.taskStatus === 'blocked') {
    throw new Error(`Task ${input.taskId} is blocked — resolve dependencies first`);
  }

  return {
    kind: 'intent',
    intents: [
      buildCompleteTaskIntent(
        {
          closeRunId: input.closeRunId,
          taskId: input.taskId,
          ...(input.evidenceRef ? { evidenceRef: input.evidenceRef } : {}),
        },
        stableCanonicalJson({ closeRunId: input.closeRunId, taskId: input.taskId }),
      ),
    ],
  };
}

export async function finalizeCloseRun(
  db: DbSession,
  ctx: DomainContext,
  input: {
    closeRunId: string;
    ledgerId: string;
    fiscalYear: string;
    periodNumber: string;
    companyId: string;
  },
): Promise<DomainResult> {
  // Fetch all tasks and verify completeness
  const tasks = await getCloseTasksByPeriod(db, ctx, {
    ledgerId: input.ledgerId,
    fiscalYear: input.fiscalYear,
    periodNumber: input.periodNumber,
  });

  const nodes: CloseTaskNode[] = tasks.map((t) => ({
    id: t.id,
    taskCode: t.taskCode,
    category: t.category,
    sequenceOrder: t.sequenceOrder,
    taskStatus: t.taskStatus,
    dependsOn: Array.isArray(t.dependsOn) ? (t.dependsOn as string[]) : [],
  }));

  if (!isCloseComplete(nodes).result) {
    const { result: progress } = computeCloseProgress(nodes);
    throw new Error(
      `Cannot finalize: ${progress.pending} tasks pending, ${progress.blocked} blocked`,
    );
  }

  const periodKey = `${input.fiscalYear}-P${String(input.periodNumber).padStart(2, '0')}`;

  return {
    kind: 'intent',
    intents: [
      buildFinalizeRunIntent({
        closeRunId: input.closeRunId,
        periodKey,
        companyId: input.companyId,
        taskCount: tasks.length,
      }),
    ],
  };
}

export async function postAdjustment(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    closeRunId: string;
    journalId: string;
    effectiveAt: string;
    adjustmentType: 'accrual' | 'reclassification' | 'allocation' | 'manual';
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildAdjustmentPostIntent({
        closeRunId: input.closeRunId,
        journalId: input.journalId,
        effectiveAt: input.effectiveAt,
        adjustmentType: input.adjustmentType,
      }),
    ],
  };
}

export async function hardLockPeriod(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    closeRunId: string;
    periodKey: string;
    companyId: string;
    ledgerId: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildHardLockIntent({
        closeRunId: input.closeRunId,
        periodKey: input.periodKey,
        companyId: input.companyId,
        ledgerId: input.ledgerId,
      }),
    ],
  };
}

/* ---------- Validation ---------- */

export function validateCloseReadiness(evidenceRequirements: EvidenceRequirement[]): {
  allPassed: boolean;
  passedCount: number;
  failedCount: number;
  failures: unknown[];
} {
  const { result: checks } = validateCloseEvidence(evidenceRequirements);
  const { result: summary } = summarizeValidation(checks);
  return summary;
}

/* ---------- Evidence Pack ---------- */

/**
 * @see FIN-CLOSE-PACK-01 — Generate a close evidence pack.
 *
 * Assembles trial balance, reconciliation summaries, run logs, and
 * approval records into a single evidence pack for the period.
 */
export type CloseEvidencePack = {
  periodKey: string;
  companyId: string;
  ledgerId: string;
  generatedAt: string;
  taskSummary: { total: number; completed: number; blocked: number };
  artifacts: Array<{ name: string; kind: string; ref: string }>;
  signedOffBy: string | null;
};

export async function generateClosePack(
  db: DbSession,
  ctx: DomainContext,
  input: {
    closeRunId: string;
    ledgerId: string;
    fiscalYear: string;
    periodNumber: string;
    companyId: string;
  },
): Promise<DomainResult<CloseEvidencePack>> {
  const tasks = await getCloseTasksByPeriod(db, ctx, {
    ledgerId: input.ledgerId,
    fiscalYear: input.fiscalYear,
    periodNumber: input.periodNumber,
  });

  const nodes: CloseTaskNode[] = tasks.map((t) => ({
    id: t.id,
    taskCode: t.taskCode,
    category: t.category,
    sequenceOrder: t.sequenceOrder,
    taskStatus: t.taskStatus,
    dependsOn: Array.isArray(t.dependsOn) ? (t.dependsOn as string[]) : [],
  }));

  const { result: progress } = computeCloseProgress(nodes);
  const periodKey = `${input.fiscalYear}-P${String(input.periodNumber).padStart(2, '0')}`;

  const pack: CloseEvidencePack = {
    periodKey,
    companyId: input.companyId,
    ledgerId: input.ledgerId,
    generatedAt: input.generatedAt,
    taskSummary: {
      total: progress.total,
      completed: progress.completed,
      blocked: progress.blocked,
    },
    artifacts: tasks
      .filter((t) => t.taskStatus === 'completed')
      .map((t) => ({
        name: t.taskCode,
        kind: t.category,
        ref: t.id,
      })),
    signedOffBy: isCloseComplete(nodes).result ? ctx.actor.userId : null,
  };

  return { kind: 'read', data: pack };
}
