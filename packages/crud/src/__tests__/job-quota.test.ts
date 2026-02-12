/**
 * Job Quota Tests — Sprint 2 Governor
 *
 * Verifies concurrent + enqueue-rate limits keyed by org_id + queue.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  acquireJobSlot,
  releaseJob,
  getJobQuotaState,
  _resetJobQuotaStore,
} from '../job-quota';

beforeEach(() => {
  _resetJobQuotaStore();
});

describe('acquireJobSlot', () => {
  it('allows a job when under concurrent limit', () => {
    const result = acquireJobSlot('org_1', 'default', { maxConcurrent: 3, maxEnqueuedPerMinute: 30 });
    expect(result.allowed).toBe(true);
    expect(result.currentConcurrent).toBe(1);
  });

  it('denies when concurrent limit is reached', () => {
    const config = { maxConcurrent: 2, maxEnqueuedPerMinute: 30 };
    acquireJobSlot('org_1', 'test', config);
    acquireJobSlot('org_1', 'test', config);

    const result = acquireJobSlot('org_1', 'test', config);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('MAX_CONCURRENT');
    expect(result.currentConcurrent).toBe(2);
  });

  it('allows after releasing a slot', () => {
    const config = { maxConcurrent: 1, maxEnqueuedPerMinute: 30 };
    acquireJobSlot('org_1', 'test', config);

    // At limit
    expect(acquireJobSlot('org_1', 'test', config).allowed).toBe(false);

    // Release
    releaseJob('org_1', 'test');

    // Now allowed
    expect(acquireJobSlot('org_1', 'test', config).allowed).toBe(true);
  });

  it('denies when enqueue rate limit is reached', () => {
    const config = { maxConcurrent: 100, maxEnqueuedPerMinute: 3 };
    acquireJobSlot('org_1', 'test', config);
    releaseJob('org_1', 'test');
    acquireJobSlot('org_1', 'test', config);
    releaseJob('org_1', 'test');
    acquireJobSlot('org_1', 'test', config);
    releaseJob('org_1', 'test');

    // 3 enqueued in the last minute — rate limit hit
    const result = acquireJobSlot('org_1', 'test', config);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('MAX_ENQUEUED_PER_MINUTE');
  });

  it('isolates quotas by org', () => {
    const config = { maxConcurrent: 1, maxEnqueuedPerMinute: 30 };
    acquireJobSlot('org_1', 'test', config);

    // org_1 is at limit
    expect(acquireJobSlot('org_1', 'test', config).allowed).toBe(false);

    // org_2 is independent
    expect(acquireJobSlot('org_2', 'test', config).allowed).toBe(true);
  });

  it('isolates quotas by queue', () => {
    const config = { maxConcurrent: 1, maxEnqueuedPerMinute: 30 };
    acquireJobSlot('org_1', 'workflow', config);

    // workflow is at limit
    expect(acquireJobSlot('org_1', 'workflow', config).allowed).toBe(false);

    // import is independent
    expect(acquireJobSlot('org_1', 'import', config).allowed).toBe(true);
  });

  it('returns correct metadata', () => {
    const config = { maxConcurrent: 5, maxEnqueuedPerMinute: 20 };
    const result = acquireJobSlot('org_1', 'test', config);
    expect(result.maxConcurrent).toBe(5);
    expect(result.maxEnqueuedPerMinute).toBe(20);
    expect(result.enqueuedLastMinute).toBe(1);
  });
});

describe('getJobQuotaState', () => {
  it('returns zero state for unknown org+queue', () => {
    const state = getJobQuotaState('org_new', 'default');
    expect(state.running).toBe(0);
    expect(state.enqueuedLastMinute).toBe(0);
  });

  it('reflects running count after acquire and release', () => {
    const config = { maxConcurrent: 5, maxEnqueuedPerMinute: 30 };
    acquireJobSlot('org_1', 'test', config);
    acquireJobSlot('org_1', 'test', config);

    expect(getJobQuotaState('org_1', 'test').running).toBe(2);

    releaseJob('org_1', 'test');
    expect(getJobQuotaState('org_1', 'test').running).toBe(1);
  });
});

describe('releaseJob', () => {
  it('does not go below zero', () => {
    releaseJob('org_1', 'test');
    releaseJob('org_1', 'test');
    expect(getJobQuotaState('org_1', 'test').running).toBe(0);
  });
});
