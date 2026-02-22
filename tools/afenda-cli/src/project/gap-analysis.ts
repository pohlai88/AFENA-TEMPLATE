/**
 * Gap analysis — derive actionable gaps and recommendations from validation results
 * and codebase state. Avoids false positives by only flagging unresolved issues.
 */

import { safeExists, safeReadFile } from '../core/fs-safe';
import fg from 'fast-glob';

import type { ProjectAnalysis } from './analyzer';
import type { ValidationResult } from './validator';

export interface Gap {
  id: string;
  area: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  action?: string;
}

export interface GapAnalysis {
  gaps: Gap[];
  recommendations: string[];
  /** Summary for executive/verdict */
  hasCriticalGaps: boolean;
  validationState: 'full' | 'partial' | 'none';
}

/** Paths to scan for stale "advisory" references when package is removed */
const ADVISORY_SCAN_PATTERNS = [
  'packages/*/README.md',
  'packages/*/src/**/README.md',
  '.agent/context/capability-map.md',
  'business-domain/architecture.domain.md',
];

/** Substrings that indicate a real advisory-package reference (not advisory lock, etc.) */
const ADVISORY_REF_PATTERNS = ['workflow, advisory', 'advisory,', ', advisory', 'advisory)'];

function hasAdvisoryReference(content: string): boolean {
  const lower = content.toLowerCase();
  return ADVISORY_REF_PATTERNS.some(
    (p) => lower.includes(p.toLowerCase()) || lower.includes('layer 2') && lower.includes('advisory')
  );
}

/**
 * Scan key docs for stale advisory references when advisory package doesn't exist.
 */
function countAdvisoryReferences(repoRoot: string): number {
  if (safeExists(repoRoot, 'packages', 'advisory')) return 0;
  let count = 0;
  try {
    for (const pattern of ADVISORY_SCAN_PATTERNS) {
      const files = fg.sync(pattern, { cwd: repoRoot, absolute: false });
      for (const f of files) {
        try {
          const content = safeReadFile(repoRoot, ...f.split(/[/\\]/));
          if (hasAdvisoryReference(content)) count++;
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
 * Read capability ledger orphaned count. Returns 0 if ledger missing or unreadable.
 */
function getOrphanedCount(repoRoot: string): number {
  if (!safeExists(repoRoot, '.afenda', 'capability.ledger.json')) return 0;
  try {
    const raw = JSON.parse(safeReadFile(repoRoot, '.afenda', 'capability.ledger.json')) as {
      summary?: { orphaned?: number };
      entries?: { status: string }[];
    };
    return raw?.summary?.orphaned ?? raw?.entries?.filter((e) => e.status === 'orphaned').length ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Derive gap analysis from project analysis and validation results.
 * Only adds gaps for issues that are actually unresolved (no false positives).
 */
export function deriveGapAnalysis(
  analysis: ProjectAnalysis,
  validations: ValidationResult[]
): GapAnalysis {
  const gaps: Gap[] = [];
  const recommendations: string[] = [];

  const metaResult = validations.find((v) => v.command === 'meta:check');
  const catalogResult = validations.find((v) => v.command === 'validate:catalog');
  const readmeResult = validations.find((v) => v.command === 'readme:check');
  const depsResult = validations.find((v) => v.command === 'validate:deps');

  const metaPassed = metaResult?.status === 'pass';
  const catalogPassed = catalogResult?.status === 'pass';
  const readmePassed = readmeResult?.status === 'pass';
  const depsPassed = depsResult?.status === 'pass' || depsResult?.status === 'warn';

  const orphanedCount = getOrphanedCount(analysis.repoRoot);
  const advisoryRefCount = countAdvisoryReferences(analysis.repoRoot);
  const advisoryPackageExists = safeExists(analysis.repoRoot, 'packages', 'advisory');

  const validationState = validations.length > 0 ? (validations.length >= 4 ? 'full' : 'partial') : 'none';

  // Only add gaps for unresolved issues; use validation results when available

  if (validations.length > 0) {
    if (!catalogPassed && catalogResult) {
      gaps.push({
        id: 'catalog',
        area: 'Dependencies',
        priority: 'medium',
        description: 'Catalog protocol non-compliant',
        action: 'Run `pnpm validate:catalog` — ensure all deps use `catalog:` in pnpm-workspace.yaml',
      });
      recommendations.push('Fix catalog protocol compliance');
    }

    if (!metaPassed && metaResult) {
      const isVis00 = metaResult.notes?.includes('VIS-00') ?? false;
      gaps.push({
        id: 'meta',
        area: 'Capability governance',
        priority: 'high',
        description: isVis00 ? 'VIS-00 violations: write boundaries without CAPABILITIES' : 'meta:check failed',
        action: 'Run `pnpm afenda meta check` and fix or add exceptions',
      });
      recommendations.push('Fix capability (VIS-00) violations or add documented exceptions');
    } else if (metaPassed && orphanedCount > 0) {
      // Meta passes but ledger has orphaned — low priority, likely accepted
      gaps.push({
        id: 'orphaned',
        area: 'Capability coverage',
        priority: 'low',
        description: `${orphanedCount} orphaned capability(ies) in ledger (meta check passed)`,
        action: 'Review via `afenda meta fix` or add exception if intentional',
      });
    } else if (!metaPassed && orphanedCount > 0) {
      gaps.push({
        id: 'orphaned',
        area: 'Capability coverage',
        priority: 'high',
        description: `${orphanedCount} orphaned capability(ies) — meta check failing`,
        action: 'Address via `afenda meta fix` or add exception',
      });
      recommendations.push('Address orphaned capabilities');
    }

    if (!readmePassed && readmeResult) {
      gaps.push({
        id: 'readme',
        area: 'Documentation',
        priority: 'medium',
        description: readmeResult.notes?.includes('Install section') ? 'README install sections need workspace policy' : 'readme:check failed',
        action: 'Run `pnpm readme:check` and fix',
      });
      recommendations.push('Fix README install sections');
    }

    if (!depsPassed && depsResult) {
      gaps.push({
        id: 'deps',
        area: 'Dependencies',
        priority: 'high',
        description: 'Circular or invalid dependencies detected',
        action: 'Run `pnpm validate:deps`',
      });
      recommendations.push('Fix circular dependencies');
    }
  }

  // Advisory refs — only when package removed and refs exist (static check, always available)
  if (!advisoryPackageExists && advisoryRefCount > 0) {
    gaps.push({
      id: 'advisory-refs',
      area: 'Documentation',
      priority: 'low',
      description: `Stale advisory references in ${advisoryRefCount} doc(s)`,
      action: 'Update architecture docs and capability-map to remove advisory package references',
    });
    recommendations.push('Clean advisory references from docs');
  }

  // No gaps? Add positive note
  if (gaps.length === 0 && validationState !== 'none') {
    recommendations.push('All validations passed — maintain current standards');
  } else if (gaps.length === 0) {
    recommendations.push('Run `pnpm afenda project gen` without `--skip-validate` for full gap analysis');
  }

  const hasCriticalGaps = gaps.some((g) => g.priority === 'high');

  return {
    gaps,
    recommendations: [...new Set(recommendations)],
    hasCriticalGaps,
    validationState,
  };
}
