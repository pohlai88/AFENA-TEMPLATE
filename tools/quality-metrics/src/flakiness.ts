#!/usr/bin/env node
/**
 * Test Flakiness Detector
 * 
 * Analyzes test execution history to detect flaky tests:
 * - Tests that sometimes pass, sometimes fail
 * - Tests with inconsistent execution times
 * - Tests that fail intermittently
 * 
 * Flaky tests are a major source of CI/CD unreliability.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

interface TestResult {
  name: string;
  file: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
}

interface TestHistory {
  testName: string;
  executions: TestResult[];
  totalRuns: number;
  passCount: number;
  failCount: number;
  skipCount: number;
  avgDuration: number;
  durationStdDev: number;
  flakiness: number; // 0-100, higher = more flaky
}

interface FlakinessReport {
  timestamp: string;
  totalTests: number;
  flakyTests: TestHistory[];
  recommendations: string[];
}

function loadTestHistory(): TestResult[] {
  const historyPath = join(process.cwd(), '..', '..', '.quality-metrics', 'test-history.jsonl');
  
  if (!existsSync(historyPath)) {
    console.warn('⚠️  No test history found. Run tests multiple times to detect flakiness.');
    return [];
  }

  const lines = readFileSync(historyPath, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  return lines.flatMap(line => {
    try {
      return JSON.parse(line);
    } catch {
      return [];
    }
  });
}

function groupByTest(results: TestResult[]): Map<string, TestResult[]> {
  const grouped = new Map<string, TestResult[]>();

  for (const result of results) {
    const key = `${result.file}::${result.name}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(result);
  }

  return grouped;
}

function calculateStdDev(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - avg, 2), 0) / numbers.length;
  
  return Math.sqrt(variance);
}

function analyzeTestFlakiness(testName: string, executions: TestResult[]): TestHistory {
  const totalRuns = executions.length;
  const passCount = executions.filter(e => e.status === 'passed').length;
  const failCount = executions.filter(e => e.status === 'failed').length;
  const skipCount = executions.filter(e => e.status === 'skipped').length;

  const durations = executions.map(e => e.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const durationStdDev = calculateStdDev(durations);

  // Calculate flakiness score (0-100)
  let flakiness = 0;

  // 1. Intermittent failures (50% weight)
  if (passCount > 0 && failCount > 0) {
    const failureRate = failCount / totalRuns;
    // Most flaky if 20-80% failure rate
    const intermittencyScore = 1 - Math.abs(0.5 - failureRate) * 2;
    flakiness += intermittencyScore * 50;
  }

  // 2. Duration variability (30% weight)
  if (avgDuration > 0) {
    const coefficientOfVariation = durationStdDev / avgDuration;
    // High COV indicates timing instability
    const stabilityScore = Math.min(1, coefficientOfVariation);
    flakiness += stabilityScore * 30;
  }

  // 3. Recent failures (20% weight)
  const recentExecutions = executions.slice(-5); // Last 5 runs
  const recentFailures = recentExecutions.filter(e => e.status === 'failed').length;
  flakiness += (recentFailures / recentExecutions.length) * 20;

  return {
    testName,
    executions,
    totalRuns,
    passCount,
    failCount,
    skipCount,
    avgDuration,
    durationStdDev,
    flakiness: Math.round(flakiness),
  };
}

function generateRecommendations(flakyTests: TestHistory[]): string[] {
  const recommendations: string[] = [];

  // High flakiness tests
  const criticallyFlaky = flakyTests.filter(t => t.flakiness > 70);
  if (criticallyFlaky.length > 0) {
    recommendations.push(
      `🔴 ${criticallyFlaky.length} critically flaky test(s) detected (>70% flakiness). Quarantine immediately.`
    );
    criticallyFlaky.forEach(t => {
      recommendations.push(`   - ${t.testName} (${t.flakiness}% flaky, ${t.failCount}/${t.totalRuns} failures)`);
    });
  }

  // Moderately flaky tests
  const moderatelyFlaky = flakyTests.filter(t => t.flakiness >= 40 && t.flakiness <= 70);
  if (moderatelyFlaky.length > 0) {
    recommendations.push(
      `🟡 ${moderatelyFlaky.length} moderately flaky test(s) detected (40-70%). Investigate and fix.`
    );
  }

  // Timing instability
  const timingIssues = flakyTests.filter(t => {
    const cov = t.durationStdDev / t.avgDuration;
    return cov > 0.5; // High variance
  });
  if (timingIssues.length > 0) {
    recommendations.push(
      `⏱️  ${timingIssues.length} test(s) with unstable timing. May indicate external dependencies or race conditions.`
    );
  }

  // General advice
  if (flakyTests.length === 0) {
    recommendations.push('✅ No flaky tests detected. Excellent test stability!');
  } else {
    recommendations.push(
      '\n💡 Flakiness fixes:',
      '  • Add retry logic for external API calls',
      '  • Use proper async/await patterns',
      '  • Avoid hardcoded timeouts (use waitFor/waitUntil)',
      '  • Mock external dependencies',
      '  • Add test isolation (beforeEach cleanup)',
      '  • Use deterministic test data'
    );
  }

  return recommendations;
}

function saveTestResult(results: TestResult[]) {
  const workspaceRoot = join(process.cwd(), '..', '..');
  const historyPath = join(workspaceRoot, '.quality-metrics', 'test-history.jsonl');
  
  const historyLine = JSON.stringify(results) + '\n';
  
  if (existsSync(historyPath)) {
    const existingHistory = readFileSync(historyPath, 'utf-8');
    writeFileSync(historyPath, existingHistory + historyLine);
  } else {
    writeFileSync(historyPath, historyLine);
  }
}

function extractTestResults(): TestResult[] {
  // Try to parse Vitest JSON output
  try {
    const output = execSync('pnpm test --reporter=json', {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    const results = JSON.parse(output);
    const timestamp = new Date().toISOString();

    return results.testResults?.flatMap((file: any) => 
      file.assertionResults?.map((test: any) => ({
        name: test.title,
        file: file.name,
        status: test.status,
        duration: test.duration || 0,
        timestamp,
      })) || []
    ) || [];
  } catch (error) {
    console.warn('⚠️  Could not extract test results. Ensure tests are running.');
    return [];
  }
}

async function main() {
  console.log('🔍 Analyzing test flakiness...\n');

  const history = loadTestHistory();
  
  if (history.length === 0) {
    console.log('📊 No test history available yet.');
    console.log('Run tests multiple times to build history for flakiness detection.\n');
    
    // Record current test run
    console.log('Recording current test run...');
    const currentResults = extractTestResults();
    if (currentResults.length > 0) {
      saveTestResult(currentResults);
      console.log(`✅ Recorded ${currentResults.length} test results.\n`);
    }
    
    return;
  }

  const grouped = groupByTest(history);
  const analyses: TestHistory[] = [];

  for (const [testName, executions] of grouped.entries()) {
    if (executions.length >= 3) { // Need at least 3 runs to detect flakiness
      const analysis = analyzeTestFlakiness(testName, executions);
      if (analysis.flakiness > 0) {
        analyses.push(analysis);
      }
    }
  }

  // Sort by flakiness (highest first)
  const flakyTests = analyses
    .filter(t => t.flakiness >= 30) // Only report if >30% flaky
    .sort((a, b) => b.flakiness - a.flakiness);

  const recommendations = generateRecommendations(flakyTests);

  const report: FlakinessReport = {
    timestamp: new Date().toISOString(),
    totalTests: grouped.size,
    flakyTests,
    recommendations,
  };

  // Save report
  const workspaceRoot = join(process.cwd(), '..', '..');
  const reportPath = join(workspaceRoot, '.quality-metrics', 'flakiness-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print report
  console.log('📊 Flakiness Report');
  console.log('═════════════════════════════════════════════════════════');
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Flaky Tests: ${flakyTests.length}`);
  console.log('');

  if (flakyTests.length > 0) {
    console.log('🔥 Flaky Tests (sorted by severity):');
    console.log('─────────────────────────────────────────────────────────');
    
    flakyTests.forEach((test, index) => {
      const emoji = test.flakiness > 70 ? '🔴' : test.flakiness > 50 ? '🟡' : '🟢';
      console.log(`\n${index + 1}. ${emoji} ${test.testName}`);
      console.log(`   Flakiness: ${test.flakiness}%`);
      console.log(`   Runs: ${test.totalRuns} (${test.passCount} pass, ${test.failCount} fail)`);
      console.log(`   Avg Duration: ${test.avgDuration.toFixed(0)}ms ± ${test.durationStdDev.toFixed(0)}ms`);
    });
  }

  console.log('\n─────────────────────────────────────────────────────────');
  console.log('💡 Recommendations:');
  recommendations.forEach(rec => console.log(rec));
  console.log('═════════════════════════════════════════════════════════\n');

  console.log(`✅ Full report saved to: ${reportPath}\n`);

  // Exit with error if critical flakiness detected
  const criticalFlakiness = flakyTests.some(t => t.flakiness > 70);
  if (criticalFlakiness) {
    console.error('❌ Critical test flakiness detected. Please fix before merging.\n');
    process.exit(1);
  }
}

main();
