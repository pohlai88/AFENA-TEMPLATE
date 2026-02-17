#!/usr/bin/env node
/**
 * Quality Metrics Collector
 *
 * Collects code quality metrics from various sources:
 * - Test coverage from Vitest
 * - Build times from Turborepo
 * - Bundle sizes from Next.js
 * - TypeScript error counts
 * - ESLint warning counts
 * - Git commit metrics
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';
import simpleGit from 'simple-git';

const git = simpleGit();

interface QualityMetrics {
  timestamp: string;
  coverage: CoverageMetrics;
  build: BuildMetrics;
  codeQuality: CodeQualityMetrics;
  git: GitMetrics;
}

interface CoverageMetrics {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
}

interface BuildMetrics {
  duration: number; // milliseconds
  cacheHitRate: number; // percentage
  bundleSize: number; // bytes
}

interface CodeQualityMetrics {
  typeErrors: number;
  lintWarnings: number;
  lintErrors: number;
  todoCount: number;
  filesCount: number;
  linesOfCode: number;
}

interface GitMetrics {
  commitCount: number;
  contributors: number;
  lastCommitDate: string;
  filesChanged: number;
}

async function collectCoverageMetrics(): Promise<CoverageMetrics> {
  console.log('📊 Collecting coverage metrics...');

  const workspaceRoot = join(process.cwd(), '..', '..');
  const coveragePath = join(workspaceRoot, 'coverage', 'coverage-summary.json');

  if (!existsSync(coveragePath)) {
    console.warn('⚠️  Coverage file not found. Run `pnpm test:coverage` first.');
    return {
      lines: 0,
      functions: 0,
      branches: 0,
      statements: 0,
    };
  }

  const coverage = JSON.parse(readFileSync(coveragePath, 'utf-8'));
  const total = coverage.total;

  return {
    lines: total.lines.pct,
    functions: total.functions.pct,
    branches: total.branches.pct,
    statements: total.statements.pct,
  };
}

async function collectBuildMetrics(): Promise<BuildMetrics> {
  console.log('🏗️  Collecting build metrics...');

  const start = Date.now();

  try {
    execSync('pnpm build --filter=afenda-logger', {
      stdio: 'pipe',
      encoding: 'utf-8',
    });
  } catch (error) {
    console.warn('⚠️  Build failed, using default metrics');
  }

  const duration = Date.now() - start;

  // Check for Turborepo cache stats
  let cacheHitRate = 0;
  try {
    const turboSummary = execSync('turbo run build --dry-run=json --filter=afenda-logger', {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    const summary = JSON.parse(turboSummary);
    const cached = summary.tasks?.filter((t: any) => t.cache?.status === 'HIT').length || 0;
    const total = summary.tasks?.length || 1;
    cacheHitRate = (cached / total) * 100;
  } catch {
    cacheHitRate = 0;
  }

  // Get Next.js bundle size
  let bundleSize = 0;
  const workspaceRoot = join(process.cwd(), '..', '..');
  const buildManifestPath = join(workspaceRoot, 'apps', 'web', '.next', 'build-manifest.json');
  if (existsSync(buildManifestPath)) {
    const manifest = JSON.parse(readFileSync(buildManifestPath, 'utf-8'));
    bundleSize = JSON.stringify(manifest).length; // Simplified metric
  }

  return {
    duration,
    cacheHitRate,
    bundleSize,
  };
}

async function collectCodeQualityMetrics(): Promise<CodeQualityMetrics> {
  console.log('🔍 Collecting code quality metrics...');

  // Count TypeScript errors
  let typeErrors = 0;
  try {
    execSync('pnpm type-check', { stdio: 'pipe' });
  } catch (error: any) {
    const output = error.stdout?.toString() || '';
    const match = output.match(/Found (\d+) error/);
    typeErrors = match ? parseInt(match[1], 10) : 0;
  }

  // Count ESLint warnings and errors
  let lintWarnings = 0;
  let lintErrors = 0;
  try {
    const lintOutput = execSync('pnpm lint', {
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    const warningMatch = lintOutput.match(/(\d+) warning/);
    const errorMatch = lintOutput.match(/(\d+) error/);
    lintWarnings = warningMatch ? parseInt(warningMatch[1], 10) : 0;
    lintErrors = errorMatch ? parseInt(errorMatch[1], 10) : 0;
  } catch (error: any) {
    const output = error.stdout?.toString() || '';
    const warningMatch = output.match(/(\d+) warning/);
    const errorMatch = output.match(/(\d+) error/);
    lintWarnings = warningMatch ? parseInt(warningMatch[1], 10) : 0;
    lintErrors = errorMatch ? parseInt(errorMatch[1], 10) : 0;
  }

  // Count TODO/FIXME comments
  const sourceFiles = await glob('**/*.{ts,tsx,js,jsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/coverage/**'],
  });

  let todoCount = 0;
  let linesOfCode = 0;

  for (const file of sourceFiles) {
    try {
      const content = readFileSync(file, 'utf-8');
      const todos = content.match(/\/\/\s*(TODO|FIXME|XXX|HACK)/gi);
      todoCount += todos ? todos.length : 0;
      linesOfCode += content.split('\n').length;
    } catch {
      // Skip files that can't be read
    }
  }

  return {
    typeErrors,
    lintWarnings,
    lintErrors,
    todoCount,
    filesCount: sourceFiles.length,
    linesOfCode,
  };
}

async function collectGitMetrics(): Promise<GitMetrics> {
  console.log('📝 Collecting git metrics...');

  const log = await git.log({ maxCount: 1000 });
  const summary = await git.diffSummary(['HEAD~10', 'HEAD']);

  const contributors = new Set(log.all.map((commit) => commit.author_email)).size;

  return {
    commitCount: log.total,
    contributors,
    lastCommitDate: log.latest?.date || new Date().toISOString(),
    filesChanged: summary.files.length,
  };
}

async function collectMetrics(): Promise<QualityMetrics> {
  console.log('🚀 Starting quality metrics collection...\n');

  const [coverage, build, codeQuality, gitMetrics] = await Promise.all([
    collectCoverageMetrics(),
    collectBuildMetrics(),
    collectCodeQualityMetrics(),
    collectGitMetrics(),
  ]);

  return {
    timestamp: new Date().toISOString(),
    coverage,
    build,
    codeQuality,
    git: gitMetrics,
  };
}

async function saveToDatabase(
  metrics: QualityMetrics,
  gitInfo: { sha: string; branch: string; author: string; message: string },
) {
  try {
    // Dynamically import database modules only when needed
    const { db, qualitySnapshots } = await import('afenda-database');
    const { createId } = await import('@paralleldrive/cuid2');

    // Use a standard org_id for local dev, or set via env var
    const orgId = process.env.ORG_ID || 'org_2Z4z1Z2Z1Z2Z1Z2Z1Z2Z';

    await db.insert(qualitySnapshots).values({
      orgId,
      id: createId(),
      gitSha: gitInfo.sha,
      gitBranch: gitInfo.branch,
      gitAuthor: gitInfo.author,
      gitMessage: gitInfo.message,
      coverageLines: metrics.coverage.lines.toString(),
      coverageFunctions: metrics.coverage.functions.toString(),
      coverageStatements: metrics.coverage.statements.toString(),
      coverageBranches: metrics.coverage.branches.toString(),
      typeErrors: metrics.codeQuality.typeErrors,
      lintErrors: metrics.codeQuality.lintErrors,
      lintWarnings: metrics.codeQuality.lintWarnings,
      buildTimeMs: metrics.build.duration,
      bundleSizeBytes: metrics.build.bundleSize,
      filesCount: metrics.codeQuality.filesCount,
      linesOfCode: metrics.codeQuality.linesOfCode,
      todoCount: metrics.codeQuality.todoCount,
      testsPassing: metrics.coverage.tests || 0,
      testsFailing: 0,
      testsSkipped: 0,
      metadata: metrics as unknown as Record<string, unknown>,
    });

    console.log('✅ Metrics saved to database');
  } catch (error) {
    console.warn('⚠️  Failed to save to database, continuing with file storage:', error);
  }
}

async function saveMetrics(metrics: QualityMetrics) {
  // Save to workspace root, not tool directory
  const workspaceRoot = join(process.cwd(), '..', '..');
  const metricsDir = join(workspaceRoot, '.quality-metrics');

  if (!existsSync(metricsDir)) {
    mkdirSync(metricsDir, { recursive: true });
  }

  // Save latest metrics
  const latestPath = join(metricsDir, 'latest.json');
  writeFileSync(latestPath, JSON.stringify(metrics, null, 2));

  // Append to history
  const historyPath = join(metricsDir, 'history.jsonl');
  const historyLine = JSON.stringify(metrics) + '\n';

  if (existsSync(historyPath)) {
    const existingHistory = readFileSync(historyPath, 'utf-8');
    writeFileSync(historyPath, existingHistory + historyLine);
  } else {
    writeFileSync(historyPath, historyLine);
  }

  console.log('\n✅ Metrics saved to:', metricsDir);

  // Also save to database if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    const gitInfo = await git.log({ maxCount: 1 });
    const latest = gitInfo.latest;
    if (latest) {
      await saveToDatabase(metrics, {
        sha: latest.hash,
        branch: await git.branch().then((b) => b.current),
        author: latest.author_name,
        message: latest.message,
      });
    }
  }
}

async function main() {
  try {
    const metrics = await collectMetrics();
    await saveMetrics(metrics);

    console.log('\n📊 Quality Metrics Summary:');
    console.log('─────────────────────────────────────');
    console.log(`Coverage:     ${metrics.coverage.lines.toFixed(1)}% lines`);
    console.log(`Build Time:   ${(metrics.build.duration / 1000).toFixed(1)}s`);
    console.log(`Type Errors:  ${metrics.codeQuality.typeErrors}`);
    console.log(
      `Lint Issues:  ${metrics.codeQuality.lintErrors} errors, ${metrics.codeQuality.lintWarnings} warnings`,
    );
    console.log(`TODOs:        ${metrics.codeQuality.todoCount}`);
    console.log(`Files:        ${metrics.codeQuality.filesCount}`);
    console.log(`Lines of Code: ${metrics.codeQuality.linesOfCode.toLocaleString()}`);
    console.log(`Commits:      ${metrics.git.commitCount}`);
    console.log(`Contributors: ${metrics.git.contributors}`);
    console.log('─────────────────────────────────────');
  } catch (error) {
    console.error('❌ Failed to collect metrics:', error);
    process.exit(1);
  }
}

main();
