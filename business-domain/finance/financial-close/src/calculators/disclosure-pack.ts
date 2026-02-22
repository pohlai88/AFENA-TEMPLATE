import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * FC-10 — Notes to Financial Statements / Disclosure Pack (IAS 1 §112)
 *
 * Assembles and validates the disclosure pack for notes to financial statements.
 * Checks completeness against a configurable disclosure checklist, flags missing
 * or stale disclosures, and computes readiness for filing.
 *
 * IAS 1 §112 requires:
 *  (a) Basis of preparation and significant accounting policies
 *  (b) Information required by IFRSs not presented elsewhere
 *  (c) Information not presented elsewhere but relevant to understanding
 *
 * Pure function — no I/O.
 */

export type DisclosureCategory =
  | 'accounting_policies'
  | 'judgements_estimates'
  | 'financial_instruments'
  | 'revenue'
  | 'leases'
  | 'employee_benefits'
  | 'taxation'
  | 'related_parties'
  | 'contingencies'
  | 'events_after_reporting'
  | 'segment_reporting'
  | 'share_based_payment'
  | 'earnings_per_share'
  | 'other';

export type DisclosureRequirement = {
  requirementId: string;
  category: DisclosureCategory;
  standard: string;
  description: string;
  mandatory: boolean;
};

export type DisclosureItem = {
  requirementId: string;
  status: 'draft' | 'reviewed' | 'approved' | 'not_applicable';
  preparedBy: string;
  reviewedBy: string | null;
  lastUpdatedIso: string;
  wordCount: number;
};

export type DisclosureGap = {
  requirementId: string;
  category: DisclosureCategory;
  standard: string;
  description: string;
  reason: 'missing' | 'draft_only' | 'stale' | 'no_reviewer';
};

export type DisclosurePackResult = {
  totalRequirements: number;
  mandatoryRequirements: number;
  completedCount: number;
  approvedCount: number;
  notApplicableCount: number;
  gaps: DisclosureGap[];
  readyForFiling: boolean;
  completionPct: number;
  totalWordCount: number;
  byCategory: Record<string, { total: number; completed: number }>;
};

const STALE_DAYS = 90;

/**
 * Assemble disclosure pack and validate completeness per IAS 1 §112.
 *
 * @param requirements - Disclosure checklist for the reporting period
 * @param items        - Actual disclosure items prepared
 * @param reportingDateIso - Period end date (for staleness check)
 */
export function assembleDisclosurePack(
  requirements: DisclosureRequirement[],
  items: DisclosureItem[],
  reportingDateIso: string,
): CalculatorResult<DisclosurePackResult> {
  if (requirements.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Disclosure requirements list cannot be empty');
  }

  const itemMap = new Map(items.map((i) => [i.requirementId, i]));
  const gaps: DisclosureGap[] = [];
  const byCategory: Record<string, { total: number; completed: number }> = {};

  let completedCount = 0;
  let approvedCount = 0;
  let notApplicableCount = 0;
  let totalWordCount = 0;

  const reportingMs = new Date(reportingDateIso).getTime();
  const staleCutoffMs = reportingMs - STALE_DAYS * 86_400_000;

  for (const req of requirements) {
    const cat = byCategory[req.category] ?? { total: 0, completed: 0 };
    cat.total++;

    const item = itemMap.get(req.requirementId);

    if (!item) {
      if (req.mandatory) {
        gaps.push({
          requirementId: req.requirementId,
          category: req.category,
          standard: req.standard,
          description: req.description,
          reason: 'missing',
        });
      }
      byCategory[req.category] = cat;
      continue;
    }

    if (item.status === 'not_applicable') {
      notApplicableCount++;
      cat.completed++;
      byCategory[req.category] = cat;
      continue;
    }

    totalWordCount += item.wordCount;

    if (item.status === 'approved') {
      approvedCount++;
      completedCount++;
      cat.completed++;
    } else if (item.status === 'reviewed') {
      completedCount++;
      cat.completed++;
    } else if (item.status === 'draft') {
      if (req.mandatory) {
        gaps.push({
          requirementId: req.requirementId,
          category: req.category,
          standard: req.standard,
          description: req.description,
          reason: 'draft_only',
        });
      }
    }

    if (req.mandatory && !item.reviewedBy) {
      gaps.push({
        requirementId: req.requirementId,
        category: req.category,
        standard: req.standard,
        description: req.description,
        reason: 'no_reviewer',
      });
    }

    const itemMs = new Date(item.lastUpdatedIso).getTime();
    if (req.mandatory && itemMs < staleCutoffMs) {
      gaps.push({
        requirementId: req.requirementId,
        category: req.category,
        standard: req.standard,
        description: req.description,
        reason: 'stale',
      });
    }

    byCategory[req.category] = cat;
  }

  const mandatoryRequirements = requirements.filter((r) => r.mandatory).length;
  const mandatoryGapIds = new Set(gaps.filter((g) => g.reason === 'missing' || g.reason === 'draft_only').map((g) => g.requirementId));
  const readyForFiling = mandatoryGapIds.size === 0;

  const effectiveTotal = requirements.length - notApplicableCount;
  const completionPct = effectiveTotal > 0
    ? Math.round((completedCount / effectiveTotal) * 100)
    : 100;

  return {
    result: {
      totalRequirements: requirements.length,
      mandatoryRequirements,
      completedCount,
      approvedCount,
      notApplicableCount,
      gaps,
      readyForFiling,
      completionPct,
      totalWordCount,
      byCategory,
    },
    inputs: { requirementCount: requirements.length, itemCount: items.length, reportingDateIso },
    explanation: `Disclosure pack: ${completedCount}/${effectiveTotal} complete (${completionPct}%), ${gaps.length} gaps, filing-ready=${readyForFiling}`,
  };
}
