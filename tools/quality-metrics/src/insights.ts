#!/usr/bin/env node
/**
 * Automated Insights Engine
 * 
 * Generates intelligent insights from all quality metrics:
 * - Cross-metric correlations
 * - Predictive warnings
 * - Actionable recommendations
 * - Priority scoring
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface QualityMetrics {
  timestamp: string;
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  build: {
    duration: number;
    cacheHitRate: number;
    bundleSize: number;
  };
  codeQuality: {
    typeErrors: number;
    lintWarnings: number;
    lintErrors: number;
    todoCount: number;
    filesCount: number;
    linesOfCode: number;
  };
  git: {
    commitCount: number;
    contributors: number;
    lastCommitDate: string;
    filesChanged: number;
  };
}

interface Insight {
  id: string;
  category: 'quality' | 'performance' | 'maintenance' | 'velocity';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  detectedAt: string;
}

interface InsightsReport {
  timestamp: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  healthScore: number;
  insights: Insight[];
  topPriorities: Insight[];
}

function loadMetricsHistory(): QualityMetrics[] {
  const workspaceRoot = join(process.cwd(), '..', '..');
  const historyPath = join(workspaceRoot, '.quality-metrics', 'history.jsonl');
  
  if (!existsSync(historyPath)) {
    console.error('❌ No metrics history found. Run `pnpm quality:collect` first.');
    process.exit(1);
  }

  const lines = readFileSync(historyPath, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  return lines.map(line => JSON.parse(line));
}

function generateInsights(history: QualityMetrics[]): Insight[] {
  const insights: Insight[] = [];
  const latest = history[history.length - 1];

  // 1. Coverage Insights
  if (latest.coverage.lines < 80) {
    insights.push({
      id: 'low-coverage',
      category: 'quality',
      priority: latest.coverage.lines < 60 ? 'critical' : 'high',
      title: `Test Coverage Below Target (${latest.coverage.lines.toFixed(1)}%)`,
      description: 'Line coverage is below the recommended 80% threshold.',
      impact: 'Untested code increases bug risk and reduces confidence in deployments.',
      recommendation: 'Focus on testing critical business logic, edge cases, and recent changes. Aim for 80%+ coverage.',
      detectedAt: latest.timestamp,
    });
  }

  if (latest.coverage.branches < 75) {
    insights.push({
      id: 'low-branch-coverage',
      category: 'quality',
      priority: 'medium',
      title: `Branch Coverage Below Target (${latest.coverage.branches.toFixed(1)}%)`,
      description: 'Branch coverage measures how well conditional logic is tested.',
      impact: 'Untested branches can hide bugs in error handling and edge cases.',
      recommendation: 'Test both success and failure paths. Add tests for error conditions and edge cases.',
      detectedAt: latest.timestamp,
    });
  }

  // 2. Code Quality Insights
  if (latest.codeQuality.typeErrors > 0) {
    insights.push({
      id: 'type-errors',
      category: 'quality',
      priority: 'critical',
      title: `${latest.codeQuality.typeErrors} TypeScript Error(s)`,
      description: 'TypeScript compilation errors prevent builds and indicate type safety issues.',
      impact: 'Blocks deployments and reduces code quality.',
      recommendation: 'Fix TypeScript errors immediately. Enable strict mode for better type safety.',
      detectedAt: latest.timestamp,
    });
  }

  if (latest.codeQuality.lintErrors > 0) {
    insights.push({
      id: 'lint-errors',
      category: 'quality',
      priority: 'high',
      title: `${latest.codeQuality.lintErrors} ESLint Error(s)`,
      description: 'ESLint errors indicate code quality or security issues.',
      impact: 'Can mask bugs and security vulnerabilities.',
      recommendation: 'Run `pnpm lint:fix` to auto-fix issues. Review and fix remaining errors manually.',
      detectedAt: latest.timestamp,
    });
  }

  if (latest.codeQuality.todoCount > 50) {
    insights.push({
      id: 'high-todo-count',
      category: 'maintenance',
      priority: latest.codeQuality.todoCount > 100 ? 'high' : 'medium',
      title: `${latest.codeQuality.todoCount} TODO/FIXME Comments`,
      description: 'High number of TODO comments indicates technical debt accumulation.',
      impact: 'Deferred work compounds over time, making the codebase harder to maintain.',
      recommendation: 'Create tickets for important TODOs. Remove or complete stale items. Keep count under 50.',
      detectedAt: latest.timestamp,
    });
  }

  // 3. Performance Insights
  if (latest.build.duration > 60000) {
    insights.push({
      id: 'slow-build',
      category: 'performance',
      priority: latest.build.duration > 180000 ? 'high' : 'medium',
      title: `Build Time Exceeds Target (${(latest.build.duration / 1000).toFixed(1)}s)`,
      description: 'Build time is longer than the recommended 60 second threshold.',
      impact: 'Slow builds reduce developer productivity and CI/CD efficiency.',
      recommendation: 'Optimize imports, enable SWC/esbuild, parallelize builds, improve caching strategies.',
      detectedAt: latest.timestamp,
    });
  }

  if (latest.build.cacheHitRate < 50 && latest.build.cacheHitRate > 0) {
    insights.push({
      id: 'low-cache-hit',
      category: 'performance',
      priority: 'medium',
      title: `Low Cache Hit Rate (${latest.build.cacheHitRate.toFixed(1)}%)`,
      description: 'Turborepo cache hit rate is below 50%, indicating frequent cache invalidation.',
      impact: 'Rebuilding unchanged packages wastes CI/CD time and resources.',
      recommendation: 'Review cache configuration, stabilize inputs/outputs, avoid non-deterministic builds.',
      detectedAt: latest.timestamp,
    });
  }

  // 4. Trend-based Insights
  if (history.length >= 5) {
    const recent = history.slice(-5);
    
    // Declining coverage trend
    const coverageTrend = recent.map(m => m.coverage.lines);
    const isDeclining = coverageTrend.every((val, i) => i === 0 || val <= coverageTrend[i - 1]);
    
    if (isDeclining && coverageTrend[0] - coverageTrend[coverageTrend.length - 1] > 5) {
      insights.push({
        id: 'coverage-declining',
        category: 'quality',
        priority: 'high',
        title: 'Test Coverage Declining',
        description: `Coverage dropped ${(coverageTrend[0] - coverageTrend[coverageTrend.length - 1]).toFixed(1)}% over last 5 runs.`,
        impact: 'Decreasing coverage indicates new code is not being tested adequately.',
        recommendation: 'Require tests for all new features. Enforce coverage on PRs. Review recent untested code.',
        detectedAt: latest.timestamp,
      });
    }

    // Growing codebase without tests
    const locTrend = recent.map(m => m.codeQuality.linesOfCode);
    const locGrowth = ((locTrend[locTrend.length - 1] - locTrend[0]) / locTrend[0]) * 100;
    const coverageChange = coverageTrend[coverageTrend.length - 1] - coverageTrend[0];
    
    if (locGrowth > 10 && coverageChange < 0) {
      insights.push({
        id: 'growth-without-tests',
        category: 'quality',
        priority: 'high',
        title: 'Codebase Growing Without Tests',
        description: `Code grew ${locGrowth.toFixed(1)}% but coverage decreased ${Math.abs(coverageChange).toFixed(1)}%.`,
        impact: 'Technical debt is accumulating. Future refactoring will be risky.',
        recommendation: 'Pause feature development to add tests for recent changes. Enforce test requirements.',
        detectedAt: latest.timestamp,
      });
    }
  }

  // 5. Velocity Insights
  if (history.length >= 2) {
    const current = latest.git.commitCount;
    const previous = history[history.length - 2].git.commitCount;
    const commitRate = current - previous;
    
    if (commitRate > 100) {
      insights.push({
        id: 'high-velocity',
        category: 'velocity',
        priority: 'low',
        title: 'High Development Velocity',
        description: `${commitRate} new commits since last check.`,
        impact: 'Rapid changes increase risk of bugs and instability.',
        recommendation: 'Ensure adequate testing and code review. Monitor for quality regressions.',
        detectedAt: latest.timestamp,
      });
    }

    if (commitRate < 5 && latest.git.commitCount > 50) {
      insights.push({
        id: 'low-velocity',
        category: 'velocity',
        priority: 'low',
        title: 'Development Activity Slowed',
        description: 'Very few commits detected recently.',
        impact: 'May indicate blocked work or reduced team capacity.',
        recommendation: 'Check for blockers, technical debt, or team capacity issues.',
        detectedAt: latest.timestamp,
      });
    }
  }

  return insights;
}

function calculateHealthScore(metrics: QualityMetrics): number {
  let score = 100;

  // Deduct points for issues
  score -= metrics.codeQuality.typeErrors * 5;
  score -= metrics.codeQuality.lintErrors * 3;
  score -= metrics.codeQuality.lintWarnings * 0.5;
  
  // Coverage penalty
  if (metrics.coverage.lines < 80) {
    score -= (80 - metrics.coverage.lines) * 0.5;
  }
  
  // Build performance penalty
  if (metrics.build.duration > 60000) {
    score -= ((metrics.build.duration - 60000) / 10000) * 2;
  }

  // TODO penalty
  if (metrics.codeQuality.todoCount > 50) {
    score -= (metrics.codeQuality.todoCount - 50) * 0.2;
  }

  return Math.max(0, Math.min(100, score));
}

function determineOverallHealth(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

async function main() {
  console.log('🔮 Generating automated insights...\n');

  const history = loadMetricsHistory();
  const latest = history[history.length - 1];
  
  const insights = generateInsights(history);
  const healthScore = calculateHealthScore(latest);
  const overallHealth = determineOverallHealth(healthScore);

  // Prioritize insights
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const topPriorities = insights.filter(i => i.priority === 'critical' || i.priority === 'high').slice(0, 5);

  const report: InsightsReport = {
    timestamp: new Date().toISOString(),
    overallHealth,
    healthScore,
    insights,
    topPriorities,
  };

  // Save report
  const workspaceRoot = join(process.cwd(), '..', '..');
  const reportPath = join(workspaceRoot, '.quality-metrics', 'insights-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print report
  console.log('🔮 Automated Insights Report');
  console.log('═════════════════════════════════════════════════════════');
  console.log(`Overall Health: ${getHealthEmoji(overallHealth)} ${overallHealth.toUpperCase()}`);
  console.log(`Health Score: ${healthScore.toFixed(1)}/100`);
  console.log(`Insights Detected: ${insights.length}`);
  console.log('');

  if (topPriorities.length > 0) {
    console.log('🎯 Top Priorities:');
    console.log('─────────────────────────────────────────────────────────');
    
    topPriorities.forEach((insight, index) => {
      const emoji = getPriorityEmoji(insight.priority);
      console.log(`\n${index + 1}. ${emoji} ${insight.title}`);
      console.log(`   ${insight.description}`);
      console.log(`   💡 ${insight.recommendation}`);
    });
    console.log('');
  }

  if (insights.length > topPriorities.length) {
    console.log(`📋 ${insights.length - topPriorities.length} additional insight(s) detected.`);
    console.log(`   View full report: ${reportPath}`);
    console.log('');
  }

  console.log('═════════════════════════════════════════════════════════\n');
  console.log(`✅ Full insights report saved to: ${reportPath}\n`);

  // Exit with warning if health is poor
  if (overallHealth === 'poor' || overallHealth === 'fair') {
    console.warn(`⚠️  Overall health is ${overallHealth}. Please address critical and high priority items.\n`);
    if (topPriorities.some(i => i.priority === 'critical')) {
      process.exit(1);
    }
  }
}

function getHealthEmoji(health: string): string {
  switch (health) {
    case 'excellent': return '🟢';
    case 'good': return '🟡';
    case 'fair': return '🟠';
    case 'poor': return '🔴';
    default: return '⚪';
  }
}

function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'critical': return '🔴';
    case 'high': return '🟡';
    case 'medium': return '🔵';
    case 'low': return '⚪';
    default: return '⚪';
  }
}

main();
