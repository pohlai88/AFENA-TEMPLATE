import { matchResults } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Bank statement line for matching.
 */
export interface StatementLineForMatch {
  lineId: string;
  amountMinor: number;
  transactionDate: string;
  description: string;
  reference?: string;
}

/**
 * Candidate match from the ledger.
 */
export interface MatchCandidate {
  entityType: string;
  entityId: string;
  amountMinor: number;
  date: string;
  reference?: string;
  confidence: 'exact' | 'high' | 'medium' | 'low';
  score: number;
}

/**
 * Auto-match result for a statement line.
 */
export interface AutoMatchResult {
  lineId: string;
  matched: boolean;
  candidate: MatchCandidate | null;
  reason: string;
}

/**
 * Score a candidate match against a statement line.
 *
 * PRD G0.12 — Bank reconciliation auto-match:
 * - Exact amount + reference = exact (100)
 * - Exact amount + date within 3 days = high (80)
 * - Exact amount only = medium (60)
 * - Close amount (within 1%) = low (40)
 *
 * @param line - Bank statement line
 * @param candidate - Ledger candidate
 */
export function scoreMatch(
  line: StatementLineForMatch,
  candidate: Omit<MatchCandidate, 'confidence' | 'score'>,
): MatchCandidate {
  let score = 0;

  // Amount match (exact)
  if (line.amountMinor === candidate.amountMinor) {
    score += 50;
  } else {
    // Close amount (within 1%)
    const diff = Math.abs(line.amountMinor - candidate.amountMinor);
    const threshold = Math.abs(line.amountMinor) * 0.01;
    if (diff <= threshold) {
      score += 20;
    } else {
      return { ...candidate, confidence: 'low', score: 0 };
    }
  }

  // Reference match
  if (
    line.reference &&
    candidate.reference &&
    line.reference.toLowerCase().includes(candidate.reference.toLowerCase())
  ) {
    score += 30;
  }

  // Date proximity (within 3 days)
  const lineDate = new Date(line.transactionDate);
  const candDate = new Date(candidate.date);
  const daysDiff = Math.abs(lineDate.getTime() - candDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 3) {
    score += 20;
  } else if (daysDiff <= 7) {
    score += 10;
  }

  let confidence: MatchCandidate['confidence'];
  if (score >= 90) confidence = 'exact';
  else if (score >= 70) confidence = 'high';
  else if (score >= 50) confidence = 'medium';
  else confidence = 'low';

  return { ...candidate, confidence, score };
}

/**
 * Auto-match a batch of statement lines against ledger candidates.
 *
 * @param lines - Bank statement lines to match
 * @param candidates - Ledger candidates (payments, receipts, etc.)
 * @param minConfidence - Minimum confidence to accept (default: 'medium')
 */
export function autoMatchBatch(
  lines: StatementLineForMatch[],
  candidates: Omit<MatchCandidate, 'confidence' | 'score'>[],
  minConfidence: 'exact' | 'high' | 'medium' | 'low' = 'medium',
): AutoMatchResult[] {
  const confidenceOrder = { exact: 4, high: 3, medium: 2, low: 1 };
  const minScore = confidenceOrder[minConfidence];
  const usedCandidates = new Set<string>();

  return lines.map((line) => {
    // Score all unused candidates
    const scored = candidates
      .filter((c) => !usedCandidates.has(c.entityId))
      .map((c) => scoreMatch(line, c))
      .filter((c) => confidenceOrder[c.confidence] >= minScore)
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (best) {
      usedCandidates.add(best.entityId);
      return {
        lineId: line.lineId,
        matched: true,
        candidate: best,
        reason: `Matched with ${best.confidence} confidence (score: ${best.score})`,
      };
    }

    return {
      lineId: line.lineId,
      matched: false,
      candidate: null,
      reason: 'No candidate met minimum confidence threshold',
    };
  });
}

/**
 * Persist a reconciliation match result.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param statementLineId - Bank statement line UUID
 * @param match - The matched candidate
 */
export async function persistReconciliationMatch(
  tx: NeonHttpDatabase,
  orgId: string,
  statementLineId: string,
  match: MatchCandidate,
): Promise<{ matchResultId: string }> {
  const [row] = await (tx as any)
    .insert(matchResults)
    .values({
      orgId,
      statementLineId,
      matchedEntityType: match.entityType,
      matchedEntityId: match.entityId,
      matchConfidence: match.confidence,
      matchScore: String(match.score),
      status: match.confidence === 'exact' ? 'matched' : 'pending_review',
    })
    .returning({ id: matchResults.id });

  return { matchResultId: row.id };
}
