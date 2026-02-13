import { describe, it, expect, vi } from 'vitest';

import {
  withTerminalOutcome,
  classifyError,
} from '../../pipeline/with-terminal-outcome.js';

describe('OPS-01: Retry and quarantine determinism', () => {
  const base = { entityType: 'contacts', legacyId: 'L1' };

  it('should retry transient errors up to MAX_RETRIES then quarantine', async () => {
    const fn = vi.fn().mockRejectedValue(
      Object.assign(new Error('serialization_failure'), { code: '40001' }),
    );

    const outcome = await withTerminalOutcome(base, fn);

    // 1 initial + 3 retries = 4 calls
    expect(fn).toHaveBeenCalledTimes(4);
    expect(outcome.status).toBe('quarantined');
    expect(outcome.errorClass).toBe('transient');
  });

  it('should quarantine permanent errors immediately (no retry)', async () => {
    const fn = vi.fn().mockRejectedValue(
      new Error('Validation failed: email is required'),
    );

    const outcome = await withTerminalOutcome(base, fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(outcome.status).toBe('quarantined');
    expect(outcome.errorClass).toBe('permanent');
  });

  it('should succeed on retry after transient failure', async () => {
    let attempt = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempt++;
      if (attempt <= 2) {
        throw Object.assign(new Error('timeout'), { code: '57014' });
      }
      return { ...base, status: 'loaded', action: 'create', targetId: 'A1' };
    });

    const outcome = await withTerminalOutcome(base, fn);

    expect(fn).toHaveBeenCalledTimes(3);
    expect(outcome.status).toBe('loaded');
    expect(outcome.targetId).toBe('A1');
  });

  it('should classify Postgres serialization failure as transient', () => {
    expect(classifyError({ code: '40001' })).toBe('transient');
  });

  it('should classify Postgres deadlock as transient', () => {
    expect(classifyError({ code: '40P01' })).toBe('transient');
  });

  it('should classify connection reset as transient', () => {
    expect(classifyError(new Error('ECONNRESET'))).toBe('transient');
  });

  it('should classify timeout string as transient', () => {
    expect(classifyError(new Error('Request timeout after 30s'))).toBe('transient');
  });

  it('should classify unknown errors as permanent', () => {
    expect(classifyError(new Error('Validation failed'))).toBe('permanent');
    expect(classifyError(new Error('Unique constraint violation'))).toBe('permanent');
    expect(classifyError({ code: '23505' })).toBe('permanent');
  });

  it('should never throw from withTerminalOutcome', async () => {
    // Even if fn throws something weird
    const fn = vi.fn().mockRejectedValue(null);

    const outcome = await withTerminalOutcome(base, fn);
    expect(outcome.status).toBe('quarantined');
  });
});
