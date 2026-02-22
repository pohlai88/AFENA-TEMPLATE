import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see IA-08 — Customer lists / relationships acquired in business combinat
 * @see IA-09 — Revaluation model (active market required)
 * IA-06 — Internally Generated Goodwill: Prohibited (IAS 38 ¶48)
 *
 * Validates that internally generated goodwill is never capitalised.
 * Takes a proposed intangible asset and rejects if type=goodwill and origin=internal.
 * Pure function — no I/O.
 */

export type IntangibleProposal = {
  proposalId: string;
  assetName: string;
  assetType: 'goodwill' | 'patent' | 'trademark' | 'software' | 'customer-list' | 'license' | 'other';
  origin: 'internal' | 'acquired' | 'business-combination';
  proposedCostMinor: number;
};

export type GoodwillProhibitionResult = {
  proposalId: string;
  assetType: string;
  origin: string;
  permitted: boolean;
  reason: string;
};

export function validateGoodwillProhibition(
  proposals: IntangibleProposal[],
): CalculatorResult<{ results: GoodwillProhibitionResult[]; rejectedCount: number; acceptedCount: number }> {
  if (proposals.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one proposal required');

  const results: GoodwillProhibitionResult[] = proposals.map((p) => {
    if (p.proposedCostMinor < 0) throw new DomainError('VALIDATION_FAILED', `Negative cost for proposal ${p.proposalId}`);

    if (p.assetType === 'goodwill' && p.origin === 'internal') {
      return {
        proposalId: p.proposalId,
        assetType: p.assetType,
        origin: p.origin,
        permitted: false,
        reason: 'IAS 38 ¶48: Internally generated goodwill shall not be recognised as an asset',
      };
    }

    if (p.assetType === 'goodwill' && p.origin === 'business-combination') {
      return {
        proposalId: p.proposalId,
        assetType: p.assetType,
        origin: p.origin,
        permitted: true,
        reason: 'IFRS 3: Goodwill acquired in a business combination is permitted',
      };
    }

    return {
      proposalId: p.proposalId,
      assetType: p.assetType,
      origin: p.origin,
      permitted: true,
      reason: `${p.assetType} (${p.origin}): recognition criteria apply per IAS 38 ¶18–67`,
    };
  });

  const rejected = results.filter((r) => !r.permitted).length;
  const accepted = results.length - rejected;

  return {
    result: { results, rejectedCount: rejected, acceptedCount: accepted },
    inputs: { proposalCount: proposals.length },
    explanation: rejected > 0
      ? `Goodwill prohibition check: ${rejected}/${proposals.length} proposals rejected (internally generated goodwill)`
      : `Goodwill prohibition check: all ${proposals.length} proposals permitted`,
  };
}
