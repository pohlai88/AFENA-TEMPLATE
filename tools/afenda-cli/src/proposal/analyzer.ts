/**
 * Proposal analyzer — collect data for PROPOSAL.md generation.
 * Derives recommendations from project analysis, validations, and codebase state.
 * No false positives: only flags unresolved issues.
 */

import { safeExists, safeReadFile } from '../core/fs-safe';
import fg from 'fast-glob';
import { analyzeProject } from '../project/analyzer';

import type { ProjectAnalysis } from '../project/analyzer';
import type { ValidationResult } from '../project/validator';

export interface ProposalAnalysis {
  repoRoot: string;
  generatedAt: string;
  projectAnalysis: ProjectAnalysis;
  validations: ValidationResult[];
  /** Validation failures to address */
  failingValidations: ValidationResult[];
  /** Whether capability ledger has orphaned entries */
  hasOrphanedCapabilities: boolean;
  /** Whether advisory package exists */
  advisoryPackageExists: boolean;
  /** Catalog validation passed (when validations run) */
  catalogCompliant: boolean | null;
  /** Meta check passed (when validations run) */
  metaCheckPassed: boolean | null;
  /** Count of docs with stale advisory refs (when package removed) */
  advisoryRefCount: number;
}

const ADVISORY_SCAN_PATTERNS = ['packages/*/README.md', '.agent/context/capability-map.md'];
const ADVISORY_REF_PATTERNS = ['workflow, advisory', 'advisory,', ', advisory'];

function countAdvisoryRefs(repoRoot: string): number {
  if (safeExists(repoRoot, 'packages', 'advisory')) return 0;
  let count = 0;
  try {
    for (const pattern of ADVISORY_SCAN_PATTERNS) {
      const files = fg.sync(pattern, { cwd: repoRoot, absolute: false });
      for (const f of files) {
        try {
          const content = safeReadFile(repoRoot, ...f.split(/[/\\]/));
          const lower = content.toLowerCase();
          if (ADVISORY_REF_PATTERNS.some((p) => lower.includes(p.toLowerCase()))) count++;
        } catch {
          /* skip file */
        }
      }
    }
  } catch {
    /* cwd invalid */
  }
  return count;
}

/**
 * Analyze repo for proposal generation. Requires project analysis and validations.
 */
export function analyzeProposal(
  repoRoot: string,
  validations: ValidationResult[]
): ProposalAnalysis {
  const projectAnalysis = analyzeProject(repoRoot);
  const generatedAt = new Date().toISOString().slice(0, 10);

  const failingValidations = validations.filter((v) => v.status === 'fail');

  let hasOrphanedCapabilities = false;
  if (safeExists(repoRoot, '.afenda', 'capability.ledger.json')) {
    try {
      const raw = JSON.parse(safeReadFile(repoRoot, '.afenda', 'capability.ledger.json')) as {
        summary?: { orphaned?: number };
        entries?: { status: string }[];
      };
      const orphaned = raw?.summary?.orphaned ?? raw?.entries?.filter((e) => e.status === 'orphaned').length ?? 0;
      hasOrphanedCapabilities = orphaned > 0;
    } catch {
      /* ignore */
    }
  }

  const advisoryPackageExists = safeExists(repoRoot, 'packages', 'advisory');
  const catalogResult = validations.find((v) => v.command === 'validate:catalog');
  const metaResult = validations.find((v) => v.command === 'meta:check');

  return {
    repoRoot,
    generatedAt,
    projectAnalysis,
    validations,
    failingValidations,
    hasOrphanedCapabilities,
    advisoryPackageExists,
    catalogCompliant: catalogResult ? catalogResult.status === 'pass' : null,
    metaCheckPassed: metaResult ? metaResult.status === 'pass' : null,
    advisoryRefCount: countAdvisoryRefs(repoRoot),
  };
}
