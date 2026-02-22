import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see RR-02 — Performance obligation (POB) identification per contract
 */
export type PerformanceObligation = {
  id: string;
  standalonePriceMinor: number;
  description: string;
};

export type AllocatedObligation = {
  id: string;
  allocatedMinor: number;
  percentage: number;
};

export function allocateTransactionPrice(
  transactionPriceMinor: number,
  obligations: PerformanceObligation[],
): CalculatorResult<AllocatedObligation[]> {
  if (!Number.isInteger(transactionPriceMinor) || transactionPriceMinor <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `transactionPriceMinor must be a positive integer, got ${transactionPriceMinor}`,
    );
  }
  if (obligations.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'obligations must not be empty');
  }

  const totalStandalone = obligations.reduce((sum, o) => sum + o.standalonePriceMinor, 0);
  if (totalStandalone <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'total standalone price must be positive');
  }

  let allocated = 0;
  const results: AllocatedObligation[] = obligations.map((o, i) => {
    const percentage = o.standalonePriceMinor / totalStandalone;
    const isLast = i === obligations.length - 1;
    const amount = isLast
      ? transactionPriceMinor - allocated
      : Math.round(transactionPriceMinor * percentage);
    allocated += amount;
    return { id: o.id, allocatedMinor: amount, percentage: Math.round(percentage * 10000) / 10000 };
  });

  return {
    result: results,
    inputs: { transactionPriceMinor, obligations },
    explanation: `Allocated ${transactionPriceMinor} across ${obligations.length} obligations`,
  };
}
