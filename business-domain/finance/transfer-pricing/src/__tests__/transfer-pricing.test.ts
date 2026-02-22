import { describe, expect, it, vi } from 'vitest';

import type { TpCalculationInput } from '../calculators/tp-engine';
import { computeTransferPrice, validateTpResult } from '../calculators/tp-engine';
import { buildComputePriceIntent, buildPublishPolicyIntent } from '../commands/tp-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

/* ────────── TP Engine: CUP Method ────────── */

describe('computeTransferPrice — CUP', () => {
  it('computes CUP with comparable price within range', () => {
    const input: TpCalculationInput = {
      method: 'cup',
      transactionValueMinor: 100000,
      currencyCode: 'MYR',
      pliConfig: { comparablePrice: 100000 },
      armLengthRange: { low: 90000, median: 100000, high: 110000 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.method).toBe('cup');
    expect(result.result).toBe('within-range');
    expect(result.adjustmentMinor).toBe(0);
    expect(result.pliValue).toBe(100000);
  });

  it('flags below-range CUP and computes adjustment', () => {
    const input: TpCalculationInput = {
      method: 'cup',
      transactionValueMinor: 80000,
      currencyCode: 'MYR',
      pliConfig: { comparablePrice: 80000 },
      armLengthRange: { low: 90000, median: 100000, high: 110000 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.result).toBe('below-range');
    expect(result.adjustmentMinor).toBe(20000); // 100000 - 80000
  });

  it('flags above-range CUP', () => {
    const input: TpCalculationInput = {
      method: 'cup',
      transactionValueMinor: 120000,
      currencyCode: 'MYR',
      pliConfig: { comparablePrice: 120000 },
      armLengthRange: { low: 90000, median: 100000, high: 110000 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.result).toBe('above-range');
  });
});

/* ────────── TP Engine: RPM Method ────────── */

describe('computeTransferPrice — RPM', () => {
  it('computes resale price method within range', () => {
    const input: TpCalculationInput = {
      method: 'rpm',
      transactionValueMinor: 100000,
      currencyCode: 'MYR',
      pliConfig: { grossMarginPct: 0.3 },
      armLengthRange: { low: 0.25, median: 0.3, high: 0.35 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.method).toBe('rpm');
    expect(result.pliValue).toBe(0.3);
    expect(result.computedPriceMinor).toBe(70000); // 100000 * (1-0.30)
    expect(result.result).toBe('within-range');
  });
});

/* ────────── TP Engine: CPM Method ────────── */

describe('computeTransferPrice — CPM', () => {
  it('computes cost plus method', () => {
    const input: TpCalculationInput = {
      method: 'cpm',
      transactionValueMinor: 100000,
      currencyCode: 'MYR',
      pliConfig: { costMarkupPct: 0.15, totalCostMinor: 80000 },
      armLengthRange: { low: 0.1, median: 0.15, high: 0.2 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.method).toBe('cpm');
    expect(result.pliValue).toBe(0.15);
    expect(result.computedPriceMinor).toBe(92000); // 80000 * 1.15
    expect(result.result).toBe('within-range');
  });
});

/* ────────── TP Engine: TNMM Method ────────── */

describe('computeTransferPrice — TNMM', () => {
  it('computes transactional net margin', () => {
    const input: TpCalculationInput = {
      method: 'tnmm',
      transactionValueMinor: 100000,
      currencyCode: 'MYR',
      pliConfig: { operatingExpensesMinor: 85000, revenueMinor: 100000 },
      armLengthRange: { low: 0.1, median: 0.15, high: 0.2 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.method).toBe('tnmm');
    expect(result.pliValue).toBe(0.15); // (100000-85000)/100000
    expect(result.result).toBe('within-range');
  });

  it('flags below-range TNMM', () => {
    const input: TpCalculationInput = {
      method: 'tnmm',
      transactionValueMinor: 100000,
      currencyCode: 'MYR',
      pliConfig: { operatingExpensesMinor: 95000, revenueMinor: 100000 },
      armLengthRange: { low: 0.1, median: 0.15, high: 0.2 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.pliValue).toBe(0.05); // (100000-95000)/100000
    expect(result.result).toBe('below-range');
    expect(result.adjustmentMinor).toBe(10000); // 100000 * (0.15 - 0.05)
  });
});

/* ────────── TP Engine: PSM Method ────────── */

describe('computeTransferPrice — PSM', () => {
  it('computes profit split method', () => {
    const input: TpCalculationInput = {
      method: 'psm',
      transactionValueMinor: 200000,
      currencyCode: 'MYR',
      pliConfig: { combinedProfitMinor: 500000, contributionFactor: 0.4 },
      armLengthRange: { low: 0.35, median: 0.4, high: 0.45 },
    };
    const { result } = computeTransferPrice(input);
    expect(result.method).toBe('psm');
    expect(result.pliValue).toBe(0.4);
    expect(result.computedPriceMinor).toBe(200000); // 500000 * 0.40
    expect(result.result).toBe('within-range');
  });
});

/* ────────── TP Result Validation ────────── */

describe('validateTpResult', () => {
  it('validates within-range with zero adjustment', () => {
    const { result } = validateTpResult({
      method: 'cup',
      pliValue: 100000,
      rangeLow: 90000,
      rangeMedian: 100000,
      rangeHigh: 110000,
      result: 'within-range',
      adjustmentMinor: 0,
      transactionValueMinor: 100000,
      computedPriceMinor: 100000,
    });
    expect(result.valid).toBe(true);
  });

  it('fails within-range with non-zero adjustment', () => {
    const { result } = validateTpResult({
      method: 'cup',
      pliValue: 100000,
      rangeLow: 90000,
      rangeMedian: 100000,
      rangeHigh: 110000,
      result: 'within-range',
      adjustmentMinor: 5000,
      transactionValueMinor: 100000,
      computedPriceMinor: 100000,
    });
    expect(result.valid).toBe(false);
  });

  it('fails out-of-range with zero adjustment', () => {
    const { result } = validateTpResult({
      method: 'cup',
      pliValue: 80000,
      rangeLow: 90000,
      rangeMedian: 100000,
      rangeHigh: 110000,
      result: 'below-range',
      adjustmentMinor: 0,
      transactionValueMinor: 80000,
      computedPriceMinor: 80000,
    });
    expect(result.valid).toBe(false);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildPublishPolicyIntent', () => {
  it('builds tp.policy.publish intent', () => {
    const intent = buildPublishPolicyIntent({ policyId: 'pol-1', version: 3, method: 'tnmm' });
    expect(intent.type).toBe('tp.policy.publish');
    expect(intent.payload).toEqual({ policyId: 'pol-1', version: 3, method: 'tnmm' });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildComputePriceIntent', () => {
  it('builds tp.price.compute intent', () => {
    const intent = buildComputePriceIntent({
      transactionId: 'txn-1',
      policyId: 'pol-1',
      computedPriceMinor: 92000,
      armLengthRange: { lowMinor: 80000, highMinor: 110000 },
    });
    expect(intent.type).toBe('tp.price.compute');
    expect(intent.payload.computedPriceMinor).toBe(92000);
    expect(intent.idempotencyKey).toBeTruthy();
  });
});
