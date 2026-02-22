#!/usr/bin/env node
/**
 * Quality Metrics Analyzer
 * 
 * Analyzes historical quality metrics and generates insights:
 * - Trend analysis (improving/degrading)
 * - Anomaly detection
 * - Quality score calculation
 * - Actionable recommendations
 */

import { readFileSync, existsSync } from 'node:fs';
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

interface Trend {
  metric: string;
  direction: 'improving' | 'degrading' | 'stable';
  change: number;
  severity: 'critical' | 'warning' | 'info';
}

interface QualityScore {
  overall: number;
  coverage: number;
  performance: number;
  codeQuality: number;
  velocity: number;
}

function loadMetricsHistory(): QualityMetrics[] {
  const workspaceRoot = join(process.cwd(), '..', '..');
  const historyPath = join(workspaceRoot, '.quality-metrics', 'history.jsonl');
  
  if (!existsSync(historyPath)) {
    console.error('❌ No metrics history found. Run `pnpm collect` first.');
    process.exit(1);
  }

  const lines = readFileSync(historyPath, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  return lines.map(line => JSON.parse(line));
}

function analyzeTrends(history: QualityMetrics[]): Trend[] {
  if (history.length < 2) {
    return [];
  }

  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  const trends: Trend[] = [];

  // Coverage trend
  const coverageChange = latest.coverage.lines - previous.coverage.lines;
  if (Math.abs(coverageChange) > 1) {
    trends.push({
      metric: 'Test Coverage',
      direction: coverageChange > 0 ? 'improving' : 'degrading',
      change: coverageChange,
      severity: Math.abs(coverageChange) > 5 ? 'critical' : 'warning',
    });
  }

  // Build time trend
  const buildChange = latest.build.duration - previous.build.duration;
  const buildChangePercent = (buildChange / previous.build.duration) * 100;
  if (Math.abs(buildChangePercent) > 10) {
    trends.push({
      metric: 'Build Time',
      direction: buildChange < 0 ? 'improving' : 'degrading',
      change: buildChangePercent,
      severity: Math.abs(buildChangePercent) > 50 ? 'critical' : 'warning',
    });
  }

  // Type errors trend
  const typeErrorChange = latest.codeQuality.typeErrors - previous.codeQuality.typeErrors;
  if (typeErrorChange !== 0) {
    trends.push({
      metric: 'Type Errors',
      direction: typeErrorChange < 0 ? 'improving' : 'degrading',
      change: typeErrorChange,
      severity: Math.abs(typeErrorChange) > 10 ? 'critical' : 'warning',
    });
  }

  // Lint issues trend
  const lintChange = 
    (latest.codeQuality.lintErrors + latest.codeQuality.lintWarnings) -
    (previous.codeQuality.lintErrors + previous.codeQuality.lintWarnings);
  
  if (Math.abs(lintChange) > 5) {
    trends.push({
      metric: 'Lint Issues',
      direction: lintChange < 0 ? 'improving' : 'degrading',
      change: lintChange,
      severity: Math.abs(lintChange) > 20 ? 'critical' : 'warning',
    });
  }

  return trends;
}

function calculateQualityScore(metrics: QualityMetrics): QualityScore {
  // Coverage score (40% weight)
  const coverageScore = Math.min(100, (
    metrics.coverage.lines * 0.4 +
    metrics.coverage.functions * 0.3 +
    metrics.coverage.branches * 0.2 +
    metrics.coverage.statements * 0.1
  ));

  // Performance score (20% weight)
  // Lower build time = higher score
  const buildTimeScore = Math.max(0, 100 - (metrics.build.duration / 1000));
  const cacheScore = metrics.build.cacheHitRate;
  const performanceScore = (buildTimeScore * 0.6 + cacheScore * 0.4);

  // Code quality score (30% weight)
  const errorPenalty = metrics.codeQuality.typeErrors * 5;
  const lintPenalty = 
    metrics.codeQuality.lintErrors * 3 +
    metrics.codeQuality.lintWarnings * 1;
  const todoPenalty = metrics.codeQuality.todoCount * 0.5;
  
  const codeQualityScore = Math.max(0, 100 - errorPenalty - lintPenalty - todoPenalty);

  // Velocity score (10% weight)
  const avgCommitsPerDay = metrics.git.commitCount / 30; // Last 30 days estimate
  const velocityScore = Math.min(100, avgCommitsPerDay * 10);

  // Overall score
  const overall = 
    coverageScore * 0.4 +
    performanceScore * 0.2 +
    codeQualityScore * 0.3 +
    velocityScore * 0.1;

  return {
    overall,
    coverage: coverageScore,
    performance: performanceScore,
    codeQuality: codeQualityScore,
    velocity: velocityScore,
  };
}

function generateRecommendations(metrics: QualityMetrics, score: QualityScore): string[] {
  const recommendations: string[] = [];

  // Coverage recommendations
  if (metrics.coverage.lines < 80) {
    recommendations.push(`📊 Increase test coverage to 80%+ (currently ${metrics.coverage.lines.toFixed(1)}%)`);
  }
  if (metrics.coverage.branches < 75) {
    recommendations.push(`🌿 Improve branch coverage to 75%+ (currently ${metrics.coverage.branches.toFixed(1)}%)`);
  }

  // Code quality recommendations
  if (metrics.codeQuality.typeErrors > 0) {
    recommendations.push(`🔴 Fix ${metrics.codeQuality.typeErrors} TypeScript errors`);
  }
  if (metrics.codeQuality.lintErrors > 0) {
    recommendations.push(`⚠️  Fix ${metrics.codeQuality.lintErrors} ESLint errors`);
  }
  if (metrics.codeQuality.lintWarnings > 20) {
    recommendations.push(`⚡ Address ${metrics.codeQuality.lintWarnings} ESLint warnings`);
  }
  if (metrics.codeQuality.todoCount > 50) {
    recommendations.push(`📝 Reduce TODO/FIXME count (${metrics.codeQuality.todoCount} found)`);
  }

  // Performance recommendations
  if (metrics.build.duration > 60000) {
    recommendations.push(`⚡ Optimize build time (currently ${(metrics.build.duration / 1000).toFixed(1)}s)`);
  }
  if (metrics.build.cacheHitRate < 50) {
    recommendations.push(`💾 Improve Turborepo cache hit rate (currently ${metrics.build.cacheHitRate.toFixed(1)}%)`);
  }

  // Overall quality
  if (score.overall < 70) {
    recommendations.push(`🎯 Overall quality score is below target (${score.overall.toFixed(1)}/100)`);
  }

  return recommendations;
}

function printAnalysis(history: QualityMetrics[]) {
  const latest = history[history.length - 1];
  const score = calculateQualityScore(latest);
  const trends = analyzeTrends(history);
  const recommendations = generateRecommendations(latest, score);

  console.log('\n📊 Quality Metrics Analysis');
  console.log('═════════════════════════════════════════════════════════');
  
  console.log('\n🎯 Quality Scores:');
  console.log(`  Overall:      ${score.overall.toFixed(1)}/100 ${getScoreEmoji(score.overall)}`);
  console.log(`  Coverage:     ${score.coverage.toFixed(1)}/100 ${getScoreEmoji(score.coverage)}`);
  console.log(`  Performance:  ${score.performance.toFixed(1)}/100 ${getScoreEmoji(score.performance)}`);
  console.log(`  Code Quality: ${score.codeQuality.toFixed(1)}/100 ${getScoreEmoji(score.codeQuality)}`);
  console.log(`  Velocity:     ${score.velocity.toFixed(1)}/100 ${getScoreEmoji(score.velocity)}`);

  if (trends.length > 0) {
    console.log('\n📈 Trends (vs previous run):');
    trends.forEach(trend => {
      const arrow = trend.direction === 'improving' ? '↗️' : '↘️';
      const emoji = getSeverityEmoji(trend.severity);
      console.log(`  ${emoji} ${arrow} ${trend.metric}: ${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}`);
    });
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });
  } else {
    console.log('\n✅ No immediate recommendations - keep up the great work!');
  }

  console.log('\n─────────────────────────────────────────────────────────');
  console.log(`📅 Last updated: ${new Date(latest.timestamp).toLocaleString()}`);
  console.log(`📊 History: ${history.length} data points`);
  console.log('═════════════════════════════════════════════════════════\n');
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return '🟢';
  if (score >= 70) return '🟡';
  return '🔴';
}

function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case 'critical': return '🔴';
    case 'warning': return '🟡';
    default: return '🔵';
  }
}

async function main() {
  try {
    const history = loadMetricsHistory();
    printAnalysis(history);
  } catch (error) {
    console.error('❌ Failed to analyze metrics:', error);
    process.exit(1);
  }
}

main();
