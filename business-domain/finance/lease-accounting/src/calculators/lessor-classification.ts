import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see LA-07 — Low-value asset exemption
 * LA-10 — Lessor Accounting: Finance vs Operating Lease Classification (IFRS 16 §61)
 *
 * Classifies a lease from the lessor's perspective based on IFRS 16 §63 indicators:
 * - Transfer of ownership
 * - Bargain purchase option
 * - Lease term = major part of economic life
 * - PV of payments = substantially all of fair value
 * - Specialised asset
 *
 * Pure function — no I/O.
 */

export type LessorLeaseInput = {
  leaseId: string;
  transfersOwnership: boolean;
  hasBargainPurchaseOption: boolean;
  leaseTermMonths: number;
  economicLifeMonths: number;
  pvOfPaymentsMinor: number;
  fairValueMinor: number;
  isSpecialisedAsset: boolean;
};

export type LessorClassificationResult = {
  leaseId: string;
  classification: 'finance' | 'operating';
  indicators: string[];
  leaseTermRatioPct: number;
  pvToFairValueRatioPct: number;
};

const MAJOR_PART_THRESHOLD = 75;
const SUBSTANTIALLY_ALL_THRESHOLD = 90;

export function classifyLessorLease(
  input: LessorLeaseInput,
): CalculatorResult<LessorClassificationResult> {
  if (input.fairValueMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Fair value must be positive');
  }
  if (input.economicLifeMonths <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Economic life must be positive');
  }

  const indicators: string[] = [];
  const leaseTermRatioPct = Math.round((input.leaseTermMonths / input.economicLifeMonths) * 100);
  const pvToFairValueRatioPct = Math.round((input.pvOfPaymentsMinor / input.fairValueMinor) * 100);

  if (input.transfersOwnership) indicators.push('Transfers ownership (§63a)');
  if (input.hasBargainPurchaseOption) indicators.push('Bargain purchase option (§63b)');
  if (leaseTermRatioPct >= MAJOR_PART_THRESHOLD) indicators.push(`Lease term ${leaseTermRatioPct}% of economic life (§63c)`);
  if (pvToFairValueRatioPct >= SUBSTANTIALLY_ALL_THRESHOLD) indicators.push(`PV ${pvToFairValueRatioPct}% of fair value (§63d)`);
  if (input.isSpecialisedAsset) indicators.push('Specialised asset (§63e)');

  const classification = indicators.length > 0 ? 'finance' : 'operating';

  return {
    result: { leaseId: input.leaseId, classification, indicators, leaseTermRatioPct, pvToFairValueRatioPct },
    inputs: input,
    explanation: `Lessor classification: ${classification} lease, ${indicators.length} indicator(s)`,
  };
}
