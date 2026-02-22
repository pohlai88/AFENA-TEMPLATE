import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-13 / BR-09 — Reconciliation Sign-Off with Evidence
 *
 * Validates reconciliation completeness and generates sign-off evidence
 * package with unmatched items, variance analysis, and approval status.
 *
 * Pure function — no I/O.
 */

export type ReconSummary = {
  accountId: string;
  periodKey: string;
  bankBalanceMinor: number;
  glBalanceMinor: number;
  matchedCount: number;
  unmatchedBankCount: number;
  unmatchedGlCount: number;
  unmatchedBankTotalMinor: number;
  unmatchedGlTotalMinor: number;
};

export type SignOffEvidence = {
  accountId: string;
  periodKey: string;
  varianceMinor: number;
  adjustedBankBalanceMinor: number;
  adjustedGlBalanceMinor: number;
  isReconciled: boolean;
  matchRate: number;
  unmatchedItemCount: number;
  signOffStatus: 'ready' | 'pending_review' | 'blocked';
  blockReasons: string[];
  evidenceItems: string[];
};

export type SignOffThresholds = {
  maxVarianceMinor: number;
  minMatchRatePct: number;
  maxUnmatchedItems: number;
};

const DEFAULT_THRESHOLDS: SignOffThresholds = {
  maxVarianceMinor: 100,
  minMatchRatePct: 95,
  maxUnmatchedItems: 10,
};

export function evaluateReconSignOff(
  summary: ReconSummary,
  thresholds: SignOffThresholds = DEFAULT_THRESHOLDS,
): CalculatorResult<SignOffEvidence> {
  if (!summary.accountId || !summary.periodKey) {
    throw new DomainError('VALIDATION_FAILED', 'Account ID and period key are required');
  }

  const adjustedBankBalanceMinor = summary.bankBalanceMinor - summary.unmatchedBankTotalMinor;
  const adjustedGlBalanceMinor = summary.glBalanceMinor - summary.unmatchedGlTotalMinor;
  const varianceMinor = Math.abs(adjustedBankBalanceMinor - adjustedGlBalanceMinor);

  const totalItems = summary.matchedCount + summary.unmatchedBankCount + summary.unmatchedGlCount;
  const matchRate = totalItems === 0 ? 100 : Math.round((summary.matchedCount / totalItems) * 10000) / 100;
  const unmatchedItemCount = summary.unmatchedBankCount + summary.unmatchedGlCount;

  const blockReasons: string[] = [];
  if (varianceMinor > thresholds.maxVarianceMinor) {
    blockReasons.push(`Variance ${varianceMinor} exceeds threshold ${thresholds.maxVarianceMinor}`);
  }
  if (matchRate < thresholds.minMatchRatePct) {
    blockReasons.push(`Match rate ${matchRate}% below minimum ${thresholds.minMatchRatePct}%`);
  }
  if (unmatchedItemCount > thresholds.maxUnmatchedItems) {
    blockReasons.push(`${unmatchedItemCount} unmatched items exceed limit ${thresholds.maxUnmatchedItems}`);
  }

  const isReconciled = varianceMinor === 0;
  let signOffStatus: 'ready' | 'pending_review' | 'blocked';
  if (blockReasons.length > 0) signOffStatus = 'blocked';
  else if (!isReconciled || unmatchedItemCount > 0) signOffStatus = 'pending_review';
  else signOffStatus = 'ready';

  const evidenceItems = [
    `Bank balance: ${summary.bankBalanceMinor}`,
    `GL balance: ${summary.glBalanceMinor}`,
    `Matched: ${summary.matchedCount} items`,
    `Unmatched bank: ${summary.unmatchedBankCount} (${summary.unmatchedBankTotalMinor})`,
    `Unmatched GL: ${summary.unmatchedGlCount} (${summary.unmatchedGlTotalMinor})`,
    `Adjusted variance: ${varianceMinor}`,
    `Match rate: ${matchRate}%`,
  ];

  return {
    result: {
      accountId: summary.accountId,
      periodKey: summary.periodKey,
      varianceMinor,
      adjustedBankBalanceMinor,
      adjustedGlBalanceMinor,
      isReconciled,
      matchRate,
      unmatchedItemCount,
      signOffStatus,
      blockReasons,
      evidenceItems,
    },
    inputs: { summary, thresholds },
    explanation: `Recon ${summary.accountId}/${summary.periodKey}: ${signOffStatus}, variance ${varianceMinor}, match rate ${matchRate}%`,
  };
}
