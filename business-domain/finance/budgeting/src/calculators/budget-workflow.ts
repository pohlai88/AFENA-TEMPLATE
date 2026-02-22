import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-06 / BU-08 — Budget Workflow Approval
 *
 * Manages budget submission lifecycle with multi-level approval,
 * delegation rules, and status tracking.
 *
 * Pure function — no I/O.
 */

export type ApprovalLevel = {
  level: number;
  approverRole: string;
  thresholdMinor: number;
};

export type BudgetSubmission = {
  submissionId: string;
  departmentId: string;
  submittedBy: string;
  totalAmountMinor: number;
  periodKey: string;
  currentStatus: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'returned';
  approvalHistory: { level: number; approverRole: string; action: 'approve' | 'reject' | 'return'; timestamp: string }[];
};

export type WorkflowResult = {
  submissionId: string;
  requiredLevels: ApprovalLevel[];
  currentLevel: number;
  nextApproverRole: string | null;
  isFullyApproved: boolean;
  isRejected: boolean;
  pendingLevels: number;
};

/**
 * Evaluate budget submission against approval workflow.
 *
 * Higher amounts require more approval levels.
 */
export function evaluateBudgetWorkflow(
  submission: BudgetSubmission,
  approvalLevels: ApprovalLevel[],
): CalculatorResult<WorkflowResult> {
  if (approvalLevels.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one approval level required');
  }
  if (submission.totalAmountMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Budget amount must be non-negative');
  }

  const sorted = [...approvalLevels].sort((a, b) => a.level - b.level);
  const requiredLevels = sorted.filter((l) => submission.totalAmountMinor >= l.thresholdMinor);

  if (requiredLevels.length === 0) {
    return {
      result: {
        submissionId: submission.submissionId,
        requiredLevels: [],
        currentLevel: 0,
        nextApproverRole: null,
        isFullyApproved: true,
        isRejected: false,
        pendingLevels: 0,
      },
      inputs: { submissionId: submission.submissionId, levelCount: approvalLevels.length },
      explanation: `Budget ${submission.submissionId}: auto-approved (below all thresholds)`,
    };
  }

  const approvedLevels = submission.approvalHistory
    .filter((h) => h.action === 'approve')
    .map((h) => h.level);
  const rejectedLevels = submission.approvalHistory
    .filter((h) => h.action === 'reject')
    .map((h) => h.level);

  const isRejected = rejectedLevels.length > 0;
  const currentLevel = approvedLevels.length;
  const isFullyApproved = !isRejected && currentLevel >= requiredLevels.length;
  const nextLevel = requiredLevels[currentLevel] ?? null;
  const pendingLevels = Math.max(0, requiredLevels.length - currentLevel);

  return {
    result: {
      submissionId: submission.submissionId,
      requiredLevels,
      currentLevel,
      nextApproverRole: isRejected || isFullyApproved ? null : (nextLevel?.approverRole ?? null),
      isFullyApproved,
      isRejected,
      pendingLevels: isRejected ? 0 : pendingLevels,
    },
    inputs: { submissionId: submission.submissionId, levelCount: approvalLevels.length },
    explanation: isRejected
      ? `Budget ${submission.submissionId}: rejected at level ${rejectedLevels[0]}`
      : isFullyApproved
        ? `Budget ${submission.submissionId}: fully approved (${requiredLevels.length} levels)`
        : `Budget ${submission.submissionId}: level ${currentLevel}/${requiredLevels.length}, next: ${nextLevel?.approverRole}`,
  };
}
