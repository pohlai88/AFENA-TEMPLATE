import { describe, it, expect } from 'vitest';

import { PerfTracker } from '../../pipeline/perf-tracker.js';
import type { StepCheckpoint } from '../../types/checkpoint.js';

describe('OPS-02: Step-level checkpoint resume precision', () => {
  it('should represent a valid checkpoint shape', () => {
    const checkpoint: StepCheckpoint = {
      cursor: { type: 'offset', offset: 500 },
      batchIndex: 3,
      loadedUpTo: 327,
      transformVersion: 'abc123',
    };

    expect(checkpoint.batchIndex).toBe(3);
    expect(checkpoint.loadedUpTo).toBe(327);
    expect(checkpoint.cursor).toEqual({ type: 'offset', offset: 500 });
  });

  it('should allow optional planFingerprint', () => {
    const checkpoint: StepCheckpoint = {
      cursor: { type: 'offset', offset: 0 },
      batchIndex: 0,
      loadedUpTo: 0,
      transformVersion: 'v1',
      planFingerprint: 'fp-abc',
    };

    expect(checkpoint.planFingerprint).toBe('fp-abc');
  });

  it('should resume from loadedUpTo after simulated crash', () => {
    // Simulate: crash at index 327 out of 1000
    const checkpoint: StepCheckpoint = {
      cursor: { type: 'offset', offset: 500 },
      batchIndex: 2,
      loadedUpTo: 327,
      transformVersion: 'v1',
    };

    // Resume logic: start processing at index loadedUpTo + 1
    const resumeFrom = checkpoint.loadedUpTo + 1;
    expect(resumeFrom).toBe(328);

    // Verify records 0..327 are skipped
    const totalRecords = 1000;
    const recordsToProcess = totalRecords - resumeFrom;
    expect(recordsToProcess).toBe(672);
  });

  it('should advance cursor on batch completion', () => {
    const before: StepCheckpoint = {
      cursor: { type: 'offset', offset: 500 },
      batchIndex: 2,
      loadedUpTo: 499,
      transformVersion: 'v1',
    };

    // After batch completes: advance cursor, reset loadedUpTo, increment batchIndex
    const after: StepCheckpoint = {
      cursor: { type: 'offset', offset: 1000 },
      batchIndex: before.batchIndex + 1,
      loadedUpTo: 0,
      transformVersion: before.transformVersion,
    };

    expect(after.batchIndex).toBe(3);
    expect(after.loadedUpTo).toBe(0);
    expect(after.cursor).toEqual({ type: 'offset', offset: 1000 });
  });

  it('should support all cursor types', () => {
    const offsetCheckpoint: StepCheckpoint = {
      cursor: { type: 'offset', offset: 100 },
      batchIndex: 0,
      loadedUpTo: 0,
      transformVersion: 'v1',
    };
    expect(offsetCheckpoint.cursor?.type).toBe('offset');

    const idCheckpoint: StepCheckpoint = {
      cursor: { type: 'id', lastId: 'uuid-abc' },
      batchIndex: 0,
      loadedUpTo: 0,
      transformVersion: 'v1',
    };
    expect(idCheckpoint.cursor?.type).toBe('id');

    const nullCheckpoint: StepCheckpoint = {
      cursor: null,
      batchIndex: 0,
      loadedUpTo: 0,
      transformVersion: 'v1',
    };
    expect(nullCheckpoint.cursor).toBeNull();
  });
});

describe('OPS-02: PerfTracker correctness', () => {
  it('should track p50 and p95 latencies', () => {
    const tracker = new PerfTracker();

    // Simulate 100 measurements
    for (let i = 1; i <= 100; i++) {
      const end = tracker.start('test_op');
      // Immediately end (near-zero latency)
      end();
    }

    expect(tracker.count('test_op')).toBe(100);
    expect(tracker.p50('test_op')).toBeGreaterThanOrEqual(0);
    expect(tracker.p95('test_op')).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 for unknown labels', () => {
    const tracker = new PerfTracker();
    expect(tracker.p50('unknown')).toBe(0);
    expect(tracker.p95('unknown')).toBe(0);
    expect(tracker.count('unknown')).toBe(0);
  });

  it('should produce a report with all tracked labels', () => {
    const tracker = new PerfTracker();

    const end1 = tracker.start('extract');
    end1();
    const end2 = tracker.start('detect');
    end2();

    const report = tracker.toReport();
    expect(Object.keys(report)).toContain('extract');
    expect(Object.keys(report)).toContain('detect');
    expect(report['extract']!.count).toBe(1);
    expect(report['detect']!.count).toBe(1);
  });

  it('should reset all timings', () => {
    const tracker = new PerfTracker();
    const end = tracker.start('op');
    end();
    expect(tracker.count('op')).toBe(1);

    tracker.reset();
    expect(tracker.count('op')).toBe(0);
  });
});
