/**
 * Metering Tests — Sprint 2 Governor
 *
 * Verifies metering functions don't throw and handle edge cases.
 * Actual DB upserts are fire-and-forget — these tests verify
 * the functions are safe to call without a live DB connection.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock afena-database to avoid DATABASE_URL requirement
vi.mock('afena-database', () => ({
  db: {
    insert: () => ({
      values: () => ({
        onConflictDoUpdate: () => Promise.resolve(),
      }),
    }),
  },
  orgUsageDaily: {
    orgId: 'org_id',
    day: 'day',
    apiRequests: 'api_requests',
    jobRuns: 'job_runs',
    jobMs: 'job_ms',
    dbTimeouts: 'db_timeouts',
    storageBytes: 'storage_bytes',
  },
  sql: Object.assign(
    (strings: TemplateStringsArray, ..._values: unknown[]) => strings.join(''),
    { raw: (v: string) => v },
  ),
}));

import {
  meterApiRequest,
  meterJobRun,
  meterDbTimeout,
  meterStorageBytes,
} from '../metering';

describe('metering (fire-and-forget safety)', () => {
  it('meterApiRequest does not throw with valid orgId', () => {
    expect(() => meterApiRequest('org_1')).not.toThrow();
  });

  it('meterApiRequest silently skips empty orgId', () => {
    expect(() => meterApiRequest('')).not.toThrow();
  });

  it('meterJobRun does not throw with valid args', () => {
    expect(() => meterJobRun('org_1', 1500)).not.toThrow();
  });

  it('meterJobRun handles zero duration', () => {
    expect(() => meterJobRun('org_1', 0)).not.toThrow();
  });

  it('meterJobRun handles negative duration', () => {
    expect(() => meterJobRun('org_1', -100)).not.toThrow();
  });

  it('meterJobRun handles NaN duration', () => {
    expect(() => meterJobRun('org_1', NaN)).not.toThrow();
  });

  it('meterDbTimeout does not throw', () => {
    expect(() => meterDbTimeout('org_1')).not.toThrow();
  });

  it('meterDbTimeout silently skips empty orgId', () => {
    expect(() => meterDbTimeout('')).not.toThrow();
  });

  it('meterStorageBytes does not throw with valid args', () => {
    expect(() => meterStorageBytes('org_1', 1024)).not.toThrow();
  });

  it('meterStorageBytes silently skips zero bytes', () => {
    expect(() => meterStorageBytes('org_1', 0)).not.toThrow();
  });

  it('meterStorageBytes silently skips negative bytes', () => {
    expect(() => meterStorageBytes('org_1', -500)).not.toThrow();
  });

  it('meterStorageBytes silently skips NaN bytes', () => {
    expect(() => meterStorageBytes('org_1', NaN)).not.toThrow();
  });

  it('meterStorageBytes silently skips empty orgId', () => {
    expect(() => meterStorageBytes('', 1024)).not.toThrow();
  });
});
