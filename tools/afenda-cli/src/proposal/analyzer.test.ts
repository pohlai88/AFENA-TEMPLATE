import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeProposal } from './analyzer';

vi.mock('../core/fs-safe', () => ({
  safeExists: vi.fn(),
  safeReadFile: vi.fn(),
}));

vi.mock('../project/analyzer', () => ({
  analyzeProject: vi.fn(() => ({
    repoRoot: '/tmp/repo',
    generatedAt: '2025-02-01',
    workspace: {
      packages: ['packages/a'],
      corePackages: ['packages/canon'],
      domainPackages: ['business-domain/finance/accounting'],
      tools: ['tools/cli'],
      apps: ['apps/web'],
    },
    manifest: null,
    docsExist: { architecture: true, governance: true, businessDomain: true },
  })),
}));

import { safeExists, safeReadFile } from '../core/fs-safe';

const mockSafeExists = vi.mocked(safeExists);
const mockSafeReadFile = vi.mocked(safeReadFile);

describe('analyzeProposal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSafeExists.mockReturnValue(false);
  });

  it('returns analysis with projectAnalysis and validations', () => {
    const validations = [
      { command: 'housekeeping', status: 'pass' as const, notes: 'Ok', exitCode: 0 },
      { command: 'meta:check', status: 'fail' as const, notes: 'Orphaned', exitCode: 1 },
    ];
    const result = analyzeProposal('/tmp/repo', validations);

    expect(result.repoRoot).toBe('/tmp/repo');
    expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.projectAnalysis.workspace.corePackages).toContain('packages/canon');
    expect(result.validations).toHaveLength(2);
    expect(result.failingValidations).toHaveLength(1);
    expect(result.failingValidations[0]!.command).toBe('meta:check');
  });

  it('detects orphaned capabilities when ledger has orphaned count', () => {
    mockSafeExists.mockImplementation((...args: string[]) => {
      if (args.join('/').includes('capability.ledger.json')) return true;
      return false;
    });
    mockSafeReadFile.mockReturnValue(JSON.stringify({ summary: { orphaned: 3 } }));

    const result = analyzeProposal('/tmp/repo', []);
    expect(result.hasOrphanedCapabilities).toBe(true);
  });

  it('detects no orphaned capabilities when ledger has zero orphaned', () => {
    mockSafeExists.mockImplementation((...args: string[]) => {
      if (args.join('/').includes('capability.ledger.json')) return true;
      return false;
    });
    mockSafeReadFile.mockReturnValue(JSON.stringify({ summary: { orphaned: 0 } }));

    const result = analyzeProposal('/tmp/repo', []);
    expect(result.hasOrphanedCapabilities).toBe(false);
  });

  it('detects advisory package when packages/advisory exists', () => {
    mockSafeExists.mockImplementation((...args: string[]) => {
      const path = args.join('/');
      if (path.includes('packages/advisory')) return true;
      return false;
    });

    const result = analyzeProposal('/tmp/repo', []);
    expect(result.advisoryPackageExists).toBe(true);
  });

  it('detects no advisory package when packages/advisory absent', () => {
    mockSafeExists.mockReturnValue(false);
    const result = analyzeProposal('/tmp/repo', []);
    expect(result.advisoryPackageExists).toBe(false);
  });

  it('handles malformed capability ledger gracefully', () => {
    mockSafeExists.mockImplementation((...args: string[]) => {
      if (args.join('/').includes('capability.ledger.json')) return true;
      return false;
    });
    mockSafeReadFile.mockReturnValue('not json {');

    const result = analyzeProposal('/tmp/repo', []);
    expect(result.hasOrphanedCapabilities).toBe(false);
  });
});
