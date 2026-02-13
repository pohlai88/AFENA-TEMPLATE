import { describe, it, expect } from 'vitest';

import { PerfTracker } from '../../pipeline/perf-tracker.js';
import { withTerminalOutcome } from '../../pipeline/with-terminal-outcome.js';

import type { RecordOutcome } from '../../types/record-outcome.js';

describe('GOV-01: Performance budget assertions', () => {
  it('should track p50 and p95 latencies accurately', () => {
    const perf = new PerfTracker();

    // Simulate 100 latency samples: 1ms to 100ms
    for (let i = 1; i <= 100; i++) {
      perf.record('mutate_create_ms', i);
    }

    const report = perf.report();
    const createMetric = report.find(r => r.label === 'mutate_create_ms');
    expect(createMetric).toBeDefined();
    expect(createMetric!.count).toBe(100);
    expect(createMetric!.p50).toBe(51);
    expect(createMetric!.p95).toBe(96);
  });

  it('should keep withTerminalOutcome overhead under 5ms for successful operations', async () => {
    const iterations = 50;
    const latencies: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await withTerminalOutcome(
        { entityType: 'contacts', legacyId: `L${i}` },
        async (): Promise<RecordOutcome> => ({
          entityType: 'contacts',
          legacyId: `L${i}`,
          status: 'loaded',
          action: 'create',
        }),
      );
      latencies.push(performance.now() - start);
    }

    latencies.sort((a, b) => a - b);
    const p95 = latencies[Math.floor(latencies.length * 0.95)]!;

    // withTerminalOutcome overhead should be negligible for successful ops
    expect(p95).toBeLessThan(5);
  });

  it('should keep PerfTracker.start/end overhead under 1ms', () => {
    const perf = new PerfTracker();
    const iterations = 1000;
    const overheads: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const outerStart = performance.now();
      const end = perf.start('test_label');
      end();
      overheads.push(performance.now() - outerStart);
    }

    overheads.sort((a, b) => a - b);
    const p95 = overheads[Math.floor(overheads.length * 0.95)]!;

    expect(p95).toBeLessThan(1);
    expect(perf.report().find(r => r.label === 'test_label')!.count).toBe(iterations);
  });

  it('should produce correct report shape', () => {
    const perf = new PerfTracker();
    perf.record('extract_batch_ms', 10);
    perf.record('extract_batch_ms', 20);
    perf.record('detect_conflicts_ms', 5);

    const report = perf.report();
    expect(report).toHaveLength(2);

    for (const metric of report) {
      expect(metric).toHaveProperty('label');
      expect(metric).toHaveProperty('count');
      expect(metric).toHaveProperty('p50');
      expect(metric).toHaveProperty('p95');
      expect(typeof metric.label).toBe('string');
      expect(typeof metric.count).toBe('number');
      expect(typeof metric.p50).toBe('number');
      expect(typeof metric.p95).toBe('number');
      expect(metric.p50).toBeLessThanOrEqual(metric.p95);
    }
  });

  it('should handle single-sample metrics', () => {
    const perf = new PerfTracker();
    perf.record('single_ms', 42);

    const report = perf.report();
    const metric = report.find(r => r.label === 'single_ms')!;
    expect(metric.count).toBe(1);
    expect(metric.p50).toBe(42);
    expect(metric.p95).toBe(42);
  });
});
