import { describe, expect, it, vi } from 'vitest';

import type { WhtRateConfig } from '../calculators/wht-engine';
import { computeWht, validateWhtAmounts } from '../calculators/wht-engine';
import { buildIssueCertificateIntent, buildRemitIntent } from '../commands/wht-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

/* ────────── WHT Engine ────────── */

describe('computeWht', () => {
  const domesticRate: WhtRateConfig = {
    rateType: 'domestic',
    treatyCountry: null,
    rate: 0.1,
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
  };

  const treatyRate: WhtRateConfig = {
    rateType: 'treaty',
    treatyCountry: 'SG',
    rate: 0.05,
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
  };

  const exemptRate: WhtRateConfig = {
    rateType: 'exempt',
    treatyCountry: null,
    rate: 0.0,
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
  };

  it('applies domestic rate when no treaty match', () => {
    const { result } = computeWht({
      grossAmountMinor: 100000,
      currencyCode: 'MYR',
      paymentDate: '2024-06-15',
      rates: [domesticRate, treatyRate],
    });
    expect(result.whtAmountMinor).toBe(10000);
    expect(result.netAmountMinor).toBe(90000);
    expect(result.rateType).toBe('domestic');
    expect(result.appliedRate).toBe(0.1);
  });

  it('selects treaty rate when payee country matches', () => {
    const { result } = computeWht({
      grossAmountMinor: 100000,
      currencyCode: 'MYR',
      paymentDate: '2024-06-15',
      payeeCountry: 'SG',
      rates: [domesticRate, treatyRate],
    });
    expect(result.whtAmountMinor).toBe(5000);
    expect(result.rateType).toBe('treaty');
  });

  it('falls back to exempt rate when no domestic/treaty', () => {
    const { result } = computeWht({
      grossAmountMinor: 100000,
      currencyCode: 'MYR',
      paymentDate: '2024-06-15',
      rates: [exemptRate],
    });
    expect(result.whtAmountMinor).toBe(0);
    expect(result.netAmountMinor).toBe(100000);
    expect(result.rateType).toBe('exempt');
  });

  it('filters out rates not effective on payment date', () => {
    const futureRate: WhtRateConfig = {
      rateType: 'domestic',
      treatyCountry: null,
      rate: 0.15,
      effectiveFrom: '2025-01-01',
      effectiveTo: null,
    };
    // Only exempt remains effective
    const { result } = computeWht({
      grossAmountMinor: 50000,
      currencyCode: 'MYR',
      paymentDate: '2024-06-15',
      rates: [futureRate, exemptRate],
    });
    expect(result.rateType).toBe('exempt');
    expect(result.whtAmountMinor).toBe(0);
  });

  it('throws when no effective rate found', () => {
    expect(() =>
      computeWht({
        grossAmountMinor: 50000,
        currencyCode: 'MYR',
        paymentDate: '2023-01-01',
        rates: [{ ...domesticRate, effectiveFrom: '2024-01-01' }],
      }),
    ).toThrow('No applicable WHT rate found');
  });

  it('rounds WHT amount to nearest integer', () => {
    const oddRate: WhtRateConfig = {
      rateType: 'domestic',
      treatyCountry: null,
      rate: 0.033,
      effectiveFrom: '2024-01-01',
      effectiveTo: null,
    };
    const { result } = computeWht({
      grossAmountMinor: 10000,
      currencyCode: 'MYR',
      paymentDate: '2024-06-15',
      rates: [oddRate],
    });
    expect(result.whtAmountMinor).toBe(330); // 10000 * 0.033 = 330
    expect(Number.isInteger(result.whtAmountMinor)).toBe(true);
  });
});

/* ────────── WHT Validation ────────── */

describe('validateWhtAmounts', () => {
  it('passes for consistent amounts', () => {
    const { result } = validateWhtAmounts(100000, 10000, 90000);
    expect(result.valid).toBe(true);
  });

  it('fails for mismatched amounts', () => {
    const { result } = validateWhtAmounts(100000, 10000, 80000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('mismatch');
  });

  it('fails for negative WHT', () => {
    const { result } = validateWhtAmounts(100000, -5000, 105000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('negative');
  });

  it('fails when WHT exceeds gross', () => {
    const { result } = validateWhtAmounts(100000, 150000, -50000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('exceeds');
  });
});

/* ────────── Intent Builders ────────── */

describe('buildIssueCertificateIntent', () => {
  it('builds wht.certificate.issue intent', () => {
    const intent = buildIssueCertificateIntent({
      certificateNo: 'WHT-2024-001',
      supplierId: 'sup-1',
      amountMinor: 10000,
      whtCode: 'S15-ROYALTY',
      taxPeriod: '2024-Q2',
    });
    expect(intent.type).toBe('wht.certificate.issue');
    expect(intent.payload).toEqual({
      certificateNo: 'WHT-2024-001',
      supplierId: 'sup-1',
      amountMinor: 10000,
      whtCode: 'S15-ROYALTY',
      taxPeriod: '2024-Q2',
    });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildRemitIntent', () => {
  it('builds wht.remit intent', () => {
    const intent = buildRemitIntent({
      remittanceId: 'rem-001',
      taxAuthority: 'LHDN',
      totalMinor: 50000,
      taxPeriod: '2024-Q2',
    });
    expect(intent.type).toBe('wht.remit');
    expect(intent.payload.taxAuthority).toBe('LHDN');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});
