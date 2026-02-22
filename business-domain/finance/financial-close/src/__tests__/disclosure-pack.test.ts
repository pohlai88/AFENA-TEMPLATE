import { describe, expect, it } from 'vitest';
import type { DisclosureItem, DisclosureRequirement } from '../calculators/disclosure-pack';
import { assembleDisclosurePack } from '../calculators/disclosure-pack';

const REPORTING_DATE = '2025-12-31';

const baseRequirements: DisclosureRequirement[] = [
  { requirementId: 'D-01', category: 'accounting_policies', standard: 'IAS 1 §117', description: 'Basis of preparation', mandatory: true },
  { requirementId: 'D-02', category: 'judgements_estimates', standard: 'IAS 1 §122', description: 'Key judgements', mandatory: true },
  { requirementId: 'D-03', category: 'financial_instruments', standard: 'IFRS 7', description: 'Financial instrument risks', mandatory: true },
  { requirementId: 'D-04', category: 'related_parties', standard: 'IAS 24', description: 'Related party transactions', mandatory: true },
  { requirementId: 'D-05', category: 'segment_reporting', standard: 'IFRS 8', description: 'Operating segments', mandatory: false },
];

describe('assembleDisclosurePack', () => {
  it('reports 100% completion when all mandatory items approved', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 500 },
      { requirementId: 'D-02', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 300 },
      { requirementId: 'D-03', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 800 },
      { requirementId: 'D-04', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 200 },
      { requirementId: 'D-05', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 400 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.completionPct).toBe(100);
    expect(result.readyForFiling).toBe(true);
    expect(result.approvedCount).toBe(5);
    expect(result.totalWordCount).toBe(2200);
  });

  it('flags missing mandatory disclosures', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 500 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.readyForFiling).toBe(false);
    const missingGaps = result.gaps.filter((g) => g.reason === 'missing');
    expect(missingGaps.length).toBe(3); // D-02, D-03, D-04 mandatory and missing
  });

  it('flags draft-only mandatory items', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'draft', preparedBy: 'alice', reviewedBy: null, lastUpdatedIso: '2025-12-20', wordCount: 100 },
      { requirementId: 'D-02', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 300 },
      { requirementId: 'D-03', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 800 },
      { requirementId: 'D-04', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 200 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.readyForFiling).toBe(false);
    expect(result.gaps.some((g) => g.requirementId === 'D-01' && g.reason === 'draft_only')).toBe(true);
  });

  it('handles not_applicable items correctly', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 500 },
      { requirementId: 'D-02', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 300 },
      { requirementId: 'D-03', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 800 },
      { requirementId: 'D-04', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 200 },
      { requirementId: 'D-05', status: 'not_applicable', preparedBy: 'alice', reviewedBy: null, lastUpdatedIso: '2025-12-20', wordCount: 0 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.notApplicableCount).toBe(1);
    expect(result.completionPct).toBe(100); // 4/4 effective
    expect(result.readyForFiling).toBe(true);
  });

  it('flags stale disclosures (>90 days before reporting date)', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-06-01', wordCount: 500 },
      { requirementId: 'D-02', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 300 },
      { requirementId: 'D-03', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 800 },
      { requirementId: 'D-04', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 200 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.gaps.some((g) => g.requirementId === 'D-01' && g.reason === 'stale')).toBe(true);
  });

  it('flags no_reviewer on mandatory items', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'reviewed', preparedBy: 'alice', reviewedBy: null, lastUpdatedIso: '2025-12-20', wordCount: 500 },
      { requirementId: 'D-02', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 300 },
      { requirementId: 'D-03', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 800 },
      { requirementId: 'D-04', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 200 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.gaps.some((g) => g.requirementId === 'D-01' && g.reason === 'no_reviewer')).toBe(true);
  });

  it('computes byCategory breakdown', () => {
    const items: DisclosureItem[] = [
      { requirementId: 'D-01', status: 'approved', preparedBy: 'alice', reviewedBy: 'bob', lastUpdatedIso: '2025-12-20', wordCount: 500 },
    ];
    const { result } = assembleDisclosurePack(baseRequirements, items, REPORTING_DATE);
    expect(result.byCategory['accounting_policies']).toEqual({ total: 1, completed: 1 });
    expect(result.byCategory['judgements_estimates']).toEqual({ total: 1, completed: 0 });
  });

  it('throws for empty requirements', () => {
    expect(() => assembleDisclosurePack([], [], REPORTING_DATE)).toThrow('empty');
  });
});
