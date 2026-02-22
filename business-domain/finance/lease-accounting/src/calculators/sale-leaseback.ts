import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * LA-09 — Sale-and-Leaseback (IFRS 16 §98-103)
 *
 * When a transfer of an asset satisfies IFRS 15 requirements for a sale:
 * - Seller-lessee: derecognises the asset, recognises ROU asset for the
 *   retained portion, and recognises gain/loss only on the rights transferred.
 * - Buyer-lessor: accounts for the purchase per applicable standards and
 *   the lease per IFRS 16 lessor accounting.
 *
 * Pure function — no I/O.
 */

export type SaleLeasebackInput = {
  assetCarryingMinor: number;
  salePriceMinor: number;
  fairValueMinor: number;
  presentValueOfLeasePaymentsMinor: number;
  leaseTermMonths: number;
  usefulLifeRemainingMonths: number;
};

export type SaleLeasebackResult = {
  isSaleRecognised: boolean;
  rouAssetMinor: number;
  gainOnRightsTransferredMinor: number;
  retainedProportion: number;
  transferredProportion: number;
  adjustmentRequired: boolean;
  adjustmentAmountMinor: number;
};

/**
 * Evaluate a sale-and-leaseback transaction per IFRS 16 §98-103.
 *
 * §100: If the fair value of the consideration differs from the fair value
 * of the asset, or if payments are not at market rates, adjustments are made.
 *
 * §100(a): Below-market terms → prepayment of lease
 * §100(b): Above-market terms → additional financing from buyer-lessor
 */
export function evaluateSaleLeaseback(
  input: SaleLeasebackInput,
): CalculatorResult<SaleLeasebackResult> {
  const { assetCarryingMinor, salePriceMinor, fairValueMinor, presentValueOfLeasePaymentsMinor, leaseTermMonths, usefulLifeRemainingMonths } = input;

  if (assetCarryingMinor < 0 || salePriceMinor < 0 || fairValueMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Asset values must be non-negative, fair value must be positive');
  }
  if (leaseTermMonths <= 0 || usefulLifeRemainingMonths <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Lease term and useful life must be positive');
  }

  const isSaleRecognised = salePriceMinor > 0 && fairValueMinor > 0;

  const retainedProportion = Math.min(presentValueOfLeasePaymentsMinor / fairValueMinor, 1);
  const transferredProportion = 1 - retainedProportion;

  const rouAssetMinor = Math.round(assetCarryingMinor * retainedProportion);

  const totalGainLoss = salePriceMinor - assetCarryingMinor;
  const gainOnRightsTransferredMinor = Math.round(totalGainLoss * transferredProportion);

  const adjustmentAmountMinor = salePriceMinor - fairValueMinor;
  const adjustmentRequired = adjustmentAmountMinor !== 0;

  return {
    result: {
      isSaleRecognised,
      rouAssetMinor,
      gainOnRightsTransferredMinor,
      retainedProportion: Math.round(retainedProportion * 10000) / 10000,
      transferredProportion: Math.round(transferredProportion * 10000) / 10000,
      adjustmentRequired,
      adjustmentAmountMinor,
    },
    inputs: input,
    explanation: `Sale-leaseback: ${isSaleRecognised ? 'sale recognised' : 'not a sale'}, ROU ${rouAssetMinor}, gain on transfer ${gainOnRightsTransferredMinor}, retained ${Math.round(retainedProportion * 100)}%`,
  };
}
