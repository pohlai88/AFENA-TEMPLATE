import { describe, expect, it } from 'vitest';
import { evaluateSaleLeaseback } from '../calculators/sale-leaseback';

describe('evaluateSaleLeaseback', () => {
  it('computes retained and transferred proportions', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 1000000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.retainedProportion).toBe(0.4);
    expect(result.transferredProportion).toBe(0.6);
  });

  it('computes ROU asset as carrying amount × retained proportion', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 1000000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.rouAssetMinor).toBe(320000);
  });

  it('recognises gain only on rights transferred', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 1000000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.gainOnRightsTransferredMinor).toBe(120000);
  });

  it('detects no adjustment when sale price equals fair value', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 1000000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.adjustmentRequired).toBe(false);
    expect(result.adjustmentAmountMinor).toBe(0);
  });

  it('detects above-market adjustment (§100b)', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 1200000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.adjustmentRequired).toBe(true);
    expect(result.adjustmentAmountMinor).toBe(200000);
  });

  it('detects below-market adjustment (§100a)', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 800000,
      salePriceMinor: 900000,
      fairValueMinor: 1000000,
      presentValueOfLeasePaymentsMinor: 400000,
      leaseTermMonths: 60,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.adjustmentRequired).toBe(true);
    expect(result.adjustmentAmountMinor).toBe(-100000);
  });

  it('caps retained proportion at 1.0', () => {
    const { result } = evaluateSaleLeaseback({
      assetCarryingMinor: 500000,
      salePriceMinor: 500000,
      fairValueMinor: 500000,
      presentValueOfLeasePaymentsMinor: 600000,
      leaseTermMonths: 120,
      usefulLifeRemainingMonths: 120,
    });

    expect(result.retainedProportion).toBe(1);
    expect(result.transferredProportion).toBe(0);
  });

  it('throws for negative carrying amount', () => {
    expect(() => evaluateSaleLeaseback({
      assetCarryingMinor: -100, salePriceMinor: 100, fairValueMinor: 100,
      presentValueOfLeasePaymentsMinor: 50, leaseTermMonths: 12, usefulLifeRemainingMonths: 60,
    })).toThrow('non-negative');
  });

  it('throws for zero lease term', () => {
    expect(() => evaluateSaleLeaseback({
      assetCarryingMinor: 100, salePriceMinor: 100, fairValueMinor: 100,
      presentValueOfLeasePaymentsMinor: 50, leaseTermMonths: 0, usefulLifeRemainingMonths: 60,
    })).toThrow('positive');
  });
});
