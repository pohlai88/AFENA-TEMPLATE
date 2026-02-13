import { describe, it, expect } from 'vitest';

import { KpiTracker } from '../../pipeline/kpi-tracker.js';

describe('P2-2: Accuracy KPI Tracker', () => {
  it('should track counter increments', () => {
    const kpi = new KpiTracker();
    kpi.increment('duplicates_prevented');
    kpi.increment('duplicates_prevented');
    kpi.increment('auto_merge_count', 5);
    expect(kpi.get('duplicates_prevented')).toBe(2);
    expect(kpi.get('auto_merge_count')).toBe(5);
    expect(kpi.get('nonexistent')).toBe(0);
  });

  it('should detect cursor replays', () => {
    const kpi = new KpiTracker();
    kpi.trackLegacyId('legacy-1');
    kpi.trackLegacyId('legacy-2');
    kpi.trackLegacyId('legacy-1'); // replay
    kpi.trackLegacyId('legacy-3');
    kpi.trackLegacyId('legacy-2'); // replay
    expect(kpi.get('cursor_replays_detected')).toBe(2);
  });

  it('should produce a structured report', () => {
    const kpi = new KpiTracker();
    kpi.increment('duplicates_prevented', 3);
    kpi.increment('manual_review_count', 7);
    kpi.trackLegacyId('a');
    kpi.trackLegacyId('b');
    kpi.trackLegacyId('a');

    const report = kpi.toReport();
    expect(report['duplicates_prevented']).toBe(3);
    expect(report['manual_review_count']).toBe(7);
    expect(report['cursor_replays_detected']).toBe(1);
    expect(report['unique_legacy_ids_seen']).toBe(2);
  });

  it('should start with zero counters', () => {
    const kpi = new KpiTracker();
    const report = kpi.toReport();
    expect(report['unique_legacy_ids_seen']).toBe(0);
    expect(Object.keys(report)).toHaveLength(1); // only unique_legacy_ids_seen
  });
});
