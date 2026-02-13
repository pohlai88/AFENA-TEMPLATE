import { describe, it, expect } from 'vitest';

import { ReadinessGate, MappingCompletenessCheck, MatchKeyNullRateCheck } from '../../gates/readiness-gate.js';

import type { MigrationJob } from '../../types/migration-job.js';

const makeJob = (overrides?: Partial<MigrationJob>): MigrationJob => ({
  id: 'job-1',
  orgId: 'org-1',
  entityType: 'contacts',
  sourceConfig: { transport: 'csv', systemName: 'legacy', filePath: '/tmp/test.csv' },
  fieldMappings: [
    { sourceField: 'name', targetField: 'name' },
    { sourceField: 'email', targetField: 'email' },
  ],
  mergePolicies: [],
  conflictStrategy: 'merge',
  status: 'pending',
  checkpointCursor: null,
  ...overrides,
});

describe('OPS-03: Preflight Readiness Gate', () => {
  it('should pass with no checks registered', async () => {
    const gate = new ReadinessGate();
    const result = await gate.check(makeJob());
    expect(result.passed).toBe(true);
  });

  it('should pass when all checks pass', async () => {
    const gate = new ReadinessGate();
    gate.addCheck(new MappingCompletenessCheck());
    const result = await gate.check(makeJob());
    expect(result.passed).toBe(true);
  });

  it('should fail when mapping completeness check fails', async () => {
    const gate = new ReadinessGate();
    gate.addCheck(new MappingCompletenessCheck());
    const result = await gate.check(makeJob({ fieldMappings: [] }));
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('mapping-completeness');
  });

  it('should produce a structured readiness report', async () => {
    const gate = new ReadinessGate();
    gate.addCheck(new MappingCompletenessCheck());
    await gate.check(makeJob());
    const report = gate.getLastReport();
    expect(report).not.toBeNull();
    expect(report!.jobId).toBe('job-1');
    expect(report!.entityType).toBe('contacts');
    expect(report!.overallPassed).toBe(true);
    expect(report!.checks).toHaveLength(1);
    expect(report!.checks[0]!.name).toBe('mapping-completeness');
  });

  it('should warn on high null rate match keys', async () => {
    const gate = new ReadinessGate();
    gate.addCheck(new MatchKeyNullRateCheck({
      threshold: 0.3,
      sampleFn: async () => ({ email: 0.5, phone: 0.1 }),
    }));
    const result = await gate.check(makeJob());
    // Warning doesn't fail by default
    expect(result.passed).toBe(true);
    const report = gate.getLastReport();
    expect(report!.warningCount).toBe(1);
  });

  it('should fail on warnings when failOnWarnings is true', async () => {
    const gate = new ReadinessGate({ failOnWarnings: true });
    gate.addCheck(new MatchKeyNullRateCheck({
      threshold: 0.3,
      sampleFn: async () => ({ email: 0.5 }),
    }));
    const result = await gate.check(makeJob());
    expect(result.passed).toBe(false);
    expect(result.reason).toContain('match-key-null-rate');
  });
});
