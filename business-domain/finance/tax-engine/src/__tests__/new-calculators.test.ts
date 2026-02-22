import { describe, expect, it } from 'vitest';

import { computeReverseCharge } from '../calculators/reverse-charge-calc';

describe('computeReverseCharge', () => {
  it('applies reverse charge for cross-border B2B', () => {
    const { result } = computeReverseCharge({
      netAmountMinor: 100_000, vatRate: 0.20,
      supplierCountry: 'DE', recipientCountry: 'MY',
      isB2B: true, serviceType: 'services',
    });
    expect(result.reverseChargeApplies).toBe(true);
    expect(result.vatAmountMinor).toBe(20_000);
    expect(result.outputVatMinor).toBe(20_000);
    expect(result.inputVatMinor).toBe(20_000);
    expect(result.netVatEffectMinor).toBe(0);
  });

  it('does not apply for domestic transaction', () => {
    const { result } = computeReverseCharge({
      netAmountMinor: 100_000, vatRate: 0.06,
      supplierCountry: 'MY', recipientCountry: 'MY',
      isB2B: true, serviceType: 'goods',
    });
    expect(result.reverseChargeApplies).toBe(false);
    expect(result.vatAmountMinor).toBe(0);
  });

  it('does not apply for B2C cross-border', () => {
    const { result } = computeReverseCharge({
      netAmountMinor: 50_000, vatRate: 0.20,
      supplierCountry: 'DE', recipientCountry: 'MY',
      isB2B: false, serviceType: 'digital',
    });
    expect(result.reverseChargeApplies).toBe(false);
  });

  it('throws on negative net amount', () => {
    expect(() => computeReverseCharge({
      netAmountMinor: -1, vatRate: 0.20,
      supplierCountry: 'DE', recipientCountry: 'MY',
      isB2B: true, serviceType: 'services',
    })).toThrow('Net amount cannot be negative');
  });

  it('throws on invalid VAT rate', () => {
    expect(() => computeReverseCharge({
      netAmountMinor: 100_000, vatRate: 1.5,
      supplierCountry: 'DE', recipientCountry: 'MY',
      isB2B: true, serviceType: 'services',
    })).toThrow('VAT rate must be between');
  });
});
