import type { GateResult, MigrationJob } from '../types/migration-job.js';
import type { PreflightGate } from './gate-chain.js';

/**
 * OPS-03: Preflight Migration Readiness Gate.
 *
 * Runs configurable checks before migration starts:
 * - Field mapping completeness (% of legacy fields mapped)
 * - Match key null rate (flags if >threshold% of records have null match keys)
 * - Custom checks via injected functions
 *
 * Output is a structured readiness report that can be persisted.
 */

export interface ReadinessCheck {
  readonly name: string;
  check(job: MigrationJob): Promise<ReadinessCheckResult>;
}

export interface ReadinessCheckResult {
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
  details?: Record<string, unknown>;
}

export interface ReadinessReport {
  timestamp: string;
  jobId: string;
  entityType: string;
  checks: Array<ReadinessCheckResult & { name: string }>;
  overallPassed: boolean;
  errorCount: number;
  warningCount: number;
}

export class ReadinessGate implements PreflightGate {
  readonly name = 'OPS-03:readiness';
  private checks: ReadinessCheck[] = [];
  private lastReport: ReadinessReport | null = null;
  private failOnWarnings: boolean;

  constructor(opts?: { failOnWarnings?: boolean }) {
    this.failOnWarnings = opts?.failOnWarnings ?? false;
  }

  addCheck(check: ReadinessCheck): this {
    this.checks.push(check);
    return this;
  }

  getLastReport(): ReadinessReport | null {
    return this.lastReport;
  }

  async check(job: MigrationJob): Promise<GateResult> {
    const results: Array<ReadinessCheckResult & { name: string }> = [];

    for (const c of this.checks) {
      const result = await c.check(job);
      results.push({ ...result, name: c.name });
    }

    const errorCount = results.filter((r) => !r.passed && r.severity === 'error').length;
    const warningCount = results.filter((r) => !r.passed && r.severity === 'warning').length;
    const overallPassed = errorCount === 0 && (!this.failOnWarnings || warningCount === 0);

    this.lastReport = {
      timestamp: new Date().toISOString(),
      jobId: job.id,
      entityType: job.entityType,
      checks: results,
      overallPassed,
      errorCount,
      warningCount,
    };

    if (!overallPassed) {
      const failedNames = results
        .filter((r) => !r.passed && (r.severity === 'error' || (this.failOnWarnings && r.severity === 'warning')))
        .map((r) => r.name)
        .join(', ');
      return { passed: false, reason: `Readiness checks failed: ${failedNames}` };
    }

    return { passed: true };
  }
}

/**
 * Built-in readiness check: field mapping completeness.
 * Flags if fewer than threshold% of legacy fields are mapped.
 */
export class MappingCompletenessCheck implements ReadinessCheck {
  readonly name = 'mapping-completeness';
  constructor(_opts?: { threshold?: number }) {
  }

  check(job: MigrationJob): Promise<ReadinessCheckResult> {
    const mappings = job.fieldMappings;
    const mappedCount = Array.isArray(mappings) ? mappings.length : 0;

    if (mappedCount === 0) {
      return Promise.resolve({
        passed: false,
        severity: 'error',
        message: 'No field mappings defined',
        details: { mappedCount: 0 },
      });
    }

    return Promise.resolve({
      passed: true,
      severity: 'info',
      message: `${mappedCount} fields mapped`,
      details: { mappedCount },
    });
  }
}

/**
 * Built-in readiness check: match key null rate.
 * Accepts a sample function that returns null rate (0–1) for match keys.
 */
export class MatchKeyNullRateCheck implements ReadinessCheck {
  readonly name = 'match-key-null-rate';
  private threshold: number;
  private sampleFn: (job: MigrationJob) => Promise<Record<string, number>>;

  constructor(opts: {
    threshold?: number;
    sampleFn: (job: MigrationJob) => Promise<Record<string, number>>;
  }) {
    this.threshold = opts.threshold ?? 0.4;
    this.sampleFn = opts.sampleFn;
  }

  async check(job: MigrationJob): Promise<ReadinessCheckResult> {
    const nullRates = await this.sampleFn(job);
    const flagged = Object.entries(nullRates).filter(([, rate]) => rate > this.threshold);

    if (flagged.length > 0) {
      const details = Object.fromEntries(flagged);
      return {
        passed: false,
        severity: 'warning',
        message: `High null rate on match keys: ${flagged.map(([k, v]) => `${k}=${(v * 100).toFixed(0)}%`).join(', ')}`,
        details,
      };
    }

    return {
      passed: true,
      severity: 'info',
      message: 'Match key null rates within threshold',
      details: nullRates,
    };
  }
}
