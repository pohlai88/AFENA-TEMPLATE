# 📊 Quality Metrics Tool - Enterprise Edition

<div align="center">

![Metrics](https://img.shields.io/badge/metrics-real--time-success?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square)
![Vitest](https://img.shields.io/badge/coverage-Vitest-green?style=flat-square)
![Dashboard](https://img.shields.io/badge/dashboard-Next.js-black?style=flat-square)

**Real-time code quality metrics collection, analysis, and visualization for
AFENDA-NEXUS monorepo**

[Features](#-features) • [Quick Start](#-quick-start) • [Commands](#-commands) •
[CI/CD](#-cicd-integration) • [Dashboard](#-dashboard) •
[Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Commands](#-commands)
- [Architecture](#-architecture)
- [Metrics Structure](#-metrics-structure)
- [Quality Scoring](#-quality-score-calculation)
- [Dashboard](#-dashboard)
- [API Endpoints](#-api-endpoints)
- [CI/CD Integration](#-cicd-integration)
- [Enterprise Patterns](#-enterprise-patterns)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Advanced Usage](#-advanced-usage)

---

## ✨ Features

📊 **Comprehensive Metrics Collection**

- Test coverage from Vitest
- Build times and Turborepo cache stats
- TypeScript error counts
- ESLint warnings/errors
- TODO/FIXME comment tracking
- Git activity metrics

📈 **Trend Analysis**

- Historical metrics tracking
- Trend detection (improving/degrading)
- Anomaly detection
- Quality score calculation

📝 **Multiple Report Formats**

- Markdown reports for PRs
- JSON reports for CI/CD
- HTML dashboard for visual insights
- Real-time Next.js dashboard

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0
- **Vitest** configured in workspace

### Installation

```bash
# Install dependencies
pnpm install --filter quality-metrics
```

## Usage

### Collect Metrics

```bash
# Collect current metrics
pnpm --filter quality-metrics collect

# Metrics saved to .quality-metrics/
```

### Analyze Metrics

```bash
# Analyze trends and generate insights
pnpm --filter quality-metrics analyze
```

Output example:

```
📊 Quality Metrics Analysis
═════════════════════════════════════════════════════════

🎯 Quality Scores:
  Overall:      85.3/100 🟢
  Coverage:     82.5/100 🟢
  Performance:  91.2/100 🟢
  Code Quality: 78.9/100 🟡
  Velocity:     45.0/100 🟡

📈 Trends (vs previous run):
  🟡 ↗️ Test Coverage: +2.3
  🟢 ↗️ Build Time: -15.2
  🔴 ↘️ Type Errors: +3

💡 Recommendations:
  📊 Increase test coverage to 80%+ (currently 77.7%)
  🔴 Fix 3 TypeScript errors
  ⚠️  Fix 2 ESLint errors
```

### Generate Reports

```bash
# Markdown report (default)
pnpm --filter quality-metrics report markdown

# JSON report (for CI/CD)
pnpm --filter quality-metrics report json

# HTML report (visual dashboard)
pnpm --filter quality-metrics report html
```

Reports are saved to `.quality-metrics/report.*`

### Detect Test Flakiness

```bash
# Analyze test flakiness (requires test history)
pnpm --filter quality-metrics flakiness
```

Identifies unreliable tests with intermittent failures and timing instability.

### Detect Performance Regressions

```bash
# Check for performance regressions
pnpm --filter quality-metrics performance
```

Monitors build times and bundle sizes, alerting on >5% degradations.

### Generate Automated Insights

```bash
# Generate intelligent insights and recommendations
pnpm --filter quality-metrics insights
```

Correlates metrics to provide actionable recommendations prioritized by impact.

### View Dashboard

Access the real-time Next.js dashboard:

```bash
# Start development server
pnpm dev

# Navigate to http://localhost:3000/quality
```

## CI/CD Integration

The quality metrics workflow runs automatically:

- **On push** to main or feature branches
- **On pull requests** to main
- **Daily** at 2 AM UTC (scheduled)
- **Manually** via workflow dispatch

### GitHub Actions Workflow

The workflow:

1. Collects metrics from tests, builds, and code analysis
2. Analyzes trends and generates insights
3. Creates PR comments with quality reports
4. Deploys HTML dashboard to GitHub Pages
5. Fails if quality thresholds are not met

### Quality Thresholds

| Metric          | Threshold | Action        |
| --------------- | --------- | ------------- |
| Line Coverage   | ≥ 80%     | Fail if below |
| Branch Coverage | ≥ 75%     | Fail if below |
| Type Errors     | 0         | Fail if > 0   |
| Lint Errors     | 0         | Fail if > 0   |
| Build Time      | < 60s     | Warn if above |

## Architecture

```
tools/quality-metrics/
├── src/
│   ├── collect.ts    # Metrics collection
│   ├── analyze.ts    # Trend analysis & scoring
│   └── report.ts     # Report generation
├── package.json
└── tsconfig.json

.quality-metrics/     # Generated metrics (gitignored)
├── latest.json       # Latest metrics snapshot
├── history.jsonl     # Historical metrics (JSONL format)
├── report.md         # Markdown report
├── report.json       # JSON report
└── report.html       # HTML report

apps/web/
├── app/
│   ├── quality/      # Dashboard page
│   └── api/quality/  # Metrics API
└── src/
    └── components/
        └── quality-dashboard.tsx  # Dashboard UI
```

## Metrics Structure

```typescript
interface QualityMetrics {
  timestamp: string;

  coverage: {
    lines: number; // % line coverage
    functions: number; // % function coverage
    branches: number; // % branch coverage
    statements: number; // % statement coverage
  };

  build: {
    duration: number; // Build time (ms)
    cacheHitRate: number; // Turbo cache hit %
    bundleSize: number; // Bundle size (bytes)
  };

  codeQuality: {
    typeErrors: number; // TS error count
    lintWarnings: number; // ESLint warnings
    lintErrors: number; // ESLint errors
    todoCount: number; // TODO/FIXME count
    filesCount: number; // Source file count
    linesOfCode: number; // Total LOC
  };

  git: {
    commitCount: number; // Total commits
    contributors: number; // Unique contributors
    lastCommitDate: string; // Last commit date
    filesChanged: number; // Files changed (last 10 commits)
  };
}
```

## Quality Score Calculation

The overall quality score is calculated as a weighted average:

- **Coverage** (40%): Test coverage metrics
- **Performance** (20%): Build time and cache efficiency
- **Code Quality** (30%): Type safety and lint cleanliness
- **Velocity** (10%): Development activity

Penalties are applied for:

- TypeScript errors (-5 points each)
- ESLint errors (-3 points each)
- ESLint warnings (-1 point each)
- TODO/FIXME comments (-0.5 points each)

## API Endpoints

### GET `/api/quality/metrics`

Returns the latest quality metrics snapshot.

**Response:**

```json
{
  "timestamp": "2024-02-17T12:00:00Z",
  "coverage": { "lines": 82.5, ... },
  "build": { "duration": 45000, ... },
  "codeQuality": { "typeErrors": 0, ... },
  "git": { "commitCount": 250, ... }
}
```

### GET `/api/quality/history`

Returns the last 30 metrics snapshots for trend visualization.

**Response:**

```json
[
  { "timestamp": "2024-02-17T12:00:00Z", ... },
  { "timestamp": "2024-02-17T11:00:00Z", ... },
  ...
]
```

## Best Practices

### Metrics Collection

- **Run before major decisions**: Collect metrics before merging PRs
- **Track trends**: Look at trends, not individual snapshots
- **Automate collection**: Let CI/CD collect metrics automatically
- **Don't game the metrics**: Focus on real quality improvements

### Interpreting Scores

- **90-100**: Excellent - maintain current practices
- **70-89**: Good - focus on specific problem areas
- **50-69**: Needs improvement - review architecture
- **<50**: Critical - immediate attention required

### Setting Thresholds

Start with achievable thresholds and gradually raise them:

1. **Week 1-2**: Establish baseline (no enforcement)
2. **Week 3-4**: Set thresholds at current level
3. **Month 2+**: Incrementally raise thresholds

---

## 🏢 Enterprise Patterns

### Pattern 1: Continuous Quality Monitoring

Set up continuous monitoring with automated alerts:

```yaml
# .github/workflows/quality-monitor.yml
name: Quality Monitor

on:
  schedule:
    - cron: "0 */6 * * *" # Every 6 hours

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Collect Metrics
        run: pnpm --filter quality-metrics collect

      - name: Analyze Trends
        run: pnpm --filter quality-metrics analyze

      - name: Check Thresholds
        run: |
          SCORE=$(cat .quality-metrics/latest.json | jq '.scores.overall')
          if (( $(echo "$SCORE < 70" | bc -l) )); then
            echo "❌ Quality score below threshold: $SCORE"
            # Send alert to Slack/Teams
            exit 1
          fi
```

### Pattern 2: Quality Gates for Deployments

Enforce quality gates before production deployments:

```bash
# scripts/pre-deploy.sh
#!/bin/bash

# Collect fresh metrics
pnpm --filter quality-metrics collect

# Analyze quality
pnpm --filter quality-metrics analyze

# Extract scores
OVERALL=$(cat .quality-metrics/latest.json | jq '.scores.overall')
TYPE_ERRORS=$(cat .quality-metrics/latest.json | jq '.codeQuality.typeErrors')
COVERAGE=$(cat .quality-metrics/latest.json | jq '.coverage.lines')

# Enforce gates
if (( $(echo "$OVERALL < 80" | bc -l) )); then
  echo "❌ Overall quality score too low: $OVERALL (required: 80)"
  exit 1
fi

if [ "$TYPE_ERRORS" -gt 0 ]; then
  echo "❌ TypeScript errors detected: $TYPE_ERRORS"
  exit 1
fi

if (( $(echo "$COVERAGE < 75" | bc -l) )); then
  echo "❌ Test coverage too low: $COVERAGE% (required: 75%)"
  exit 1
fi

echo "✅ All quality gates passed"
```

### Pattern 3: Progressive Quality Improvement

Track quality improvements over sprints:

```typescript
// scripts/sprint-quality-report.ts
import { readFile } from "fs/promises";

interface SprintMetrics {
  sprint: number;
  startScore: number;
  endScore: number;
  improvement: number;
  target: number;
}

async function generateSprintReport() {
  const history = await readFile(".quality-metrics/history.jsonl", "utf-8");
  const metrics = history.split("\n").filter(Boolean).map(JSON.parse);

  // Calculate sprint progress
  console.table(sprints);
}

generateSprintReport();
```

### Pattern 4: Quality-Based Code Review

Integrate metrics into PR review process:

```yaml
# .github/workflows/pr-quality.yml
name: PR Quality Check

on: pull_request

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Collect base metrics
        run: |
          git checkout ${{ github.base_ref }}
          pnpm install
          pnpm --filter quality-metrics collect
          mv .quality-metrics/latest.json .quality-metrics/base.json

      - name: Collect PR metrics
        run: |
          git checkout ${{ github.head_ref }}
          pnpm install
          pnpm --filter quality-metrics collect

      - name: Compare & comment
        run: node scripts/compare-and-comment.js
```

---

## 🔧 Troubleshooting

### No metrics generated

```bash
# Ensure tests run successfully
pnpm test:coverage

# Check for errors
pnpm --filter quality-metrics collect
```

### Dashboard shows error

```bash
# Verify metrics exist
ls .quality-metrics/

# Regenerate if missing
pnpm --filter quality-metrics collect
```

### Build metrics are 0

The build metrics require a full build. Ensure:

- Dependencies are installed
- Previous builds didn't fail
- Turborepo is configured correctly

---

### Common Issues & Solutions

#### Issue: Metrics collection is slow

**Symptoms**:

```bash
$ pnpm --filter quality-metrics collect
# Takes >60 seconds
```

**Solution**:

```bash
# Collect specific metrics only
COLLECT_COVERAGE=true COLLECT_BUILD=false pnpm --filter quality-metrics collect

# Or skip expensive operations
pnpm --filter quality-metrics collect --skip-git-analysis
```

---

#### Issue: Historical data is corrupted

**Symptoms**:

```bash
$ pnpm --filter quality-metrics analyze
Error: Invalid JSON in history.jsonl at line 42
```

**Solution**:

```bash
# Validate and fix history file
node scripts/validate-history.js --fix

# Or start fresh (backup first!)
mv .quality-metrics/history.jsonl .quality-metrics/history.jsonl.backup
pnpm --filter quality-metrics collect
```

---

#### Issue: Dashboard shows stale data

**Symptoms**:

- Dashboard shows metrics from yesterday
- Refresh doesn't update data

**Solution**:

```bash
# Force regenerate metrics
rm -rf .quality-metrics/latest.json
pnpm --filter quality-metrics collect

# Restart dev server
pnpm dev
```

---

#### Issue: Coverage metrics mismatch

**Symptoms**:

- Quality metrics show 75% coverage
- Vitest reports 82% coverage

**Diagnosis**:

- Different coverage calculation methods
- Quality metrics may exclude test files
- Check `.quality-metrics/coverage-config.json`

**Solution**:

```bash
# Use same coverage configuration
cp vitest.config.ts .quality-metrics/coverage-config.json

# Recollect with updated config
pnpm --filter quality-metrics collect
```

---

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Set debug environment variable
DEBUG=quality-metrics:* pnpm --filter quality-metrics collect

# Save debug output
DEBUG=quality-metrics:* pnpm --filter quality-metrics collect 2> debug.log
```

---

## 🎓 Advanced Usage

### Custom Metrics Collection

Add custom metrics to track domain-specific quality indicators:

```typescript
// src/collectors/custom-metrics.ts
import { QualityMetrics } from "./types";

export async function collectCustomMetrics(): Promise<Partial<QualityMetrics>> {
  return {
    custom: {
      // Example: API endpoint  response time
      apiResponseTime: await measureApiResponseTime(),

      // Example: Database query performance
      slowQueries: await countSlowQueries(),

      // Example: Bundle size per route
      routeBundleSizes: await analyzeRouteBundles(),
    },
  };
}

async function measureApiResponseTime(): Promise<number> {
  const endpoints = ["/api/health", "/api/status"];
  const times = await Promise.all(
    endpoints.map(async (endpoint) => {
      const start = Date.now();
      await fetch(`http://localhost:3000${endpoint}`);
      return Date.now() - start;
    }),
  );
  return times.reduce((a, b) => a + b, 0) / times.length;
}
```

Register custom collector in `collect.ts`:

```typescript
import { collectCustomMetrics } from "./collectors/custom-metrics";

export async function collect() {
  const metrics = {
    ...await collectCoverage(),
    ...await collectBuild(),
    ...await collectCodeQuality(),
    ...await collectGit(),
    ...await collectCustomMetrics(), // Add custom metrics
  };

  await saveMetrics(metrics);
}
```

---

### Custom Scoring Algorithms

Implement custom quality scoring:

```typescript
// src/scoring/custom-scorer.ts
import { QualityMetrics, QualityScore } from "./types";

export function calculateCustomScore(metrics: QualityMetrics): QualityScore {
  // Custom weighting
  const weights = {
    coverage: 0.35, // 35% weight
    performance: 0.25, // 25% weight
    codeQuality: 0.25, // 25% weight
    security: 0.15, // 15% weight (custom)
  };

  const scores = {
    coverage: calculateCoverageScore(metrics.coverage),
    performance: calculatePerformanceScore(metrics.build),
    codeQuality: calculateCodeQualityScore(metrics.codeQuality),
    security: calculateSecurityScore(metrics.custom?.securityIssues),
  };

  const overall = Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + scores[key] * weight,
    0,
  );

  return { overall, ...scores };
}

function calculateSecurityScore(securityIssues: number = 0): number {
  // 100 score with 0 issues, decreasing by 10 per issue
  return Math.max(0, 100 - securityIssues * 10);
}
```

---

### Metrics Export for External Tools

Export metrics to external monitoring tools:

```typescript
// scripts/export-to-datadog.ts
import { readFile } from "fs/promises";

async function exportToDatadog() {
  const metrics = JSON.parse(
    await readFile(".quality-metrics/latest.json", "utf-8"),
  );

  const datadogMetrics = [
    {
      metric: "afenda.quality.overall_score",
      points: [[Date.now() / 1000, metrics.scores.overall]],
      tags: ["env:production", "team:platform"],
    },
    {
      metric: "afenda.quality.coverage",
      points: [[Date.now() / 1000, metrics.coverage.lines]],
      tags: ["env:production", "team:platform"],
    },
    {
      metric: "afenda.quality.build_time",
      points: [[Date.now() / 1000, metrics.build.duration]],
      tags: ["env:production", "team:platform"],
    },
  ];

  await fetch("https://api.datadoghq.com/api/v1/series", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DD-API-KEY": process.env.DATADOG_API_KEY!,
    },
    body: JSON.stringify({ series: datadogMetrics }),
  });

  console.log("✅ Exported metrics to Datadog");
}

exportToDatadog();
```

---

### Performance Optimization

Optimize metrics collection for large monorepos:

```typescript
// src/optimizations.ts

// 1. Parallel collection
export async function collectParallel() {
  const [coverage, build, codeQuality, git] = await Promise.all([
    collectCoverage(),
    collectBuild(),
    collectCodeQuality(),
    collectGit(),
  ]);

  return { coverage, build, codeQuality, git };
}

// 2. Incremental analysis
export async function analyzeIncremental() {
  const lastAnalysis = await readLastAnalysis();
  const changedFiles = await getChangedFiles(lastAnalysis.timestamp);

  // Only analyze changed files
  return analyzeFiles(changedFiles);
}

// 3. Caching
import { createHash } from "crypto";
import { readFile, writeFile } from "fs/promises";

const cache = new Map<string, any>();

export async function collectWithCache(
  key: string,
  collector: () => Promise<any>,
) {
  const hash = createHash("md5").update(key).digest("hex");

  if (cache.has(hash)) {
    return cache.get(hash);
  }

  const result = await collector();
  cache.set(hash, result);

  return result;
}
```

---

## 🤝 Contributing

Contributions are welcome! To add new metrics:

1. Update `QualityMetrics` interface in `src/types.ts`
2. Add collection logic to `src/collectors/`
3. Update scoring in `src/scoring/analyze.ts`
4. Add visualization to dashboard in `apps/web/app/quality/`
5. Update this README with documentation
6. Add tests for new functionality

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Related Documentation

- [Tools README](../README.md) - Complete tools overview
- [Development Guide](../GUIDE.md) - Architecture and patterns
- [afenda CLI](../afenda-cli/README.md) - CLI tool reference
- [CI/CD Guide](../../docs/BUILD_STRATEGY.md) - Build and deployment
- [Testing Guide](../../docs/TESTING.md) - Testing strategies

---

## 📄 License

MIT

---

<div align="center">

**📊 Quality Metrics Tool**

Real-time quality monitoring for enterprise-grade development

**Last Updated**: Auto-generated on save\
**Maintained By**: AFENDA-NEXUS Tools Team

[⬆ Back to Top](#-quality-metrics-tool---enterprise-edition)

</div>
