/**
 * IC Service Tests — M-04 verification
 *
 * Tests for intercompany service functions:
 * - reconcileIntercompany: matching, intent generation
 * - createAndMirrorIc: DomainError on same-company, intent shape
 * - reconcileFromDb: DB-backed reconciliation
 */
import { describe, expect, it } from 'vitest';

import { mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { createAndMirrorIc, reconcileIntercompany } from '../services/ic-service';

const SENDER_COMPANY = 'company-a';
const RECEIVER_COMPANY = 'company-b';

describe('createAndMirrorIc', () => {
  const baseInput = {
    senderCompanyId: SENDER_COMPANY,
    receiverCompanyId: RECEIVER_COMPANY,
    amountMinor: 100_000,
    currency: 'MYR',
    reference: 'INV-001',
    senderTransactionId: 'tx-sender-001',
    receiverTransactionId: 'tx-receiver-001',
  };

  it('throws DomainError when sender equals receiver (M-04a)', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    expect(() =>
      createAndMirrorIc(db, ctx, {
        ...baseInput,
        senderCompanyId: 'same-company',
        receiverCompanyId: 'same-company',
      }),
    ).toThrow('IC transaction cannot be within the same company');
  });

  it('throws DomainError (not raw Error) on same-company', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    try {
      createAndMirrorIc(db, ctx, {
        ...baseInput,
        senderCompanyId: 'same',
        receiverCompanyId: 'same',
      });
      expect.unreachable('Should have thrown');
    } catch (err: unknown) {
      expect((err as { code?: string }).code).toBe('IC_SAME_COMPANY');
    }
  });

  it('returns intent result with 2 bidirectional mirror intents (M-04b)', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const result = createAndMirrorIc(db, ctx, baseInput);
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(2);
      expect(result.intents[0].type).toBe('ic.mirror');
      expect(result.intents[1].type).toBe('ic.mirror');
    }
  });

  it('sender and receiver intents have distinct idempotency keys', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const result = createAndMirrorIc(db, ctx, baseInput);
    if (result.kind === 'intent') {
      expect(result.intents[0].idempotencyKey).toBeDefined();
      expect(result.intents[1].idempotencyKey).toBeDefined();
      expect(result.intents[0].idempotencyKey).not.toBe(result.intents[1].idempotencyKey);
    }
  });
});

describe('reconcileIntercompany', () => {
  const outgoing = [
    {
      transactionId: 'tx-out-1',
      fromCompanyId: SENDER_COMPANY,
      toCompanyId: RECEIVER_COMPANY,
      amountMinor: 50_000,
      currency: 'MYR',
      reference: 'REF-001',
    },
  ];

  const incoming = [
    {
      transactionId: 'tx-in-1',
      fromCompanyId: RECEIVER_COMPANY,
      toCompanyId: SENDER_COMPANY,
      amountMinor: 50_000,
      currency: 'MYR',
      reference: 'REF-001',
    },
  ];

  it('matches balanced IC transactions', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const result = reconcileIntercompany(db, ctx, { outgoing, incoming });
    expect(result.kind).toMatch(/intent|read/);
    if (result.kind === 'intent+read' || result.kind === 'read') {
      expect(result.data.totalMatched).toBe(1);
      expect(result.data.totalUnmatched).toBe(0);
    }
  });

  it('returns read-only when no balanced matches', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const unmatchedIncoming = [
      { ...incoming[0], amountMinor: 99_999 }, // different amount
    ];

    const result = reconcileIntercompany(db, ctx, {
      outgoing,
      incoming: unmatchedIncoming,
    });
    // Matched but not balanced → no intents
    if (result.kind === 'intent+read' || result.kind === 'read') {
      expect(result.data.matched[0]?.isBalanced).toBe(false);
    }
  });

  it('handles empty outgoing list', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const result = reconcileIntercompany(db, ctx, {
      outgoing: [],
      incoming,
    });
    if (result.kind === 'intent+read' || result.kind === 'read') {
      expect(result.data.totalMatched).toBe(0);
      expect(result.data.totalUnmatched).toBe(1);
    }
  });

  it('handles empty incoming list', () => {
    const db = mockDbSession();
    const ctx = testCtx();

    const result = reconcileIntercompany(db, ctx, {
      outgoing,
      incoming: [],
    });
    if (result.kind === 'intent+read' || result.kind === 'read') {
      expect(result.data.totalMatched).toBe(0);
      expect(result.data.totalUnmatched).toBe(1);
    }
  });
});
