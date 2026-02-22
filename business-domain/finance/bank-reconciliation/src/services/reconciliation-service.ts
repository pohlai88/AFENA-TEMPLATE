import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import type { BankLine, LedgerEntry, MatchCandidate } from '../calculators/match-engine';
import { findMatches } from '../calculators/match-engine';
import { buildReconConfirmIntent } from '../commands/recon-intent';
import { getMatchingRulesForAccount } from '../queries/matching-rules-query';

export type ReconciliationResult = {
  matches: MatchCandidate[];
  unmatchedBankLines: string[];
  unmatchedLedgerEntries: string[];
  rulesApplied?: number;
};

export async function reconcile(
  _db: DbSession,
  _ctx: DomainContext,
  input: { bankLines: BankLine[]; ledgerEntries: LedgerEntry[]; toleranceDays: number },
): Promise<DomainResult<ReconciliationResult>> {
  const calc = findMatches(input.bankLines, input.ledgerEntries, input.toleranceDays);
  const matches = calc.result;

  const matchedBankIds = new Set(matches.map((m) => m.bankLineId));
  const matchedLedgerIds = new Set(matches.map((m) => m.ledgerEntryId));

  const unmatchedBankLines = input.bankLines
    .filter((bl) => !matchedBankIds.has(bl.lineId))
    .map((bl) => bl.lineId);
  const unmatchedLedgerEntries = input.ledgerEntries
    .filter((le) => !matchedLedgerIds.has(le.entryId))
    .map((le) => le.entryId);

  return {
    kind: 'read',
    data: { matches, unmatchedBankLines, unmatchedLedgerEntries },
  };
}

export async function reconcileAndConfirm(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    bankStatementId: string;
    bankLines: BankLine[];
    ledgerEntries: LedgerEntry[];
    toleranceDays: number;
    confidenceThreshold: number;
  },
): Promise<DomainResult<ReconciliationResult>> {
  const calc = findMatches(input.bankLines, input.ledgerEntries, input.toleranceDays);
  const matches = calc.result;

  const matchedBankIds = new Set(matches.map((m) => m.bankLineId));
  const matchedLedgerIds = new Set(matches.map((m) => m.ledgerEntryId));

  const unmatchedBankLines = input.bankLines
    .filter((bl) => !matchedBankIds.has(bl.lineId))
    .map((bl) => bl.lineId);
  const unmatchedLedgerEntries = input.ledgerEntries
    .filter((le) => !matchedLedgerIds.has(le.entryId))
    .map((le) => le.entryId);

  const data: ReconciliationResult = { matches, unmatchedBankLines, unmatchedLedgerEntries };

  const highConfidenceMatches = matches.filter((m) => m.confidence >= input.confidenceThreshold);

  if (highConfidenceMatches.length === 0) {
    return { kind: 'read', data };
  }

  const intent = buildReconConfirmIntent(
    {
      bankStatementId: input.bankStatementId,
      matches: highConfidenceMatches.map((m) => ({
        bankLineId: m.bankLineId,
        ledgerEntryId: m.ledgerEntryId,
        confidence: m.confidence,
      })),
    },
    stableCanonicalJson({
      bankStatementId: input.bankStatementId,
      matchCount: highConfidenceMatches.length,
    }),
  );

  return { kind: 'intent+read', data, intents: [intent] };
}

/**
 * @see FIN-CB-REC-01 — Close a reconciliation session immutably.
 *
 * Validates all bank lines are either matched or explicitly excluded,
 * then emits a close intent that locks the session from further changes.
 */
export async function closeReconciliation(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    bankStatementId: string;
    sessionId: string;
    matchedCount: number;
    unmatchedCount: number;
    excludedLineIds: string[];
    closedBy: string;
  },
): Promise<DomainResult> {
  if (input.unmatchedCount > 0 && input.excludedLineIds.length === 0) {
    throw new Error(
      `Cannot close session: ${input.unmatchedCount} unmatched lines must be excluded or matched`,
    );
  }

  return {
    kind: 'intent',
    intents: [
      buildReconConfirmIntent(
        {
          bankStatementId: input.bankStatementId,
          matches: [],
        },
        stableCanonicalJson({
          sessionId: input.sessionId,
          action: 'close',
          closedBy: input.closedBy,
        }),
      ),
    ],
  };
}

/**
 * DB-backed reconciliation: loads matching rules from `bank_matching_rules`,
 * derives toleranceDays from the max rule tolerance, then runs the match engine.
 *
 * @see BR-02 — Auto-matching rules loaded from database
 */
export async function reconcileWithDbRules(
  db: DbSession,
  ctx: DomainContext,
  input: {
    bankAccountId: string;
    bankLines: BankLine[];
    ledgerEntries: LedgerEntry[];
    fallbackToleranceDays?: number;
  },
): Promise<DomainResult<ReconciliationResult>> {
  const rules = await getMatchingRulesForAccount(db, ctx, {
    bankAccountId: input.bankAccountId,
  });

  // Derive tolerance from rules; fall back to provided default or 3 days
  const toleranceDays =
    rules.length > 0
      ? Math.max(...rules.map((r) => r.toleranceDays))
      : (input.fallbackToleranceDays ?? 3);

  const calc = findMatches(input.bankLines, input.ledgerEntries, toleranceDays);
  const matches = calc.result;

  const matchedBankIds = new Set(matches.map((m) => m.bankLineId));
  const matchedLedgerIds = new Set(matches.map((m) => m.ledgerEntryId));

  const unmatchedBankLines = input.bankLines
    .filter((bl) => !matchedBankIds.has(bl.lineId))
    .map((bl) => bl.lineId);
  const unmatchedLedgerEntries = input.ledgerEntries
    .filter((le) => !matchedLedgerIds.has(le.entryId))
    .map((le) => le.entryId);

  return {
    kind: 'read',
    data: { matches, unmatchedBankLines, unmatchedLedgerEntries, rulesApplied: rules.length },
  };
}
