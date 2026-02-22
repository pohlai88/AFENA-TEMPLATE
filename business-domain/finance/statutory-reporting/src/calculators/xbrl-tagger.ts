import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SR-10 — XBRL tagging for regulatory filing
 * G-05 / FC-10 — XBRL Tagging for Digital Regulatory Filing
 *
 * Maps financial statement line items to XBRL taxonomy elements
 * for iXBRL / XBRL filing (e.g. ESEF, SEC EDGAR, SSM).
 *
 * Pure function — no I/O.
 */

export type StatementLineItem = {
  lineId: string;
  label: string;
  amountMinor: number;
  statementSection: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'equity' | 'notes';
};

export type XbrlTaxonomyElement = {
  elementId: string;
  label: string;
  namespace: string;
  dataType: 'monetaryItemType' | 'stringItemType' | 'dateItemType' | 'percentItemType';
  periodType: 'instant' | 'duration';
  balance: 'debit' | 'credit' | null;
};

export type XbrlMapping = {
  lineId: string;
  lineLabel: string;
  xbrlElement: XbrlTaxonomyElement | null;
  isMapped: boolean;
  confidence: 'exact' | 'fuzzy' | 'unmapped';
};

export type XbrlTaggingResult = {
  mappings: XbrlMapping[];
  mappedCount: number;
  unmappedCount: number;
  coveragePct: number;
  isFilingReady: boolean;
};

/**
 * Map statement line items to XBRL taxonomy elements.
 *
 * @param lines    - Financial statement line items
 * @param taxonomy - Available XBRL taxonomy elements
 * @param labelMap - Optional manual label→elementId overrides
 */
export function tagWithXbrl(
  lines: StatementLineItem[],
  taxonomy: XbrlTaxonomyElement[],
  labelMap: Record<string, string> = {},
): CalculatorResult<XbrlTaggingResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one statement line item required');
  }

  const taxonomyByLabel = new Map<string, XbrlTaxonomyElement>();
  const taxonomyById = new Map<string, XbrlTaxonomyElement>();
  for (const elem of taxonomy) {
    taxonomyByLabel.set(elem.label.toLowerCase(), elem);
    taxonomyById.set(elem.elementId, elem);
  }

  const mappings: XbrlMapping[] = lines.map((line) => {
    const manualId = labelMap[line.lineId];
    if (manualId) {
      const elem = taxonomyById.get(manualId);
      if (elem) {
        return { lineId: line.lineId, lineLabel: line.label, xbrlElement: elem, isMapped: true, confidence: 'exact' as const };
      }
    }

    const exactMatch = taxonomyByLabel.get(line.label.toLowerCase());
    if (exactMatch) {
      return { lineId: line.lineId, lineLabel: line.label, xbrlElement: exactMatch, isMapped: true, confidence: 'exact' as const };
    }

    const fuzzyMatch = taxonomy.find((t) =>
      t.label.toLowerCase().includes(line.label.toLowerCase()) ||
      line.label.toLowerCase().includes(t.label.toLowerCase()),
    );
    if (fuzzyMatch) {
      return { lineId: line.lineId, lineLabel: line.label, xbrlElement: fuzzyMatch, isMapped: true, confidence: 'fuzzy' as const };
    }

    return { lineId: line.lineId, lineLabel: line.label, xbrlElement: null, isMapped: false, confidence: 'unmapped' as const };
  });

  const mappedCount = mappings.filter((m) => m.isMapped).length;
  const unmappedCount = mappings.length - mappedCount;
  const coveragePct = Math.round((mappedCount / mappings.length) * 10000) / 100;

  return {
    result: {
      mappings,
      mappedCount,
      unmappedCount,
      coveragePct,
      isFilingReady: unmappedCount === 0,
    },
    inputs: { lineCount: lines.length, taxonomySize: taxonomy.length, manualOverrides: Object.keys(labelMap).length },
    explanation: `XBRL tagging: ${mappedCount}/${lines.length} mapped (${coveragePct}%), ${unmappedCount === 0 ? 'filing ready' : `${unmappedCount} unmapped`}`,
  };
}
