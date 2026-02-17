#!/usr/bin/env tsx
/**
 * Generate Rich PR Comment for Quality Metrics
 *
 * This script generates a comprehensive markdown comment for GitHub PRs
 * including visual trend charts, comparison tables, and actionable recommendations.
 *
 * @module generate-pr-comment
 * @since Sprint 6
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

// --- Types ---

interface QualitySnapshot {
  timestamp: string;
  gitBranch: string;
  gitSha: string;
  coverage: number;
  buildTime: number;
  typeErrors: number;
  lintErrors: number;
  testsPassed: number;
  testsTotal: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  performanceScore?: number;
}

interface ComparisonMetric {
  name: string;
  current: string | number;
  baseline: string | number;
  delta: string | number;
  status: '✅' | '⚠️' | '❌' | '➡️';
  trend?: 'up' | 'down' | 'stable';
}

interface Recommendation {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  action?: string;
}

interface PRCommentData {
  current: QualitySnapshot;
  baseline: QualitySnapshot;
  metrics: ComparisonMetric[];
  recommendations: Recommendation[];
  trends: {
    coverage: number[];
    buildTime: number[];
    errors: number[];
  };
}

// --- Helpers ---

function formatDelta(current: number, baseline: number, inverted = false): string {
  const delta = current - baseline;
  const sign = delta > 0 ? '+' : '';
  const formatted = `${sign}${delta.toFixed(2)}`;

  if (delta === 0) return `${formatted} ➡️`;
  if (inverted) {
    // Lower is better (e.g., errors, build time)
    return delta < 0 ? `${formatted} ✅` : `${formatted} ❌`;
  } else {
    // Higher is better (e.g., coverage, tests passed)
    return delta > 0 ? `${formatted} ✅` : `${formatted} ⚠️`;
  }
}

function getStatus(current: number, baseline: number, inverted = false): '✅' | '⚠️' | '❌' | '➡️' {
  const delta = current - baseline;

  if (delta === 0) return '➡️';

  if (inverted) {
    // Lower is better
    if (delta < -5) return '✅'; // Significant improvement
    if (delta < 0) return '✅'; // Minor improvement
    if (delta < 5) return '⚠️'; // Minor regression
    return '❌'; // Significant regression
  } else {
    // Higher is better
    if (delta > 5) return '✅'; // Significant improvement
    if (delta > 0) return '✅'; // Minor improvement
    if (delta > -5) return '⚠️'; // Minor regression
    return '❌'; // Significant regression
  }
}

function generateRecommendations(
  current: QualitySnapshot,
  baseline: QualitySnapshot,
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Coverage regression
  if (current.coverage < baseline.coverage - 2) {
    recommendations.push({
      severity: 'warning',
      message: `Test coverage decreased by ${(baseline.coverage - current.coverage).toFixed(2)}%`,
      action: 'Add tests for newly added or modified code',
    });
  }

  // Type errors increased
  if (current.typeErrors > baseline.typeErrors) {
    recommendations.push({
      severity: 'critical',
      message: `Type errors increased from ${baseline.typeErrors} to ${current.typeErrors}`,
      action: 'Fix type errors before merging',
    });
  }

  // Lint errors increased
  if (current.lintErrors > baseline.lintErrors) {
    recommendations.push({
      severity: 'warning',
      message: `Lint errors increased from ${baseline.lintErrors} to ${current.lintErrors}`,
      action: 'Run `pnpm lint:fix` to auto-fix issues',
    });
  }

  // Build time regression
  if (current.buildTime > baseline.buildTime * 1.2) {
    const increase = ((current.buildTime / baseline.buildTime - 1) * 100).toFixed(1);
    recommendations.push({
      severity: 'warning',
      message: `Build time increased by ${increase}% (${baseline.buildTime}s → ${current.buildTime}s)`,
      action: 'Profile build performance and optimize slow imports',
    });
  }

  // Security vulnerabilities
  const criticalVulns = current.vulnerabilities.critical;
  const highVulns = current.vulnerabilities.high;

  if (criticalVulns > 0) {
    recommendations.push({
      severity: 'critical',
      message: `Found ${criticalVulns} critical vulnerabilities`,
      action: 'Run `pnpm quality:security` and upgrade affected packages',
    });
  } else if (highVulns > 0) {
    recommendations.push({
      severity: 'warning',
      message: `Found ${highVulns} high-severity vulnerabilities`,
      action: 'Review security report and plan upgrades',
    });
  }

  // Test failures
  if (current.testsPassed < current.testsTotal) {
    const failed = current.testsTotal - current.testsPassed;
    recommendations.push({
      severity: 'critical',
      message: `${failed} test(s) failing`,
      action: 'Fix failing tests before merging',
    });
  }

  // All green!
  if (recommendations.length === 0) {
    recommendations.push({
      severity: 'info',
      message: 'All quality metrics look good! 🎉',
    });
  }

  return recommendations;
}

function generateMermaidTrendChart(trends: PRCommentData['trends']): string {
  // Generate a simple sparkline-style chart using Mermaid
  const coverageTrend = trends.coverage.slice(-7); // Last 7 data points
  const buildTimeTrend = trends.buildTime.slice(-7);

  return `
\`\`\`mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#0366d6'}}}%%
graph LR
    subgraph "Coverage Trend (Last 7 Days)"
    ${coverageTrend.map((val, idx) => `C${idx}[${val.toFixed(1)}%]`).join(' --> ')}
    end
\`\`\`

\`\`\`mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#0366d6'}}}%%
graph LR
    subgraph "Build Time Trend (Last 7 Days)"
    ${buildTimeTrend.map((val, idx) => `B${idx}[${val.toFixed(1)}s]`).join(' --> ')}
    end
\`\`\`
  `.trim();
}

function generateComparisonTable(metrics: ComparisonMetric[]): string {
  const header = '| Metric | Current | Baseline | Change | Status |';
  const separator = '|--------|---------|----------|--------|--------|';

  const rows = metrics.map((m) => {
    return `| ${m.name} | ${m.current} | ${m.baseline} | ${m.delta} | ${m.status} |`;
  });

  return [header, separator, ...rows].join('\n');
}

function generateRecommendationsSection(recommendations: Recommendation[]): string {
  if (recommendations.length === 0) {
    return '_No recommendations at this time._';
  }

  const critical = recommendations.filter((r) => r.severity === 'critical');
  const warnings = recommendations.filter((r) => r.severity === 'warning');
  const info = recommendations.filter((r) => r.severity === 'info');

  let output = '';

  if (critical.length > 0) {
    output += '#### 🚨 Critical\n\n';
    critical.forEach((r) => {
      output += `- **${r.message}**\n`;
      if (r.action) output += `  - _Action: ${r.action}_\n`;
    });
    output += '\n';
  }

  if (warnings.length > 0) {
    output += '#### ⚠️ Warnings\n\n';
    warnings.forEach((r) => {
      output += `- ${r.message}\n`;
      if (r.action) output += `  - _Action: ${r.action}_\n`;
    });
    output += '\n';
  }

  if (info.length > 0) {
    output += '#### ℹ️ Info\n\n';
    info.forEach((r) => {
      output += `- ${r.message}\n`;
    });
    output += '\n';
  }

  return output.trim();
}

function generateBadges(current: QualitySnapshot): string {
  const coverageColor =
    current.coverage >= 90
      ? 'brightgreen'
      : current.coverage >= 80
        ? 'green'
        : current.coverage >= 70
          ? 'yellow'
          : current.coverage >= 60
            ? 'orange'
            : 'red';

  const buildTimeColor =
    current.buildTime < 30
      ? 'brightgreen'
      : current.buildTime < 60
        ? 'green'
        : current.buildTime < 120
          ? 'yellow'
          : 'orange';

  const vulnColor =
    current.vulnerabilities.critical > 0
      ? 'critical'
      : current.vulnerabilities.high > 0
        ? 'orange'
        : current.vulnerabilities.medium > 0
          ? 'yellow'
          : 'brightgreen';

  const testPassRate = ((current.testsPassed / current.testsTotal) * 100).toFixed(0);
  const testColor =
    testPassRate === '100' ? 'brightgreen' : current.testsPassed > 0 ? 'yellow' : 'red';

  return `
![Coverage](https://img.shields.io/badge/coverage-${current.coverage.toFixed(1)}%25-${coverageColor})
![Build Time](https://img.shields.io/badge/build-${current.buildTime.toFixed(1)}s-${buildTimeColor})
![Tests](https://img.shields.io/badge/tests-${current.testsPassed}%2F${current.testsTotal}-${testColor})
![Security](https://img.shields.io/badge/vulnerabilities-${current.vulnerabilities.critical + current.vulnerabilities.high}-${vulnColor})
  `.trim();
}

function generatePRComment(data: PRCommentData): string {
  const { current, baseline, metrics, recommendations, trends } = data;

  return `
## 📊 Quality Metrics Report

### Summary

${generateComparisonTable(metrics)}

### Badges

${generateBadges(current)}

### Trends

${generateMermaidTrendChart(trends)}

### Recommendations

${generateRecommendationsSection(recommendations)}

---

<details>
<summary>📈 Detailed Metrics</summary>

**Current Snapshot** (${current.gitSha.substring(0, 7)}):
- Coverage: ${current.coverage.toFixed(2)}%
- Build Time: ${current.buildTime.toFixed(2)}s
- Type Errors: ${current.typeErrors}
- Lint Errors: ${current.lintErrors}
- Tests: ${current.testsPassed}/${current.testsTotal} passed
- Vulnerabilities:
  - Critical: ${current.vulnerabilities.critical}
  - High: ${current.vulnerabilities.high}
  - Medium: ${current.vulnerabilities.medium}
  - Low: ${current.vulnerabilities.low}

**Baseline Snapshot** (${baseline.gitSha.substring(0, 7)}):
- Coverage: ${baseline.coverage.toFixed(2)}%
- Build Time: ${baseline.buildTime.toFixed(2)}s
- Type Errors: ${baseline.typeErrors}
- Lint Errors: ${baseline.lintErrors}
- Tests: ${baseline.testsPassed}/${baseline.testsTotal} passed

</details>

---

<sub>Generated by [AFENDA Quality Metrics](https://github.com/AFENDA-NEXUS/tools) v2.1 | [View Dashboard](/quality) | [Advanced Analytics](/tools/analytics)</sub>
  `.trim();
}

// --- Main ---

async function main() {
  const { values } = parseArgs({
    options: {
      sha: { type: 'string', short: 's' },
      base: { type: 'string', short: 'b' },
      output: { type: 'string', short: 'o', default: 'pr-comment.md' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(`
Usage: generate-pr-comment.ts [options]

Options:
  -s, --sha <sha>       Current PR head SHA
  -b, --base <sha>      Base branch SHA for comparison
  -o, --output <file>   Output file (default: pr-comment.md)
  -h, --help            Show this help message

Example:
  tsx tools/scripts/generate-pr-comment.ts \\
    --sha=abc123 \\
    --base=main \\
    --output=pr-comment.md
    `);
    process.exit(0);
  }

  const currentSha = values.sha;
  const baseSha = values.base;
  const outputFile = values.output!;

  console.log('🔍 Fetching quality metrics...');
  console.log(`  Current SHA: ${currentSha || 'HEAD'}`);
  console.log(`  Base SHA: ${baseSha || 'main'}`);

  // TODO: Fetch actual metrics from database
  // For now, use mock data for demonstration

  const current: QualitySnapshot = {
    timestamp: new Date().toISOString(),
    gitBranch: 'feature/sprint-6',
    gitSha: currentSha || 'abc1234567890',
    coverage: 87.5,
    buildTime: 42.3,
    typeErrors: 0,
    lintErrors: 2,
    testsPassed: 234,
    testsTotal: 234,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3,
    },
    performanceScore: 92,
  };

  const baseline: QualitySnapshot = {
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    gitBranch: 'main',
    gitSha: baseSha || 'def0987654321',
    coverage: 85.2,
    buildTime: 45.1,
    typeErrors: 1,
    lintErrors: 5,
    testsPassed: 230,
    testsTotal: 230,
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 4,
    },
  };

  const metrics: ComparisonMetric[] = [
    {
      name: 'Coverage',
      current: `${current.coverage.toFixed(1)}%`,
      baseline: `${baseline.coverage.toFixed(1)}%`,
      delta: `${(current.coverage - baseline.coverage).toFixed(1)}%`,
      status: getStatus(current.coverage, baseline.coverage, false),
    },
    {
      name: 'Build Time',
      current: `${current.buildTime.toFixed(1)}s`,
      baseline: `${baseline.buildTime.toFixed(1)}s`,
      delta: `${(current.buildTime - baseline.buildTime).toFixed(1)}s`,
      status: getStatus(current.buildTime, baseline.buildTime, true),
    },
    {
      name: 'Type Errors',
      current: current.typeErrors,
      baseline: baseline.typeErrors,
      delta: current.typeErrors - baseline.typeErrors,
      status: getStatus(current.typeErrors, baseline.typeErrors, true),
    },
    {
      name: 'Lint Errors',
      current: current.lintErrors,
      baseline: baseline.lintErrors,
      delta: current.lintErrors - baseline.lintErrors,
      status: getStatus(current.lintErrors, baseline.lintErrors, true),
    },
    {
      name: 'Tests Passed',
      current: `${current.testsPassed}/${current.testsTotal}`,
      baseline: `${baseline.testsPassed}/${baseline.testsTotal}`,
      delta: current.testsPassed - baseline.testsPassed,
      status: getStatus(current.testsPassed, baseline.testsPassed, false),
    },
  ];

  const recommendations = generateRecommendations(current, baseline);

  const trends = {
    coverage: [83.1, 84.2, 85.2, 85.8, 86.3, 86.9, 87.5],
    buildTime: [48.2, 47.1, 45.1, 44.8, 43.5, 42.9, 42.3],
    errors: [12, 10, 6, 5, 4, 3, 2],
  };

  const commentData: PRCommentData = {
    current,
    baseline,
    metrics,
    recommendations,
    trends,
  };

  const comment = generatePRComment(commentData);

  console.log('\n✅ Generated PR comment:');
  console.log('─'.repeat(80));
  console.log(comment);
  console.log('─'.repeat(80));

  // Write to output file
  await Bun.write(outputFile, comment);
  console.log(`\n📝 Written to: ${outputFile}`);

  // Summary
  const totalRecommendations = recommendations.length;
  const criticalCount = recommendations.filter((r) => r.severity === 'critical').length;

  if (criticalCount > 0) {
    console.log(`\n⚠️  ${criticalCount} critical issue(s) found!`);
    process.exit(1);
  } else {
    console.log(`\n✅ Quality check passed (${totalRecommendations} recommendation(s))`);
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('❌ Error generating PR comment:', error);
  process.exit(1);
});
