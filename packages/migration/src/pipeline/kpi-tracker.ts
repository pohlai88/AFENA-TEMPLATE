/**
 * P2-2: Accuracy KPI tracker for migration observability.
 *
 * Tracks the 5 accuracy KPIs from the PRD:
 * - duplicates_prevented: reservation losers count
 * - cursor_replays_detected: same legacyId appearing in new batch
 * - manual_review_count: records routed to manual review
 * - auto_merge_count: records auto-merged
 * - conflict_count: total conflicts detected
 */
export class KpiTracker {
  private counters = new Map<string, number>();
  private seenLegacyIds = new Set<string>();

  increment(key: string, amount: number = 1): void {
    this.counters.set(key, (this.counters.get(key) ?? 0) + amount);
  }

  get(key: string): number {
    return this.counters.get(key) ?? 0;
  }

  trackLegacyId(legacyId: string): void {
    if (this.seenLegacyIds.has(legacyId)) {
      this.increment('cursor_replays_detected');
    }
    this.seenLegacyIds.add(legacyId);
  }

  toReport(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of this.counters) {
      result[key] = value;
    }
    result['unique_legacy_ids_seen'] = this.seenLegacyIds.size;
    return result;
  }
}
