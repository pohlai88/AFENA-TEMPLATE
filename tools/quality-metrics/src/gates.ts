/**
 * Quality Gates
 *
 * Checks quality metrics against configurable thresholds to enforce
 * quality standards in CI/CD pipelines.
 */

import { db } from 'afenda-database';
import { qualitySnapshots } from 'afenda-database';
import { desc, eq } from 'drizzle-orm';

export interface QualityGateConfig {
  minCoverageLines: number;
  minCoverageFunctions: number;
  minCoverageStatements: number;
  minCoverageBranches: number;
  maxCoverageDropPct: number;
  maxTypeErrors: number;
  maxLintErrors: number;
  maxLintWarnings: number;
  maxBuildTimeIncreasePct: number;
}

export const DEFAULT_CONFIG: QualityGateConfig = {
  minCoverageLines: 80,
  minCoverageFunctions: 80,
  minCoverageStatements: 80,
  minCoverageBranches: 75,
  maxCoverageDropPct: 2,
  maxTypeErrors: 0,
  maxLintErrors: 0,
  maxLintWarnings: 10,
  maxBuildTimeIncreasePct: 20,
};

export interface QualityGateResult {
  passed: boolean;
  violations: QualityViolation[];
  warnings: QualityWarning[];
  summary: QualitySummary;
}

export interface QualityViolation {
  rule: string;
  message: string;
  severity: 'error';
  current: number | string;
  threshold: number | string;
  baseline?: number | string;
}

export interface QualityWarning {
  rule: string;
  message: string;
  severity: 'warning';
  current: number | string;
  threshold: number | string;
}

export interface QualitySummary {
  currentSha: string;
  currentBranch: string;
  baselineBranch?: string | undefined;
  coverage: {
    lines: number;
    functions: number;
    statements: number;
    branches: number;
  };
  quality: {
    typeErrors: number;
    lintErrors: number;
    lintWarnings: number;
  };
  build: {
    timeMs: number;
  };
  baseline?:
    | {
        coverage: {
          lines: number;
          functions: number;
          statements: number;
          branches: number;
        };
        build: {
          timeMs: number;
        };
      }
    | undefined;
}

export async function checkQualityGates(
  currentSha: string,
  baseBranch = 'main',
  config: QualityGateConfig = DEFAULT_CONFIG,
): Promise<QualityGateResult> {
  const violations: QualityViolation[] = [];
  const warnings: QualityWarning[] = [];

  // Get current snapshot
  const [current] = await db
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitSha, currentSha))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(1);

  if (!current) {
    throw new Error(`No metrics found for SHA: ${currentSha}`);
  }

  // Get baseline (latest from base branch)
  const [baseline] = await db
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitBranch, baseBranch))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(1);

  const coverageLines = Number(current.coverageLines) || 0;
  const coverageFunctions = Number(current.coverageFunctions) || 0;
  const coverageStatements = Number(current.coverageStatements) || 0;
  const coverageBranches = Number(current.coverageBranches) || 0;

  // Check absolute thresholds
  if (coverageLines < config.minCoverageLines) {
    violations.push({
      rule: 'min-coverage-lines',
      message: `Line coverage is below minimum threshold`,
      severity: 'error',
      current: `${coverageLines.toFixed(2)}%`,
      threshold: `${config.minCoverageLines}%`,
    });
  }

  if (coverageFunctions < config.minCoverageFunctions) {
    violations.push({
      rule: 'min-coverage-functions',
      message: `Function coverage is below minimum threshold`,
      severity: 'error',
      current: `${coverageFunctions.toFixed(2)}%`,
      threshold: `${config.minCoverageFunctions}%`,
    });
  }

  if (coverageStatements < config.minCoverageStatements) {
    violations.push({
      rule: 'min-coverage-statements',
      message: `Statement coverage is below minimum threshold`,
      severity: 'error',
      current: `${coverageStatements.toFixed(2)}%`,
      threshold: `${config.minCoverageStatements}%`,
    });
  }

  if (coverageBranches < config.minCoverageBranches) {
    violations.push({
      rule: 'min-coverage-branches',
      message: `Branch coverage is below minimum threshold`,
      severity: 'error',
      current: `${coverageBranches.toFixed(2)}%`,
      threshold: `${config.minCoverageBranches}%`,
    });
  }

  if ((current.typeErrors || 0) > config.maxTypeErrors) {
    violations.push({
      rule: 'max-type-errors',
      message: `Type errors exceed maximum allowed`,
      severity: 'error',
      current: current.typeErrors || 0,
      threshold: config.maxTypeErrors,
    });
  }

  if ((current.lintErrors || 0) > config.maxLintErrors) {
    violations.push({
      rule: 'max-lint-errors',
      message: `Lint errors exceed maximum allowed`,
      severity: 'error',
      current: current.lintErrors || 0,
      threshold: config.maxLintErrors,
    });
  }

  if ((current.lintWarnings || 0) > config.maxLintWarnings) {
    warnings.push({
      rule: 'max-lint-warnings',
      message: `Lint warnings exceed recommended threshold`,
      severity: 'warning',
      current: current.lintWarnings || 0,
      threshold: config.maxLintWarnings,
    });
  }

  // Check regression vs baseline
  const baselineCoverageLinesData = baseline
    ? {
        lines: Number(baseline.coverageLines) || 0,
        functions: Number(baseline.coverageFunctions) || 0,
        statements: Number(baseline.coverageStatements) || 0,
        branches: Number(baseline.coverageBranches) || 0,
      }
    : undefined;

  if (baseline && baselineCoverageLinesData) {
    const coverageDrop = baselineCoverageLinesData.lines - coverageLines;

    if (coverageDrop > config.maxCoverageDropPct) {
      violations.push({
        rule: 'max-coverage-drop',
        message: `Coverage dropped significantly from baseline`,
        severity: 'error',
        current: `${coverageLines.toFixed(2)}%`,
        threshold: `max ${config.maxCoverageDropPct}% drop`,
        baseline: `${baselineCoverageLinesData.lines.toFixed(2)}%`,
      });
    }

    // Check build time increase
    if (current.buildTimeMs && baseline.buildTimeMs) {
      const buildTimeIncrease =
        ((current.buildTimeMs - baseline.buildTimeMs) / baseline.buildTimeMs) * 100;

      if (buildTimeIncrease > config.maxBuildTimeIncreasePct) {
        warnings.push({
          rule: 'max-build-time-increase',
          message: `Build time increased significantly from baseline`,
          severity: 'warning',
          current: `${(current.buildTimeMs / 1000).toFixed(1)}s`,
          threshold: `max ${config.maxBuildTimeIncreasePct}% increase`,
        });
      }
    }
  }

  const summary: QualitySummary = {
    currentSha: current.gitSha,
    currentBranch: current.gitBranch,
    baselineBranch: baseline ? baseline.gitBranch : undefined,
    coverage: {
      lines: coverageLines,
      functions: coverageFunctions,
      statements: coverageStatements,
      branches: coverageBranches,
    },
    quality: {
      typeErrors: current.typeErrors || 0,
      lintErrors: current.lintErrors || 0,
      lintWarnings: current.lintWarnings || 0,
    },
    build: {
      timeMs: current.buildTimeMs || 0,
    },
    baseline: baselineCoverageLinesData
      ? {
          coverage: baselineCoverageLinesData,
          build: {
            timeMs: baseline?.buildTimeMs || 0,
          },
        }
      : undefined,
  };

  return {
    passed: violations.length === 0,
    violations,
    warnings,
    summary,
  };
}

export function formatGateResult(result: QualityGateResult): string {
  const lines: string[] = [];

  if (result.passed) {
    lines.push('✅ All quality gates passed!');
  } else {
    lines.push('❌ Quality gates failed');
  }

  lines.push('');
  lines.push('📊 Current Metrics:');
  lines.push(
    `   Coverage: ${result.summary.coverage.lines.toFixed(1)}% lines, ${result.summary.coverage.functions.toFixed(1)}% functions`,
  );
  lines.push(
    `   Quality: ${result.summary.quality.typeErrors} type errors, ${result.summary.quality.lintErrors} lint errors, ${result.summary.quality.lintWarnings} lint warnings`,
  );
  lines.push(`   Build: ${(result.summary.build.timeMs / 1000).toFixed(1)}s`);

  if (result.summary.baseline) {
    lines.push('');
    lines.push('📈 Baseline Comparison:');
    const coverageChange = result.summary.coverage.lines - result.summary.baseline.coverage.lines;
    const coverageEmoji = coverageChange >= 0 ? '📈' : '📉';
    lines.push(
      `   ${coverageEmoji} Coverage: ${coverageChange >= 0 ? '+' : ''}${coverageChange.toFixed(2)}%`,
    );

    if (result.summary.build.timeMs && result.summary.baseline.build.timeMs) {
      const buildChange =
        ((result.summary.build.timeMs - result.summary.baseline.build.timeMs) /
          result.summary.baseline.build.timeMs) *
        100;
      const buildEmoji = buildChange <= 0 ? '⚡' : '🐌';
      lines.push(
        `   ${buildEmoji} Build time: ${buildChange >= 0 ? '+' : ''}${buildChange.toFixed(1)}%`,
      );
    }
  }

  if (result.violations.length > 0) {
    lines.push('');
    lines.push('❌ Violations:');
    result.violations.forEach((v) => {
      lines.push(`   • ${v.message}`);
      lines.push(
        `     Current: ${v.current}, Threshold: ${v.threshold}${v.baseline ? `, Baseline: ${v.baseline}` : ''}`,
      );
    });
  }

  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️  Warnings:');
    result.warnings.forEach((w) => {
      lines.push(`   • ${w.message}`);
      lines.push(`     Current: ${w.current}, Threshold: ${w.threshold}`);
    });
  }

  return lines.join('\n');
}
