/**
 * IAS 24 — IC Dispute Classification
 *
 * Classifies intercompany balance discrepancies by severity and type
 * to prioritise reconciliation efforts.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IcDisputeInput = {
  senderAmountMinor: number;
  receiverAmountMinor: number;
  currency: string;
  transactionDate: string;
  daysSinceTransaction: number;
};

export type IcDisputeClassificationResult = {
  discrepancyMinor: number;
  discrepancyPct: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'timing' | 'amount' | 'missing' | 'fx';
  explanation: string;
};

export function classifyIcDispute(
  inputs: IcDisputeInput,
): CalculatorResult<IcDisputeClassificationResult> {
  const { senderAmountMinor, receiverAmountMinor, daysSinceTransaction } = inputs;

  if (senderAmountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Sender amount cannot be negative');

  const discrepancyMinor = Math.abs(senderAmountMinor - receiverAmountMinor);
  const base = Math.max(senderAmountMinor, receiverAmountMinor, 1);
  const discrepancyPct = `${((discrepancyMinor / base) * 100).toFixed(2)}%`;

  const category: IcDisputeClassificationResult['category'] =
    receiverAmountMinor === 0 ? 'missing'
      : discrepancyMinor === 0 && daysSinceTransaction > 30 ? 'timing'
        : discrepancyMinor > 0 && discrepancyMinor < base * 0.01 ? 'fx'
          : 'amount';

  const severity: IcDisputeClassificationResult['severity'] =
    discrepancyMinor === 0 ? 'low'
      : discrepancyMinor < base * 0.01 ? 'low'
        : discrepancyMinor < base * 0.05 ? 'medium'
          : discrepancyMinor < base * 0.10 ? 'high'
            : 'critical';

  const explanation =
    `IC dispute: discrepancy ${discrepancyMinor} (${discrepancyPct}), ` +
    `category: ${category}, severity: ${severity}, age: ${daysSinceTransaction}d`;

  return {
    result: { discrepancyMinor, discrepancyPct, severity, category, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
