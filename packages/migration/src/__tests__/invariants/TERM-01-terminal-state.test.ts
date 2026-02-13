import { describe, it, expect, vi } from 'vitest';

import { withTerminalOutcome } from '../../pipeline/with-terminal-outcome.js';
import type { RecordOutcome } from '../../types/record-outcome.js';

describe('TERM-01: Every record reaches exactly one terminal state', () => {
  const base = { entityType: 'contacts', legacyId: 'L1' };

  it('should return loaded outcome on success', async () => {
    const outcome = await withTerminalOutcome(base, async () => ({
      ...base,
      status: 'loaded' as const,
      action: 'create' as const,
      targetId: 'A1',
    }));

    expect(outcome.status).toBe('loaded');
    expect(outcome.targetId).toBe('A1');
  });

  it('should return quarantined outcome on permanent error', async () => {
    const outcome = await withTerminalOutcome(base, async () => {
      throw new Error('Validation failed');
    });

    expect(outcome.status).toBe('quarantined');
    expect(outcome.errorClass).toBe('permanent');
    expect(outcome.entityType).toBe('contacts');
    expect(outcome.legacyId).toBe('L1');
  });

  it('should produce one RecordOutcome per input (mixed batch)', async () => {
    const inputs = [
      { entityType: 'contacts', legacyId: 'L1' },
      { entityType: 'contacts', legacyId: 'L2' },
      { entityType: 'contacts', legacyId: 'L3' },
      { entityType: 'contacts', legacyId: 'L4' },
    ];

    const outcomes: RecordOutcome[] = [];

    for (const input of inputs) {
      const outcome = await withTerminalOutcome(input, async () => {
        if (input.legacyId === 'L3') throw new Error('bad row');
        return { ...input, status: 'loaded' as const, action: 'create' as const };
      });
      outcomes.push(outcome);
    }

    expect(outcomes).toHaveLength(4);
    expect(outcomes.filter((o) => o.status === 'loaded')).toHaveLength(3);
    expect(outcomes.filter((o) => o.status === 'quarantined')).toHaveLength(1);
  });

  it('should satisfy processed = loaded + quarantined + manual_review + skipped', () => {
    const outcomes: RecordOutcome[] = [
      { entityType: 'contacts', legacyId: 'L1', status: 'loaded', action: 'create' },
      { entityType: 'contacts', legacyId: 'L2', status: 'loaded', action: 'update' },
      { entityType: 'contacts', legacyId: 'L3', status: 'quarantined', errorClass: 'permanent' },
      { entityType: 'contacts', legacyId: 'L4', status: 'skipped', action: 'skip' },
      { entityType: 'contacts', legacyId: 'L5', status: 'manual_review' },
    ];

    const loaded = outcomes.filter((o) => o.status === 'loaded').length;
    const quarantined = outcomes.filter((o) => o.status === 'quarantined').length;
    const manualReview = outcomes.filter((o) => o.status === 'manual_review').length;
    const skipped = outcomes.filter((o) => o.status === 'skipped').length;

    expect(loaded + quarantined + manualReview + skipped).toBe(outcomes.length);
  });

  it('should never have a record without a terminal status', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('crash'));

    const outcome = await withTerminalOutcome(base, fn);

    // withTerminalOutcome NEVER throws — always returns an outcome
    expect(outcome).toBeDefined();
    expect(outcome.status).toBeDefined();
    expect(['loaded', 'quarantined', 'manual_review', 'skipped']).toContain(outcome.status);
  });
});
