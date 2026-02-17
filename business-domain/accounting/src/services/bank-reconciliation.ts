import { matchResults } from 'afenda-database';

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
 * PRD G0.12 — Bank reconciliation auto-match:
 * - Returns matches with confidence >= 'high'
 * - Lower confidence matches are returned for manual review
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param lines - Statement lines to match
 * @param candidates - Ledger candidates
 */
export async function autoMatchStatementLines(
  db: NeonHttpDatabase,
  orgId: string,
  lines: StatementLineForMatch[],
  candidates: Array<Omit<MatchCandidate, 'confidence' | 'score'>>,
): Promise<AutoMatchResult[]> {
  const results: AutoMatchResult[] = [];

  for (const line of lines) {
    let bestMatch: MatchCandidate | null = null;
    let bestScore = 0;

    for (const cand of candidates) {
      const scored = scoreMatch(line, cand);
      if (scored.score > bestScore) {
        bestScore = scored.score;
        bestMatch = scored;
      }
    }

    // Auto-match if confidence is high or exact
    const matched = bestMatch
      ? bestMatch.confidence === 'exact' || bestMatch.confidence === 'high'
      : false;

    results.push({
      lineId: line.lineId,
      matched,
      candidate: bestMatch,
      reason: matched
        ? `Auto-matched with ${bestMatch!.confidence} confidence (score: ${bestMatch!.score})`
        : bestMatch
          ? `Requires manual review (${bestMatch.confidence} confidence, score: ${bestMatch.score})`
          : 'No suitable match found',
    });
  }

  return results;
}

/**
 * Record a confirmed bank reconciliation match.
 *
 * PRD G0.12 — Bank reconciliation:
 * - Links a statement line to a ledger entity
 * - Stores match confidence and method (auto/manual)
 * - Used for reporting reconciliation status
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param params - Match parameters
 */
export async function recordReconciliationMatch(
  tx: NeonHttpDatabase,
  orgId: string,
  params: {
    statementLineId: string;
    ledgerEntityType: string;
    ledgerEntityId: string;
    matchMethod: 'auto' | 'manual';
    confidence: 'exact' | 'high' | 'medium' | 'low';
    reconciledBy?: string;
  },
): Promise<string> {
  const {
    statementLineId,
    ledgerEntityType,
    ledgerEntityId,
    matchMethod,
    confidence,
    reconciledBy,
  } = params;

  const [match] = await (tx as any)
    .insert(matchResults)
    .values({
      orgId,
      statementLineId,
      ledgerEntityType,
      ledgerEntityId,
      matchMethod,
      confidence,
      reconciledBy: reconciledBy ?? null,
      status: 'confirmed',
    })
    .returning({ id: matchResults.id });

  return match.id;
}
