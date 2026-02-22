import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see PR-04 — Restructuring provision (IAS 37 §70–83)
 * @see PR-05 — Environmental / decommissioning obligation (IAS 37 §36)
 * @see PR-07 — Onerous Contract Provision (IAS 37 §66)
 * @see PR-08 — Warranty provision estimation
 * @see PR-09 — Legal claim provision (probable + estimable)
 * Pure function — no I/O.
 */

export type OnerousContractInput = { contractId: string; remainingRevenueMinor: number; unavoidableCostMinor: number; terminationPenaltyMinor: number };

export type OnerousContractResult = { contractId: string; isOnerous: boolean; leastNetCostMinor: number; provisionMinor: number; recommendation: 'continue' | 'terminate' };

export function evaluateOnerousContract(input: OnerousContractInput): CalculatorResult<OnerousContractResult> {
  if (input.unavoidableCostMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Costs must be non-negative');
  const costToContinue = input.unavoidableCostMinor - input.remainingRevenueMinor;
  const costToTerminate = input.terminationPenaltyMinor;
  const leastNetCostMinor = Math.min(Math.max(0, costToContinue), costToTerminate);
  const isOnerous = costToContinue > 0;
  const recommendation = costToContinue <= costToTerminate ? 'continue' : 'terminate';
  return { result: { contractId: input.contractId, isOnerous, leastNetCostMinor, provisionMinor: isOnerous ? leastNetCostMinor : 0, recommendation }, inputs: input, explanation: `Onerous contract ${input.contractId}: ${isOnerous ? 'YES' : 'NO'}, provision=${isOnerous ? leastNetCostMinor : 0}` };
}
