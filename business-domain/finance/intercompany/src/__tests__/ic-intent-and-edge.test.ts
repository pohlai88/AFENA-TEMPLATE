/**
 * G-11 — IC test expansion: intent builders, mirror validation, multi-currency edge cases
 */
import { describe, expect, it } from 'vitest';

import { mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import type { IcTransaction } from '../calculators/ic-matching';
import { matchIcTransactions } from '../calculators/ic-matching';
import {
  buildIcEliminateIntent,
  buildIcMatchIntent,
  buildIcMirrorIntent,
} from '../commands/ic-intent';
import { createAndMirrorIc } from '../services/ic-service';

/* ── Intent Builders ──────────────────────────────────── */

describe('IC intent builders', () => {
  it('buildIcMatchIntent returns ic.match type with idempotency key', () => {
    const intent = buildIcMatchIntent(
      { senderTransactionId: 'tx-1', receiverTransactionId: 'tx-2', matchConfidence: 0.95 },
      'key-1',
    );
    expect(intent.type).toBe('ic.match');
    expect(intent.idempotencyKey).toBe('key-1');
    expect(intent.payload).toHaveProperty('matchConfidence', 0.95);
  });

  it('buildIcMirrorIntent returns ic.mirror type', () => {
    const intent = buildIcMirrorIntent(
      {
        senderCompanyId: 'c1', receiverCompanyId: 'c2',
        amountMinor: 50_000, currency: 'MYR', reference: 'REF-1',
        transactionId: 'tx-1', side: 'sender',
      },
      'key-2',
    );
    expect(intent.type).toBe('ic.mirror');
    expect(intent.payload).toHaveProperty('side', 'sender');
  });

  it('buildIcEliminateIntent returns ic.eliminate type', () => {
    const intent = buildIcEliminateIntent(
      { matchedPairId: 'pair-1', eliminationJournalId: 'je-1', amountMinor: 10_000 },
      'key-3',
    );
    expect(intent.type).toBe('ic.eliminate');
    expect(intent.payload).toHaveProperty('eliminationJournalId', 'je-1');
  });

  it('each intent builder produces unique idempotency keys when given unique inputs', () => {
    const k1 = buildIcMatchIntent({ senderTransactionId: 'a', receiverTransactionId: 'b', matchConfidence: 1 }, 'k1');
    const k2 = buildIcMatchIntent({ senderTransactionId: 'c', receiverTransactionId: 'd', matchConfidence: 1 }, 'k2');
    expect(k1.idempotencyKey).not.toBe(k2.idempotencyKey);
  });
});

/* ── Mirror Edge Cases ────────────────────────────────── */

describe('createAndMirrorIc edge cases', () => {
  const db = mockDbSession();
  const ctx = testCtx();

  it('mirror intents carry the shared reference', () => {
    const result = createAndMirrorIc(db, ctx, {
      senderCompanyId: 'c1', receiverCompanyId: 'c2',
      amountMinor: 200_000, currency: 'USD', reference: 'IC-SHARED-REF',
      senderTransactionId: 'stx-1', receiverTransactionId: 'rtx-1',
    });
    if (result.kind === 'intent') {
      expect(result.intents[0].payload).toHaveProperty('reference', 'IC-SHARED-REF');
      expect(result.intents[1].payload).toHaveProperty('reference', 'IC-SHARED-REF');
    }
  });

  it('mirror intents have opposite sides (sender/receiver)', () => {
    const result = createAndMirrorIc(db, ctx, {
      senderCompanyId: 'c1', receiverCompanyId: 'c2',
      amountMinor: 100_000, currency: 'MYR', reference: 'REF-X',
      senderTransactionId: 'stx-2', receiverTransactionId: 'rtx-2',
    });
    if (result.kind === 'intent') {
      expect(result.intents[0].payload).toHaveProperty('side', 'sender');
      expect(result.intents[1].payload).toHaveProperty('side', 'receiver');
    }
  });

  it('mirror preserves exact amount (no rounding)', () => {
    const result = createAndMirrorIc(db, ctx, {
      senderCompanyId: 'c1', receiverCompanyId: 'c2',
      amountMinor: 123_456_789, currency: 'JPY', reference: 'REF-Y',
      senderTransactionId: 'stx-3', receiverTransactionId: 'rtx-3',
    });
    if (result.kind === 'intent') {
      expect(result.intents[0].payload).toHaveProperty('amountMinor', 123_456_789);
      expect(result.intents[1].payload).toHaveProperty('amountMinor', 123_456_789);
    }
  });
});

/* ── Multi-Currency Matching ──────────────────────────── */

describe('IC matching — multi-currency edge cases', () => {
  it('does not match transactions in different currencies', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10_000, currency: 'MYR', reference: 'REF-1' },
    ];
    const inc: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10_000, currency: 'USD', reference: 'REF-1' },
    ];
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(0);
    expect(result.unmatchedOutgoing).toHaveLength(1);
    expect(result.unmatchedIncoming).toHaveLength(1);
  });

  it('matches same-currency transactions across multiple currency pairs', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10_000, currency: 'MYR', reference: 'REF-1' },
      { transactionId: 'o2', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 5_000, currency: 'USD', reference: 'REF-2' },
    ];
    const inc: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10_000, currency: 'MYR', reference: 'REF-1' },
      { transactionId: 'i2', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 5_000, currency: 'USD', reference: 'REF-2' },
    ];
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(2);
    expect(result.matched.every((m) => m.isBalanced)).toBe(true);
  });

  it('does not match when references differ', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10_000, currency: 'MYR', reference: 'REF-A' },
    ];
    const inc: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10_000, currency: 'MYR', reference: 'REF-B' },
    ];
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(0);
  });

  it('handles large batch matching (10 pairs)', () => {
    const out: IcTransaction[] = Array.from({ length: 10 }, (_, i) => ({
      transactionId: `o-${i}`, fromCompanyId: 'c1', toCompanyId: 'c2',
      amountMinor: (i + 1) * 1_000, currency: 'MYR', reference: `BATCH-${i}`,
    }));
    const inc: IcTransaction[] = Array.from({ length: 10 }, (_, i) => ({
      transactionId: `i-${i}`, fromCompanyId: 'c2', toCompanyId: 'c1',
      amountMinor: (i + 1) * 1_000, currency: 'MYR', reference: `BATCH-${i}`,
    }));
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(10);
    expect(result.unmatchedOutgoing).toHaveLength(0);
    expect(result.unmatchedIncoming).toHaveLength(0);
  });

  it('explanation string includes match counts', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 1_000, currency: 'MYR', reference: 'R1' },
    ];
    const { explanation } = matchIcTransactions(out, []);
    expect(explanation).toContain('0 matched');
    expect(explanation).toContain('1 unmatched outgoing');
  });

  it('matches zero-amount IC transactions (e.g. reclassification entries)', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 0, currency: 'MYR', reference: 'RECLASS-1' },
    ];
    const inc: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 0, currency: 'MYR', reference: 'RECLASS-1' },
    ];
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0]!.isBalanced).toBe(true);
  });

  it('handles three-company triangle (c1→c2, c2→c3, c3→c1)', () => {
    const out: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-1' },
      { transactionId: 'o2', fromCompanyId: 'c2', toCompanyId: 'c3', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-2' },
      { transactionId: 'o3', fromCompanyId: 'c3', toCompanyId: 'c1', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-3' },
    ];
    const inc: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-1' },
      { transactionId: 'i2', fromCompanyId: 'c3', toCompanyId: 'c2', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-2' },
      { transactionId: 'i3', fromCompanyId: 'c1', toCompanyId: 'c3', amountMinor: 10_000, currency: 'MYR', reference: 'TRI-3' },
    ];
    const result = matchIcTransactions(out, inc).result;
    expect(result.matched).toHaveLength(3);
    expect(result.matched.every((m) => m.isBalanced)).toBe(true);
  });
});
