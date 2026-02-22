import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deriveGapAnalysis } from './gap-analysis';
import type { ProjectAnalysis } from './analyzer';
import type { ValidationResult } from './validator';

vi.mock('../core/fs-safe', () => ({
  safeExists: vi.fn(),
  safeReadFile: vi.fn(),
}));

import { safeExists } from '../core/fs-safe';

const mockSafeExists = vi.mocked(safeExists);

function mkAnalysis(overrides?: Partial<ProjectAnalysis>): ProjectAnalysis {
  return {
    repoRoot: '/tmp/repo',
    generatedAt: '2025-02-01',
    workspace: {
      packages: [],
      corePackages: ['packages/canon'],
      domainPackages: ['business-domain/finance/accounting'],
      tools: ['tools/cli'],
      apps: ['apps/web'],
    },
    manifest: null,
    docsExist: { architecture: true, governance: true, businessDomain: true },
    ...overrides,
  };
}

describe('deriveGapAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSafeExists.mockReturnValue(false);
  });

  it('returns no gaps when all validations pass', () => {
    const validations: ValidationResult[] = [
      { command: 'housekeeping', status: 'pass', notes: 'Ok', exitCode: 0 },
      { command: 'meta:check', status: 'pass', notes: 'Passed', exitCode: 0 },
      { command: 'validate:catalog', status: 'pass', notes: 'Compliant', exitCode: 0 },
      { command: 'readme:check', status: 'pass', notes: 'Ok', exitCode: 0 },
      { command: 'validate:deps', status: 'warn', notes: 'Ok', exitCode: 0 },
    ];
    const result = deriveGapAnalysis(mkAnalysis(), validations);
    expect(result.gaps.length).toBe(0);
    expect(result.hasCriticalGaps).toBe(false);
    expect(result.recommendations).toContain('All validations passed — maintain current standards');
  });

  it('adds catalog gap when validate:catalog fails', () => {
    const validations: ValidationResult[] = [
      { command: 'housekeeping', status: 'pass', notes: 'Ok', exitCode: 0 },
      { command: 'meta:check', status: 'pass', notes: 'Ok', exitCode: 0 },
      { command: 'validate:catalog', status: 'fail', notes: 'Not compliant', exitCode: 1 },
    ];
    const result = deriveGapAnalysis(mkAnalysis(), validations);
    const catalogGap = result.gaps.find((g) => g.id === 'catalog');
    expect(catalogGap).toBeDefined();
    expect(catalogGap!.priority).toBe('medium');
  });

  it('adds meta gap when meta:check fails', () => {
    const validations: ValidationResult[] = [
      { command: 'meta:check', status: 'fail', notes: 'VIS-00 violations', exitCode: 1 },
    ];
    const result = deriveGapAnalysis(mkAnalysis(), validations);
    const metaGap = result.gaps.find((g) => g.id === 'meta');
    expect(metaGap).toBeDefined();
    expect(metaGap!.priority).toBe('high');
    expect(result.hasCriticalGaps).toBe(true);
  });

  it('does not add catalog or VIS-00 gaps when validations pass (no false positives)', () => {
    const validations: ValidationResult[] = [
      { command: 'validate:catalog', status: 'pass', notes: 'Compliant', exitCode: 0 },
      { command: 'meta:check', status: 'pass', notes: 'Passed', exitCode: 0 },
    ];
    const result = deriveGapAnalysis(mkAnalysis(), validations);
    expect(result.gaps.find((g) => g.id === 'catalog')).toBeUndefined();
    expect(result.gaps.find((g) => g.id === 'meta')).toBeUndefined();
  });

  it('returns validationState none when no validations', () => {
    const result = deriveGapAnalysis(mkAnalysis(), []);
    expect(result.validationState).toBe('none');
    expect(result.recommendations.some((r) => r.includes('skip-validate'))).toBe(true);
  });
});
