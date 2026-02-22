/**
 * Derivation Engine Calculator
 *
 * Core of the accounting hub: computes derivation hashes and applies
 * mapping rules to produce derived journal lines from accounting events.
 *
 * Two-hash recipe:
 *   eventId = SHA-256(stableCanonicalJson(business payload))
 *   derivationId = SHA-256(eventId + mappingVersion + inputsHash)
 */
import type { CalculatorResult } from 'afenda-canon';
import { DomainError, stableCanonicalJson } from 'afenda-canon';
import { createHash } from 'node:crypto';

export type MappingRule = {
  debitAccountId: string;
  creditAccountId: string;
  /** Fraction of the event amount (e.g. 1.0 for full, 0.5 for half) */
  fraction: number;
  description?: string;
};

export type DerivedJournalLine = {
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
};

export type DerivationInput = {
  eventId: string;
  amountMinor: number;
  currencyCode: string;
  rules: readonly MappingRule[];
  mappingVersion: number;
};

export type SkippedRule = {
  rule: MappingRule;
  reason: 'zero_amount';
};

export type DerivationResult = {
  derivationId: string;
  journalLines: DerivedJournalLine[];
  totalDebitMinor: number;
  totalCreditMinor: number;
  skippedRules: SkippedRule[];
  inputs: DerivationInput;
  explanation: string;
};

/**
 * Computes a SHA-256 hash of the input string.
 * Returns 32 hex characters (128 bits) — sufficient for operational safety.
 */
export function createSha256Hash(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 32);
}

/**
 * Builds a canonical fingerprint for derivation identity.
 * Uses a minimal, stable field set serialized via stableCanonicalJson
 * (sorted keys, no whitespace) to prevent "false non-idempotency"
 * from serialization variance (key order, float formatting).
 */
export function canonicalDerivationFingerprint(input: DerivationInput): string {
  return stableCanonicalJson({
    amountMinor: input.amountMinor,
    currencyCode: input.currencyCode,
    eventId: input.eventId,
    mappingVersion: input.mappingVersion,
    ruleCount: input.rules.length,
  });
}

/**
 * Computes the derivationId from the two-hash recipe.
 */
export function computeDerivationId(
  eventId: string,
  mappingVersion: number,
  inputsHash: string,
): CalculatorResult<string> {
  const composite = stableCanonicalJson({ eventId, inputsHash, mappingVersion });
  const result = `deriv-${createSha256Hash(composite)}`;
  const explanation = `Computed derivation ID ${result} from event ${eventId}, mapping v${mappingVersion}`;
  return {
    result,
    inputs: { eventId, mappingVersion, inputsHash },
    explanation,
  };
}

/**
 * Applies mapping rules to an accounting event to produce derived journal lines.
 * Returns balanced DR=CR lines.
 */
export function deriveJournalLines(input: DerivationInput): CalculatorResult<DerivationResult> {
  if (input.rules.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Derivation requires at least one mapping rule');
  }
  if (input.amountMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Event amount must be non-negative');
  }

  const journalLines: DerivedJournalLine[] = [];
  const skippedRules: SkippedRule[] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  for (const rule of input.rules) {
    const amount = Math.round(input.amountMinor * rule.fraction);
    if (amount > 0) {
      journalLines.push({ accountId: rule.debitAccountId, side: 'debit', amountMinor: amount });
      journalLines.push({ accountId: rule.creditAccountId, side: 'credit', amountMinor: amount });
      totalDebit += amount;
      totalCredit += amount;
    } else {
      skippedRules.push({ rule, reason: 'zero_amount' });
    }
  }

  const inputsHash = createSha256Hash(
    canonicalDerivationFingerprint(input),
  );

  const { result: derivationId } = computeDerivationId(
    input.eventId,
    input.mappingVersion,
    inputsHash,
  );

  const explanation = `Derived ${journalLines.length} lines from event ${input.eventId} using ${input.rules.length} rules (v${input.mappingVersion}). DR=${totalDebit}, CR=${totalCredit}.`;
  return {
    result: {
      derivationId,
      journalLines,
      totalDebitMinor: totalDebit,
      totalCreditMinor: totalCredit,
      skippedRules,
      inputs: input,
      explanation,
    },
    inputs: { ...input },
    explanation,
  };
}
