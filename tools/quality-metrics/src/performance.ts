#!/usr/bin/env node
/**
 * Performance Regression Detector
 * 
 * Analyzes performance metrics over time to detect regressions:
 * - Build time increases
 * - Bundle size growth
 * - Test execution slowdowns
 * - Memory usage spikes
 * 
 * Supports both database and JSONL storage:
 * - DATABASE_URL set: Query from quality_snapshots table
 * - No DATABASE_URL: Fallback to history.jsonl
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Database imports (optional)
let db: any = null;
let qualitySnapshots: any = null;
let desc: any = null;
let eq: any = null;

try {
  const dbModule = await import('afenda-database');
  db = dbModule.db;
  qualitySnapshots = dbModule.qualitySnapshots;
  const drizzle = await import('drizzle-orm');
  desc = drizzle.desc;
  eq = drizzle.eq;
} catch (error) {
  // Database not available, will use JSONL fallback
  console.log('ℹ️  Database not available, using JSONL history');
}

interface PerformanceMetrics {
  timestamp: string;
  buildDuration: number;
  bundleSize: number;
  testDuration: number;
  memoryUsage: number;
}

interface Regression {
  metric: string;
  current: number;
  baseline: number;
  change: number;
  changePercent: number;
  severity: 'critical' | 'warning' | 'info';
  recommendation: string;
}

interface PerformanceReport {
  timestamp: string;
  regressions: Regression[];
  improvements: Regression[];
  summary: string;
}

/**
 * Load performance history from database (preferred) or JSONL (fallback)
 */
async function loadPerformanceHistory(branch = 'main', limit = 30): Promise<PerformanceMetrics[]> {
  // Try database first
  if (db && qualitySnapshots && desc && eq && process.env.DATABASE_URL) {
    try {
      console.log(`📊 Loading performance history from database (${branch}, last ${limit} snapshots)...`);
      
      const snapshots = await db
        .select()
        .from(qualitySnapshots)
        .where(eq(qualitySnapshots.gitBranch, branch))
        .orderBy(desc(qualitySnapshots.createdAt))
        .limit(limit);

      if (snapshots.length === 0) {
        console.warn('⚠️  No snapshots found in database for branch:', branch);
        return [];
      }

      console.log(`✅ Loaded ${snapshots.length} snapshots from database`);

      return snapshots.map((snapshot: any) => ({
        timestamp: snapshot.createdAt.toISOString(),
        buildDuration: snapshot.buildTimeMs || 0,
        bundleSize: snapshot.bundleSize || 0,
        testDuration: 0, // TODO: Extract from test results
        memoryUsage: 0,   // TODO: Extract from system metrics
      }));
    } catch (error) {
      console.warn('⚠️  Database query failed, falling back to JSONL:', (error as Error).message);
      // Fall through to JSONL fallback
    }
  }

  // Fallback to JSONL
  console.log('📂 Loading performance history from JSONL...');
  const workspaceRoot = join(process.cwd(), '..', '..');
  const historyPath = join(workspaceRoot, '.quality-metrics', 'history.jsonl');
  
  if (!existsSync(historyPath)) {
    console.error('❌ No performance history found. Run `pnpm quality:collect` first.');
    process.exit(1);
  }

  const lines = readFileSync(historyPath, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  console.log(`✅ Loaded ${lines.length} snapshots from JSONL`);

  return lines.slice(-limit).map(line => {
    const data = JSON.parse(line);
    return {
      timestamp: data.timestamp,
      buildDuration: data.build.duration,
      bundleSize: data.build.bundleSize,
      testDuration: 0, // TODO: Extract from test results
      memoryUsage: 0,   // TODO: Extract from system metrics
    };
  });
}

function calculateBaseline(history: PerformanceMetrics[], metricKey: keyof PerformanceMetrics): number {
  if (history.length === 0) return 0;
  
  // Use median of last 10 runs as baseline (more stable than average)
  const recent = history.slice(-10);
  const values = recent.map(m => {
    const value = m[metricKey];
    return typeof value === 'number' ? value : 0;
  }).filter(v => v > 0);
  
  if (values.length === 0) return 0;
  
  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  
  return values.length % 2 === 0
    ? (values[mid - 1] + values[mid]) / 2
    : values[mid];
}

function detectRegressions(history: PerformanceMetrics[]): Regression[] {
  if (history.length < 5) {
    console.warn('⚠️  Need at least 5 data points to detect regressions.');
    return [];
  }

  const latest = history[history.length - 1];
  const regressions: Regression[] = [];

  // Build duration regression
  const buildBaseline = calculateBaseline(history.slice(0, -1), 'buildDuration');
  if (buildBaseline > 0 && latest.buildDuration > buildBaseline) {
    const change = latest.buildDuration - buildBaseline;
    const changePercent = (change / buildBaseline) * 100;
    
    if (changePercent > 5) { // Threshold: 5% slower
      regressions.push({
        metric: 'Build Duration',
        current: latest.buildDuration,
        baseline: buildBaseline,
        change,
        changePercent,
        severity: changePercent > 50 ? 'critical' : changePercent > 20 ? 'warning' : 'info',
        recommendation: changePercent > 50
          ? 'Critical slowdown detected. Check for new dependencies or build configuration changes.'
          : 'Build time increased. Review recent changes and consider optimizing imports.',
      });
    }
  }

  // Bundle size regression
  const bundleBaseline = calculateBaseline(history.slice(0, -1), 'bundleSize');
  if (bundleBaseline > 0 && latest.bundleSize > bundleBaseline) {
    const change = latest.bundleSize - bundleBaseline;
    const changePercent = (change / bundleBaseline) * 100;
    
    if (changePercent > 5) { // Threshold: 5% larger
      regressions.push({
        metric: 'Bundle Size',
        current: latest.bundleSize,
        baseline: bundleBaseline,
        change,
        changePercent,
        severity: changePercent > 25 ? 'critical' : changePercent > 10 ? 'warning' : 'info',
        recommendation: changePercent > 25
          ? 'Critical bundle size increase. Audit new dependencies and use bundle analyzer.'
          : 'Bundle size increased. Consider code splitting or tree shaking optimizations.',
      });
    }
  }

  return regressions;
}

function detectImprovements(history: PerformanceMetrics[]): Regression[] {
  if (history.length < 5) return [];

  const latest = history[history.length - 1];
  const improvements: Regression[] = [];

  // Build duration improvement
  const buildBaseline = calculateBaseline(history.slice(0, -1), 'buildDuration');
  if (buildBaseline > 0 && latest.buildDuration < buildBaseline) {
    const change = buildBaseline - latest.buildDuration;
    const changePercent = (change / buildBaseline) * 100;
    
    if (changePercent > 10) { // Threshold: 10% faster
      improvements.push({
        metric: 'Build Duration',
        current: latest.buildDuration,
        baseline: buildBaseline,
        change: -change,
        changePercent: -changePercent,
        severity: 'info',
        recommendation: '🎉 Build time improved! Consider documenting what optimization was made.',
      });
    }
  }

  // Bundle size improvement
  const bundleBaseline = calculateBaseline(history.slice(0, -1), 'bundleSize');
  if (bundleBaseline > 0 && latest.bundleSize < bundleBaseline) {
    const change = bundleBaseline - latest.bundleSize;
    const changePercent = (change / bundleBaseline) * 100;
    
    if (changePercent > 10) { // Threshold: 10% smaller
      improvements.push({
        metric: 'Bundle Size',
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const branch = args.find(arg => arg.startsWith('--branch='))?.split('=')[1] || 'main';
  const threshold = parseFloat(args.find(arg => arg.startsWith('--threshold='))?.split('=')[1] || '1.2');
  const limit = parseInt(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '30', 10);

  console.log(`Configuration:`);
  console.log(`  Branch: ${branch}`);
  console.log(`  Threshold: ${(threshold - 1) * 100}% slower`);
  console.log(`  History limit: ${limit} snapshots\n`);

  const history = await loadPerformanceHistory(branch, limit
        baseline: bundleBaseline,
        change: -change,
        changePercent: -changePercent,
        severity: 'info',
        recommendation: '🎉 Bundle size reduced! Great work on optimization.',
      });
    }
  }

  return improvements;
}

function generateSummary(regressions: Regression[], improvements: Regression[]): string {
  if (regressions.length === 0 && improvements.length === 0) {
    return '✅ No significant performance changes detected.';
  }

  const criticalCount = regressions.filter(r => r.severity === 'critical').length;
  const warningCount = regressions.filter(r => r.severity === 'warning').length;

  if (criticalCount > 0) {
    return `🔴 Critical performance regression detected! ${criticalCount} critical issue(s) require immediate attention.`;
  }

  if (warningCount > 0) {
    return `🟡 Performance regressions detected. ${warningCount} warning(s) should be reviewed.`;
  }

  if (improvements.length > 0) {
    return `🟢 Performance improvements detected! ${improvements.length} metric(s) improved.`;
  }

  return '📊 Minor performance changes detected.';
}

async function main() {
  console.log('⚡ Analyzing performance regressions...\n');

  const history = loadPerformanceHistory();
  
  if (history.length < 5) {
    console.log('📊 Insufficient data for regression detection.');
    console.log(`   Current: ${history.length} data points`);
    console.log('   Required: 5 data points\n');
    console.log('Run `pnpm quality:collect` more times to build history.\n');
    return;
  }

  const regressions = detectRegressions(history);
  const improvements = detectImprovements(history);
  const summary = generateSummary(regressions, improvements);

  const report: PerformanceReport = {
    timestamp: new Date().toISOString(),
    regressions,
    improvements,
    summary,
  };

  // Save report
  const workspaceRoot = join(process.cwd(), '..', '..');
  const reportPath = join(workspaceRoot, '.quality-metrics', 'performance-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print report
  console.log('⚡ Performance Regression Report');
  console.log('═════════════════════════════════════════════════════════');
  console.log(summary);
  console.log('');

  if (regressions.length > 0) {
    console.log('📉 Regressions Detected:');
    console.log('─────────────────────────────────────────────────────────');
    
    regressions.forEach((reg, index) => {
      const emoji = reg.severity === 'critical' ? '🔴' : reg.severity === 'warning' ? '🟡' : '🔵';
      console.log(`\n${index + 1}. ${emoji} ${reg.metric}`);
      console.log(`   Current: ${formatMetric(reg.metric, reg.current)}`);
      console.log(`   Baseline: ${formatMetric(reg.metric, reg.baseline)}`);
      console.log(`   Change: +${formatMetric(reg.metric, reg.change)} (+${reg.changePercent.toFixed(1)}%)`);
      console.log(`   ${reg.recommendation}`);
    });
    console.log('');
  }

  if (improvements.length > 0) {
    console.log('📈 Improvements Detected:');
    console.log('─────────────────────────────────────────────────────────');
    
    improvements.forEach((imp, index) => {
      console.log(`\n${index + 1}. ${imp.metric}`);
      console.log(`   Current: ${formatMetric(imp.metric, imp.current)}`);
      console.log(`   Baseline: ${formatMetric(imp.metric, imp.baseline)}`);
      console.log(`   Improvement: ${formatMetric(imp.metric, Math.abs(imp.change))} (${Math.abs(imp.changePercent).toFixed(1)}% faster)`);
      console.log(`   ${imp.recommendation}`);
    });
    console.log('');
  }

  console.log('═════════════════════════════════════════════════════════\n');
  console.log(`✅ Full report saved to: ${reportPath}\n`);

  // Exit with error if critical regression detected
  const hasCritical = regressions.some(r => r.severity === 'critical');
  if (hasCritical) {
    console.error('❌ Critical performance regression detected. Please fix before merging.\n');
    process.exit(1);
  }
}

function formatMetric(metric: string, value: number): string {
  switch (metric) {
    case 'Build Duration':
      return `${(value / 1000).toFixed(1)}s`;
    case 'Bundle Size':
      return `${(value / 1024).toFixed(1)} KB`;
    case 'Test Duration':
      return `${(value / 1000).toFixed(1)}s`;
    case 'Memory Usage':
      return `${(value / 1024 / 1024).toFixed(1)} MB`;
    default:
      return value.toFixed(2);
  }
}

main();
