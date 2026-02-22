import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AR-05 — Write-off workflow with approval gate
 */
export type WriteOffRequest = {
  invoiceId: string;
  customerName: string;
  outstandingMinor: number;
  daysPastDue: number;
  approverRole: string;
  reason: string;
};

export type WriteOffResult = {
  approved: boolean;
  writeOffMinor: number;
  approvalLevel: 'auto' | 'manager' | 'director' | 'cfo';
  reason: string;
};

const THRESHOLDS = [
  { maxMinor: 10_000, level: 'auto' as const },
  { maxMinor: 100_000, level: 'manager' as const },
  { maxMinor: 500_000, level: 'director' as const },
  { maxMinor: Infinity, level: 'cfo' as const },
];

const ROLE_RANK: Record<string, number> = { auto: 0, manager: 1, director: 2, cfo: 3 };

export function evaluateWriteOff(
  request: WriteOffRequest,
): CalculatorResult<WriteOffResult> {
  if (request.outstandingMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Outstanding amount must be positive');
  }
  if (request.daysPastDue < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Days past due cannot be negative');
  }

  const required = THRESHOLDS.find((t) => request.outstandingMinor <= t.maxMinor)!;
  const approverRank = ROLE_RANK[request.approverRole] ?? -1;
  const requiredRank = ROLE_RANK[required.level] ?? 0;
  const approved = approverRank >= requiredRank;

  return {
    result: {
      approved,
      writeOffMinor: approved ? request.outstandingMinor : 0,
      approvalLevel: required.level,
      reason: request.reason,
    },
    inputs: { invoiceId: request.invoiceId, outstandingMinor: request.outstandingMinor },
    explanation: approved
      ? `Write-off of ${request.outstandingMinor} approved at ${required.level} level for invoice ${request.invoiceId} (${request.daysPastDue} days overdue).`
      : `Write-off requires ${required.level} approval but approver is ${request.approverRole}. Escalation needed.`,
  };
}
