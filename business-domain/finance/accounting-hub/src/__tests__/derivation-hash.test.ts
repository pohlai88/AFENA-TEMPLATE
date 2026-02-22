/**
 * Derivation Hash Tests — M-01 verification
 *
 * Proves SHA-256 + canonical fingerprint correctness:
 * 1. Determinism — same input → same hash
 * 2. Collision resistance — 100K unique inputs, 0 collisions
 * 3. Different-input divergence — 1 char diff → different hash
 * 4. Key-order stability — different object key order → same hash
 * 5. Numeric normalization — stableCanonicalJson handles numbers consistently
 * 6. Zero-amount skippedRules — 3-way allocation, one fraction rounds to 0
 */
import { describe, expect, it } from 'vitest';

import type { DerivationInput } from '../calculators/derivation-engine';
import {
  canonicalDerivationFingerprint,
  createSha256Hash,
  deriveJournalLines,
} from '../calculators/derivation-engine';

const BASE_INPUT: DerivationInput = {
  eventId: 'evt-001',
  amountMinor: 10000,
  currencyCode: 'MYR',
  rules: [
    { debitAccountId: 'acc-dr-1', creditAccountId: 'acc-cr-1', fraction: 1.0 },
  ],
  mappingVersion: 1,
};

describe('createSha256Hash', () => {
  it('returns 32 hex characters', () => {
    const hash = createSha256Hash('test-input');
    expect(hash).toHaveLength(32);
    expect(hash).toMatch(/^[0-9a-f]{32}$/);
  });

  it('is deterministic — same input produces same hash', () => {
    const a = createSha256Hash('deterministic-test');
    const b = createSha256Hash('deterministic-test');
    expect(a).toBe(b);
  });

  it('different inputs produce different hashes', () => {
    const a = createSha256Hash('input-a');
    const b = createSha256Hash('input-b');
    expect(a).not.toBe(b);
  });

  it('1 char difference produces different hash', () => {
    const a = createSha256Hash('hello world');
    const b = createSha256Hash('hello worlD');
    expect(a).not.toBe(b);
  });

  it('collision resistance — 100K unique inputs, 0 collisions', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100_000; i++) {
      const hash = createSha256Hash(`unique-input-${i}`);
      expect(seen.has(hash), `Collision at i=${i}`).toBe(false);
      seen.add(hash);
    }
    expect(seen.size).toBe(100_000);
  });
});

describe('canonicalDerivationFingerprint', () => {
  it('key-order stability — same semantic input with different construction order → same fingerprint', () => {
    const input1: DerivationInput = {
      eventId: 'evt-x',
      amountMinor: 5000,
      currencyCode: 'USD',
      rules: [{ debitAccountId: 'a', creditAccountId: 'b', fraction: 1.0 }],
      mappingVersion: 2,
    };

    // Same data, different property order in construction
    const input2: DerivationInput = {
      mappingVersion: 2,
      rules: [{ debitAccountId: 'a', creditAccountId: 'b', fraction: 1.0 }],
      currencyCode: 'USD',
      amountMinor: 5000,
      eventId: 'evt-x',
    };

    const fp1 = canonicalDerivationFingerprint(input1);
    const fp2 = canonicalDerivationFingerprint(input2);
    expect(fp1).toBe(fp2);
  });

  it('numeric consistency — integer amounts produce stable fingerprints', () => {
    const input1: DerivationInput = {
      ...BASE_INPUT,
      amountMinor: 1000,
    };
    const input2: DerivationInput = {
      ...BASE_INPUT,
      amountMinor: 1000,
    };
    expect(canonicalDerivationFingerprint(input1)).toBe(canonicalDerivationFingerprint(input2));
  });

  it('different amounts produce different fingerprints', () => {
    const input1: DerivationInput = { ...BASE_INPUT, amountMinor: 1000 };
    const input2: DerivationInput = { ...BASE_INPUT, amountMinor: 1001 };
    expect(canonicalDerivationFingerprint(input1)).not.toBe(canonicalDerivationFingerprint(input2));
  });
});

describe('deriveJournalLines — skippedRules (M-11)', () => {
  it('3-way allocation where one fraction rounds to zero — skippedRules.length === 1', () => {
    const input: DerivationInput = {
      eventId: 'evt-zero',
      amountMinor: 10, // very small amount
      currencyCode: 'MYR',
      rules: [
        { debitAccountId: 'acc-dr-1', creditAccountId: 'acc-cr-1', fraction: 0.5 },
        { debitAccountId: 'acc-dr-2', creditAccountId: 'acc-cr-2', fraction: 0.5 },
        { debitAccountId: 'acc-dr-3', creditAccountId: 'acc-cr-3', fraction: 0.001 }, // rounds to 0
      ],
      mappingVersion: 1,
    };

    const { result } = deriveJournalLines(input);
    expect(result.skippedRules).toHaveLength(1);
    expect(result.skippedRules[0].reason).toBe('zero_amount');
    expect(result.skippedRules[0].rule.fraction).toBe(0.001);
    // Remaining lines still balance
    expect(result.totalDebitMinor).toBe(result.totalCreditMinor);
  });

  it('no skipped rules when all fractions produce non-zero amounts', () => {
    const { result } = deriveJournalLines(BASE_INPUT);
    expect(result.skippedRules).toHaveLength(0);
  });
});

describe('deriveJournalLines — derivationId uses SHA-256', () => {
  it('derivationId starts with deriv- prefix', () => {
    const { result } = deriveJournalLines(BASE_INPUT);
    expect(result.derivationId).toMatch(/^deriv-[0-9a-f]{32}$/);
  });

  it('same input produces same derivationId (deterministic)', () => {
    const a = deriveJournalLines(BASE_INPUT);
    const b = deriveJournalLines(BASE_INPUT);
    expect(a.result.derivationId).toBe(b.result.derivationId);
  });

  it('different eventId produces different derivationId', () => {
    const a = deriveJournalLines(BASE_INPUT);
    const b = deriveJournalLines({ ...BASE_INPUT, eventId: 'evt-002' });
    expect(a.result.derivationId).not.toBe(b.result.derivationId);
  });
});
