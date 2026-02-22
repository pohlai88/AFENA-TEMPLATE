/**
 * GOV-01: Lightweight performance instrumentation.
 * Tracks p50/p95 latencies per label for CI budget assertions.
 */
export class PerfTracker {
  private timings: Map<string, number[]> = new Map();

  start(label: string): () => void {
    const t0 = performance.now();
    return () => {
      const elapsed = performance.now() - t0;
      const arr = this.timings.get(label) ?? [];
      arr.push(elapsed);
      this.timings.set(label, arr);
    };
  }

  p95(label: string): number {
    const arr = this.timings.get(label) ?? [];
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.95)] ?? 0;
  }

  p50(label: string): number {
    const arr = this.timings.get(label) ?? [];
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.5)] ?? 0;
  }

  count(label: string): number {
    return this.timings.get(label)?.length ?? 0;
  }

  toReport(): Record<string, { count: number; p50: number; p95: number }> {
    const result: Record<string, { count: number; p50: number; p95: number }> = {};
    for (const [label, arr] of this.timings) {
      const sorted = [...arr].sort((a, b) => a - b);
      result[label] = {
        count: arr.length,
        p50: sorted[Math.floor(sorted.length * 0.5)] ?? 0,
        p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
      };
    }
    return result;
  }

  record(label: string, value: number): void {
    const arr = this.timings.get(label) ?? [];
    arr.push(value);
    this.timings.set(label, arr);
  }

  report(): Array<{ label: string; count: number; p50: number; p95: number }> {
    const result: Array<{ label: string; count: number; p50: number; p95: number }> = [];
    for (const [label, arr] of this.timings) {
      const sorted = [...arr].sort((a, b) => a - b);
      result.push({
        label,
        count: arr.length,
        p50: sorted[Math.floor(sorted.length * 0.5)] ?? 0,
        p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
      });
    }
    return result;
  }

  reset(): void {
    this.timings.clear();
  }
}
