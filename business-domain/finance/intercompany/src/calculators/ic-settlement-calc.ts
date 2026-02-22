/**
 * IAS 24 — IC Settlement Calculation
 *
 * Computes settlement amounts for intercompany balances including
 * FX conversion and payment scheduling.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IcSettlementInput = {
  balanceMinor: number;
  balanceCurrency: string;
  settlementCurrency: string;
  fxRate: number;
  paymentTermDays: number;
  isOverdue: boolean;
};

export type IcSettlementResult = {
  settlementAmountMinor: number;
  fxGainLossMinor: number;
  dueDate: string;
  priority: 'normal' | 'urgent' | 'overdue';
  explanation: string;
};

export function computeIcSettlement(
  inputs: IcSettlementInput,
): CalculatorResult<IcSettlementResult> {
  const { balanceMinor, balanceCurrency, settlementCurrency, fxRate, paymentTermDays, isOverdue } = inputs;

  if (balanceMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Balance cannot be negative');
  if (fxRate <= 0) throw new DomainError('VALIDATION_FAILED', 'FX rate must be positive');

  const settlementAmountMinor = balanceCurrency === settlementCurrency
    ? balanceMinor
    : Math.round(balanceMinor * fxRate);

  const fxGainLossMinor = settlementAmountMinor - balanceMinor;

  const now = new Date();
  now.setDate(now.getDate() + paymentTermDays);
  const dueDate = now.toISOString().split('T')[0]!;

  const priority: IcSettlementResult['priority'] = isOverdue ? 'overdue' : paymentTermDays <= 7 ? 'urgent' : 'normal';

  const explanation =
    `IC settlement: ${balanceMinor} ${balanceCurrency} → ${settlementAmountMinor} ${settlementCurrency} ` +
    `(rate ${fxRate}), FX effect ${fxGainLossMinor}, priority: ${priority}`;

  return {
    result: { settlementAmountMinor, fxGainLossMinor, dueDate, priority, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
