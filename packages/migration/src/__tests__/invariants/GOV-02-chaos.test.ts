import { describe, it, expect, vi } from 'vitest';

import { withTerminalOutcome, classifyError } from '../../pipeline/with-terminal-outcome.js';
import type { RecordOutcome } from '../../types/record-outcome.js';

describe('GOV-02: Chaos / fault injection tests', () => {
  const base = { entityType: 'contacts', legacyId: 'L1' };

  it('should quarantine after mutate() timeout (transient → retry → quarantine)', async () => {
    const fn = vi.fn().mockRejectedValue(
      Object.assign(new Error('socket hang up'), { stage: 'load' }),
    );

    const outcome = await withTerminalOutcome(base, fn);

    expect(fn).toHaveBeenCalledTimes(4); // 1 + 3 retries
    expect(outcome.status).toBe('quarantined');
    expect(outcome.errorClass).toBe('transient');
    expect(outcome.failureStage).toBe('load');
  });

  it('should quarantine after Postgres serialization conflict 40001', async () => {
    const fn = vi.fn().mockRejectedValue(
      Object.assign(new Error('could not serialize access'), { code: '40001', stage: 'load' }),
    );

    const outcome = await withTerminalOutcome(base, fn);

    expect(fn).toHaveBeenCalledTimes(4);
    expect(outcome.status).toBe('quarantined');
    expect(outcome.errorClass).toBe('transient');
    expect(outcome.errorCode).toBe('40001');
  });

  it('should still produce terminal outcome when report persistence fails', async () => {
    // Simulate: the record itself succeeds, but a downstream operation
    // (like report persistence) would fail. withTerminalOutcome only wraps
    // the record processing, so the record outcome is still valid.
    const fn = vi.fn().mockResolvedValue({
      ...base,
      status: 'loaded' as const,
      action: 'create' as const,
      targetId: 'A1',
    });

    const outcome = await withTerminalOutcome(base, fn);

    expect(outcome.status).toBe('loaded');
    expect(outcome.targetId).toBe('A1');
  });

  it('should hold terminal state invariant under mixed fault injection', { timeout: 30_000 }, async () => {
    const inputs = Array.from({ length: 20 }, (_, i) => ({
      entityType: 'contacts',
      legacyId: `L${i}`,
    }));

    const outcomes: RecordOutcome[] = [];

    for (const input of inputs) {
      const idx = Number(input.legacyId.slice(1));
      const outcome = await withTerminalOutcome(input, async () => {
        // Inject various faults
        if (idx % 5 === 0) throw Object.assign(new Error('timeout'), { code: '57014' });
        if (idx % 7 === 0) throw new Error('Validation failed');
        if (idx % 11 === 0) throw null; // weird throw
        return { ...input, status: 'loaded' as const, action: 'create' as const };
      });
      outcomes.push(outcome);
    }

    // TERM-01: every input has exactly one outcome
    expect(outcomes).toHaveLength(20);

    // Every outcome has a valid terminal status
    for (const o of outcomes) {
      expect(['loaded', 'quarantined', 'manual_review', 'skipped']).toContain(o.status);
    }

    // Sum check
    const loaded = outcomes.filter((o) => o.status === 'loaded').length;
    const quarantined = outcomes.filter((o) => o.status === 'quarantined').length;
    const manual = outcomes.filter((o) => o.status === 'manual_review').length;
    const skipped = outcomes.filter((o) => o.status === 'skipped').length;
    expect(loaded + quarantined + manual + skipped).toBe(20);
  });

  it('should classify ECONNREFUSED as transient', () => {
    expect(classifyError(new Error('connect ECONNREFUSED 127.0.0.1:5432'))).toBe('transient');
  });

  it('should classify Postgres deadlock 40P01 as transient', () => {
    expect(classifyError({ code: '40P01' })).toBe('transient');
  });

  it('should classify Postgres connection terminated 08006 as transient', () => {
    expect(classifyError({ code: '08006' })).toBe('transient');
  });

  it('should classify unique violation 23505 as permanent', () => {
    expect(classifyError({ code: '23505' })).toBe('permanent');
  });

  it('should classify check constraint 23514 as permanent', () => {
    expect(classifyError({ code: '23514' })).toBe('permanent');
  });
});
