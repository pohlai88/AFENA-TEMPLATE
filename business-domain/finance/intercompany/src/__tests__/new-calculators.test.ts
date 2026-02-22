import { describe, expect, it } from 'vitest';

import { computeIcNetting } from '../calculators/ic-netting-calc';
import { validateIcPricing } from '../calculators/ic-pricing-validation';
import { classifyIcDispute } from '../calculators/ic-dispute-classification';
import { computeIcSettlement } from '../calculators/ic-settlement-calc';

describe('computeIcNetting', () => {
  it('nets receivables against payables', () => {
    const { result } = computeIcNetting({
      balances: [
        { fromCompanyId: 'c1', toCompanyId: 'c2', receivableMinor: 100_000, payableMinor: 60_000, currency: 'USD' },
        { fromCompanyId: 'c2', toCompanyId: 'c3', receivableMinor: 50_000, payableMinor: 80_000, currency: 'USD' },
      ],
    });
    expect(result.netSettlements).toHaveLength(2);
    expect(result.netSettlements[0].netAmountMinor).toBe(40_000);
    expect(result.netSettlements[0].direction).toBe('receive');
    expect(result.netSettlements[1].direction).toBe('pay');
  });

  it('throws on empty balances', () => {
    expect(() => computeIcNetting({ balances: [] })).toThrow('At least one');
  });
});

describe('validateIcPricing', () => {
  it('validates price within range', () => {
    const { result } = validateIcPricing({
      transactionId: 't1', icPriceMinor: 100_000,
      armLengthLowMinor: 90_000, armLengthHighMinor: 110_000,
      transactionType: 'services',
    });
    expect(result.isWithinRange).toBe(true);
    expect(result.riskLevel).toBe('low');
  });

  it('flags price outside range', () => {
    const { result } = validateIcPricing({
      transactionId: 't1', icPriceMinor: 150_000,
      armLengthLowMinor: 90_000, armLengthHighMinor: 110_000,
      transactionType: 'goods',
    });
    expect(result.isWithinRange).toBe(false);
    expect(result.deviationMinor).toBe(40_000);
  });

  it('throws when low exceeds high', () => {
    expect(() => validateIcPricing({
      transactionId: 't1', icPriceMinor: 100_000,
      armLengthLowMinor: 120_000, armLengthHighMinor: 100_000,
      transactionType: 'services',
    })).toThrow('low cannot exceed high');
  });
});

describe('classifyIcDispute', () => {
  it('classifies missing receiver as missing', () => {
    const { result } = classifyIcDispute({
      senderAmountMinor: 100_000, receiverAmountMinor: 0,
      currency: 'USD', transactionDate: '2025-01-01', daysSinceTransaction: 10,
    });
    expect(result.category).toBe('missing');
    expect(result.severity).toBe('critical');
  });

  it('classifies small discrepancy as low severity', () => {
    const { result } = classifyIcDispute({
      senderAmountMinor: 100_000, receiverAmountMinor: 99_500,
      currency: 'USD', transactionDate: '2025-01-01', daysSinceTransaction: 5,
    });
    expect(result.severity).toBe('low');
  });
});

describe('computeIcSettlement', () => {
  it('converts to settlement currency', () => {
    const { result } = computeIcSettlement({
      balanceMinor: 100_000, balanceCurrency: 'EUR', settlementCurrency: 'USD',
      fxRate: 1.1, paymentTermDays: 30, isOverdue: false,
    });
    expect(result.settlementAmountMinor).toBe(110_000);
    expect(result.fxGainLossMinor).toBe(10_000);
    expect(result.priority).toBe('normal');
  });

  it('marks overdue as overdue priority', () => {
    const { result } = computeIcSettlement({
      balanceMinor: 50_000, balanceCurrency: 'USD', settlementCurrency: 'USD',
      fxRate: 1, paymentTermDays: 0, isOverdue: true,
    });
    expect(result.priority).toBe('overdue');
  });

  it('throws on negative balance', () => {
    expect(() => computeIcSettlement({
      balanceMinor: -1, balanceCurrency: 'USD', settlementCurrency: 'USD',
      fxRate: 1, paymentTermDays: 30, isOverdue: false,
    })).toThrow('Balance cannot be negative');
  });
});
