import { describe, expect, it } from 'vitest';
import { evaluateBudgetWorkflow } from '../calculators/budget-workflow';
import type { ApprovalLevel, BudgetSubmission } from '../calculators/budget-workflow';

const levels: ApprovalLevel[] = [
  { level: 1, approverRole: 'dept_head', thresholdMinor: 0 },
  { level: 2, approverRole: 'finance_director', thresholdMinor: 500000 },
  { level: 3, approverRole: 'cfo', thresholdMinor: 2000000 },
];

describe('evaluateBudgetWorkflow', () => {
  it('determines required approval levels based on amount', () => {
    const sub: BudgetSubmission = { submissionId: 's1', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 1000000, periodKey: '2026-Q1', currentStatus: 'submitted', approvalHistory: [] };
    const { result } = evaluateBudgetWorkflow(sub, levels);
    expect(result.requiredLevels).toHaveLength(2);
    expect(result.nextApproverRole).toBe('dept_head');
  });

  it('tracks approval progress', () => {
    const sub: BudgetSubmission = { submissionId: 's2', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 1000000, periodKey: '2026-Q1', currentStatus: 'in_review', approvalHistory: [{ level: 1, approverRole: 'dept_head', action: 'approve', timestamp: '2026-01-15' }] };
    const { result } = evaluateBudgetWorkflow(sub, levels);
    expect(result.currentLevel).toBe(1);
    expect(result.nextApproverRole).toBe('finance_director');
    expect(result.pendingLevels).toBe(1);
  });

  it('marks fully approved when all levels done', () => {
    const sub: BudgetSubmission = { submissionId: 's3', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 100000, periodKey: '2026-Q1', currentStatus: 'approved', approvalHistory: [{ level: 1, approverRole: 'dept_head', action: 'approve', timestamp: '2026-01-15' }] };
    const { result } = evaluateBudgetWorkflow(sub, levels);
    expect(result.isFullyApproved).toBe(true);
    expect(result.nextApproverRole).toBeNull();
  });

  it('detects rejection', () => {
    const sub: BudgetSubmission = { submissionId: 's4', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 1000000, periodKey: '2026-Q1', currentStatus: 'rejected', approvalHistory: [{ level: 1, approverRole: 'dept_head', action: 'reject', timestamp: '2026-01-15' }] };
    const { result } = evaluateBudgetWorkflow(sub, levels);
    expect(result.isRejected).toBe(true);
    expect(result.nextApproverRole).toBeNull();
  });

  it('auto-approves below all thresholds when no levels match', () => {
    const highLevels: ApprovalLevel[] = [{ level: 1, approverRole: 'cfo', thresholdMinor: 10000000 }];
    const sub: BudgetSubmission = { submissionId: 's5', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 100, periodKey: '2026-Q1', currentStatus: 'submitted', approvalHistory: [] };
    const { result } = evaluateBudgetWorkflow(sub, highLevels);
    expect(result.isFullyApproved).toBe(true);
  });

  it('throws for empty levels', () => {
    const sub: BudgetSubmission = { submissionId: 's6', departmentId: 'd1', submittedBy: 'u1', totalAmountMinor: 100, periodKey: '2026-Q1', currentStatus: 'draft', approvalHistory: [] };
    expect(() => evaluateBudgetWorkflow(sub, [])).toThrow('At least one approval level');
  });
});
