import { describe, expect, it } from 'vitest';
import { validateGoodwillProhibition } from '../calculators/goodwill-prohibition';

describe('IA-06 — Goodwill Prohibition', () => {
  it('rejects internally generated goodwill', () => {
    const { result } = validateGoodwillProhibition([
      { proposalId: 'P1', assetName: 'Brand Value', assetType: 'goodwill', origin: 'internal', proposedCostMinor: 500_000 },
    ]);
    expect(result.rejectedCount).toBe(1);
    expect(result.acceptedCount).toBe(0);
    expect(result.results[0].permitted).toBe(false);
    expect(result.results[0].reason).toContain('IAS 38');
  });

  it('permits acquired goodwill from business combination', () => {
    const { result } = validateGoodwillProhibition([
      { proposalId: 'P2', assetName: 'Acquisition Goodwill', assetType: 'goodwill', origin: 'business-combination', proposedCostMinor: 1_000_000 },
    ]);
    expect(result.rejectedCount).toBe(0);
    expect(result.acceptedCount).toBe(1);
    expect(result.results[0].permitted).toBe(true);
    expect(result.results[0].reason).toContain('IFRS 3');
  });

  it('permits other intangible types', () => {
    const { result } = validateGoodwillProhibition([
      { proposalId: 'P3', assetName: 'Patent', assetType: 'patent', origin: 'internal', proposedCostMinor: 200_000 },
      { proposalId: 'P4', assetName: 'Software', assetType: 'software', origin: 'acquired', proposedCostMinor: 100_000 },
    ]);
    expect(result.rejectedCount).toBe(0);
    expect(result.acceptedCount).toBe(2);
  });

  it('handles mixed batch with some rejections', () => {
    const { result } = validateGoodwillProhibition([
      { proposalId: 'P1', assetName: 'Internal GW', assetType: 'goodwill', origin: 'internal', proposedCostMinor: 500_000 },
      { proposalId: 'P2', assetName: 'License', assetType: 'license', origin: 'acquired', proposedCostMinor: 50_000 },
    ]);
    expect(result.rejectedCount).toBe(1);
    expect(result.acceptedCount).toBe(1);
  });

  it('returns CalculatorResult shape', () => {
    const res = validateGoodwillProhibition([
      { proposalId: 'X', assetName: 'Y', assetType: 'patent', origin: 'internal', proposedCostMinor: 100 },
    ]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty proposals', () => {
    expect(() => validateGoodwillProhibition([])).toThrow('At least one proposal');
  });

  it('throws on negative cost', () => {
    expect(() => validateGoodwillProhibition([
      { proposalId: 'X', assetName: 'Y', assetType: 'patent', origin: 'internal', proposedCostMinor: -100 },
    ])).toThrow('Negative cost');
  });
});
