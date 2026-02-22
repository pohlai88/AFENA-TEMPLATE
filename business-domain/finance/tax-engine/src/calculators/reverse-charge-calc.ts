/**
 * EU VAT Directive Art. 196 — Reverse Charge Calculation
 *
 * Computes the reverse charge VAT amount for cross-border B2B
 * transactions where the recipient is liable for VAT.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ReverseChargeInput = {
  netAmountMinor: number;
  vatRate: number;
  supplierCountry: string;
  recipientCountry: string;
  isB2B: boolean;
  serviceType: 'goods' | 'services' | 'digital' | 'telecoms';
};

export type ReverseChargeResult = {
  reverseChargeApplies: boolean;
  vatAmountMinor: number;
  inputVatMinor: number;
  outputVatMinor: number;
  netVatEffectMinor: number;
  explanation: string;
};

export function computeReverseCharge(
  inputs: ReverseChargeInput,
): CalculatorResult<ReverseChargeResult> {
  const { netAmountMinor, vatRate, supplierCountry, recipientCountry, isB2B, serviceType } = inputs;

  if (netAmountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Net amount cannot be negative');
  if (vatRate < 0 || vatRate > 1) throw new DomainError('VALIDATION_FAILED', 'VAT rate must be between 0 and 1');

  const isCrossBorder = supplierCountry !== recipientCountry;
  const reverseChargeApplies = isCrossBorder && isB2B;

  if (!reverseChargeApplies) {
    const explanation = !isCrossBorder
      ? `Domestic transaction (${supplierCountry}) — standard VAT applies, no reverse charge`
      : `B2C cross-border ${serviceType} — reverse charge does not apply`;
    return {
      result: { reverseChargeApplies: false, vatAmountMinor: 0, inputVatMinor: 0, outputVatMinor: 0, netVatEffectMinor: 0, explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  const vatAmountMinor = Math.round(netAmountMinor * vatRate);
  const outputVatMinor = vatAmountMinor;
  const inputVatMinor = vatAmountMinor;
  const netVatEffectMinor = outputVatMinor - inputVatMinor;

  const explanation =
    `Reverse charge (Art. 196): ${supplierCountry} → ${recipientCountry}, B2B ${serviceType}, ` +
    `VAT ${vatAmountMinor} at ${(vatRate * 100).toFixed(1)}%, output = input → net effect ${netVatEffectMinor}`;

  return {
    result: { reverseChargeApplies: true, vatAmountMinor, inputVatMinor, outputVatMinor, netVatEffectMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
