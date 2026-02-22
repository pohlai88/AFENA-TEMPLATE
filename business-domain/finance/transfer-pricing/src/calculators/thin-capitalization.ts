import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TP-09 — Thin Capitalization: Interest Deductibility Limits (OECD BEPS Action 4)
 * Pure function — no I/O.
 */

export type ThinCapInput = { entityId: string; totalDebtMinor: number; totalEquityMinor: number; interestExpenseMinor: number; ebitdaMinor: number; maxDebtEquityRatio: number; maxInterestToEbitdaPct: number };

export type ThinCapResult = { entityId: string; debtEquityRatio: number; interestToEbitdaPct: number; debtEquityBreached: boolean; interestCapBreached: boolean; disallowedInterestMinor: number; allowedInterestMinor: number };

export function evaluateThinCapitalization(input: ThinCapInput): CalculatorResult<ThinCapResult> {
  if (input.totalEquityMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Equity must be positive');
  const debtEquityRatio = Math.round((input.totalDebtMinor / input.totalEquityMinor) * 100) / 100;
  const interestToEbitdaPct = input.ebitdaMinor > 0 ? Math.round((input.interestExpenseMinor / input.ebitdaMinor) * 10000) / 100 : 100;
  const debtEquityBreached = debtEquityRatio > input.maxDebtEquityRatio;
  const interestCapBreached = interestToEbitdaPct > input.maxInterestToEbitdaPct;
  const maxAllowedByEbitda = Math.round(input.ebitdaMinor * input.maxInterestToEbitdaPct / 100);
  const allowedInterestMinor = interestCapBreached ? maxAllowedByEbitda : input.interestExpenseMinor;
  const disallowedInterestMinor = Math.max(0, input.interestExpenseMinor - allowedInterestMinor);
  return { result: { entityId: input.entityId, debtEquityRatio, interestToEbitdaPct, debtEquityBreached, interestCapBreached, disallowedInterestMinor, allowedInterestMinor }, inputs: input, explanation: `Thin cap ${input.entityId}: D/E=${debtEquityRatio}, interest/EBITDA=${interestToEbitdaPct}%, disallowed=${disallowedInterestMinor}` };
}
