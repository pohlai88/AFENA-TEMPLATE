import { describe, expect, it } from 'vitest';
import type { StatementLineItem, XbrlTaxonomyElement } from '../calculators/xbrl-tagger';
import { tagWithXbrl } from '../calculators/xbrl-tagger';

const taxonomy: XbrlTaxonomyElement[] = [
  { elementId: 'ifrs-full:Revenue', label: 'Revenue', namespace: 'ifrs-full', dataType: 'monetaryItemType', periodType: 'duration', balance: 'credit' },
  { elementId: 'ifrs-full:CostOfSales', label: 'Cost of Sales', namespace: 'ifrs-full', dataType: 'monetaryItemType', periodType: 'duration', balance: 'debit' },
  { elementId: 'ifrs-full:Assets', label: 'Total Assets', namespace: 'ifrs-full', dataType: 'monetaryItemType', periodType: 'instant', balance: 'debit' },
];

const lines: StatementLineItem[] = [
  { lineId: 'l1', label: 'Revenue', amountMinor: 50000000, statementSection: 'income_statement' },
  { lineId: 'l2', label: 'Cost of Sales', amountMinor: 30000000, statementSection: 'income_statement' },
  { lineId: 'l3', label: 'Total Assets', amountMinor: 100000000, statementSection: 'balance_sheet' },
  { lineId: 'l4', label: 'Goodwill', amountMinor: 5000000, statementSection: 'balance_sheet' },
];

describe('SR-10 — XBRL tagging for regulatory filing', () => {
  it('maps exact label matches', () => {
    const { result } = tagWithXbrl(lines, taxonomy);
    const rev = result.mappings.find((m) => m.lineId === 'l1')!;
    expect(rev.isMapped).toBe(true);
    expect(rev.confidence).toBe('exact');
    expect(rev.xbrlElement!.elementId).toBe('ifrs-full:Revenue');
  });

  it('reports unmapped items', () => {
    const { result } = tagWithXbrl(lines, taxonomy);
    const goodwill = result.mappings.find((m) => m.lineId === 'l4')!;
    expect(goodwill.isMapped).toBe(false);
    expect(goodwill.confidence).toBe('unmapped');
  });

  it('computes coverage percentage', () => {
    const { result } = tagWithXbrl(lines, taxonomy);
    expect(result.mappedCount).toBe(3);
    expect(result.unmappedCount).toBe(1);
    expect(result.coveragePct).toBe(75);
  });

  it('is not filing ready when unmapped items exist', () => {
    const { result } = tagWithXbrl(lines, taxonomy);
    expect(result.isFilingReady).toBe(false);
  });

  it('is filing ready when all mapped', () => {
    const allMapped = lines.slice(0, 3);
    const { result } = tagWithXbrl(allMapped, taxonomy);
    expect(result.isFilingReady).toBe(true);
  });

  it('supports manual label overrides', () => {
    const { result } = tagWithXbrl(lines, taxonomy, { l4: 'ifrs-full:Assets' });
    const goodwill = result.mappings.find((m) => m.lineId === 'l4')!;
    expect(goodwill.isMapped).toBe(true);
    expect(goodwill.confidence).toBe('exact');
  });

  it('throws for empty lines', () => {
    expect(() => tagWithXbrl([], taxonomy)).toThrow('At least one');
  });
});
