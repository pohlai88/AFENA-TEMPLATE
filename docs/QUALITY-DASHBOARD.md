# Quality Metrics Dashboard

## Overview

Real-time code quality monitoring with automated trend analysis, actionable insights, and visual dashboards.

## What's Included

### 📊 Metrics Collection (`tools/quality-metrics`)

Automated collection of:

- **Test Coverage**: Lines, functions, branches, statements from Vitest
- **Build Performance**: Duration, Turborepo cache hit rate, bundle sizes
- **Code Quality**: TypeScript errors, ESLint warnings/errors, TODO counts
- **Repository Activity**: Commits, contributors, change frequency

### 📈 Quality Dashboard (`/quality`)

Interactive Next.js dashboard featuring:

- Real-time metrics visualization
- Coverage breakdown with visual progress bars
- Status indicators (pass/warn/fail)
- Auto-refresh every 30 seconds
- Responsive design with dark mode support

### 🤖 GitHub Actions Integration

Automated quality checks on:

- Every push to main or feature branches
- Pull request creation
- Daily scheduled runs (2 AM UTC)
- Manual workflow dispatch

Features:

- PR comments with quality reports
- GitHub Pages deployment of HTML dashboard
- Quality threshold enforcement (CI fails if below thresholds)
- Historical trend tracking

### 📋 Report Formats

Three report formats:

1. **Markdown**: For PRs and documentation
2. **JSON**: For CI/CD integration
3. **HTML**: For visual dashboards

## Quick Start

### 1. Collect Metrics

```bash
# From root directory
pnpm quality:collect
```

This generates:

- `.quality-metrics/latest.json` - Current metrics snapshot
- `.quality-metrics/history.jsonl` - Historical data (JSONL format)

### 2. Analyze Trends

```bash
pnpm quality:analyze
```

Output:

```
📊 Quality Metrics Analysis
═══════════════════════════════════════════════

🎯 Quality Scores:
  Overall:      85.3/100 🟢
  Coverage:     82.5/100 🟢
  Performance:  91.2/100 🟢
  Code Quality: 78.9/100 🟡
  Velocity:     45.0/100 🟡

📈 Trends (vs previous run):
  🟡 ↗️ Test Coverage: +2.3
  🟢 ↗️ Build Time: -15.2

💡 Recommendations:
  📊 Increase test coverage to 80%+
  🔴 Fix 3 TypeScript errors
```

### 3. Generate Reports

```bash
# Markdown report
pnpm quality:report markdown

# JSON report
pnpm quality:report json

# HTML report
pnpm quality:report html
```

### 4. View Live Dashboard

```bash
# Start dev server
pnpm dev

# Navigate to http://localhost:3000/quality
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Quality Metrics System                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Vitest     │  │  TypeScript  │  │   ESLint     │ │
│  │  Coverage    │  │   Compiler   │  │    Linter    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │          │
│         └─────────────────┴─────────────────┘          │
│                           │                            │
│                  ┌────────▼────────┐                   │
│                  │  Collector      │                   │
│                  │  (collect.ts)   │                   │
│                  └────────┬────────┘                   │
│                           │                            │
│               ┌───────────▼───────────┐                │
│               │  Storage              │                │
│               │  .quality-metrics/    │                │
│               │    - latest.json      │                │
│               │    - history.jsonl    │                │
│               └───────────┬───────────┘                │
│                           │                            │
│          ┌────────────────┼────────────────┐           │
│          │                │                │           │
│  ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐   │
│  │  Analyzer    │  │  Reporter   │  │  Dashboard  │   │
│  │ (analyze.ts) │  │ (report.ts) │  │  (Next.js)  │   │
│  │              │  │             │  │             │   │
│  │ - Trends     │  │ - Markdown  │  │ - Real-time │   │
│  │ - Scoring    │  │ - JSON      │  │ - Visual    │   │
│  │ - Insights   │  │ - HTML      │  │ - API       │   │
│  └──────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## API Endpoints

### GET `/api/quality/metrics`

Returns latest quality metrics.

**Response:**

```json
{
  "timestamp": "2024-02-17T12:00:00Z",
  "coverage": {
    "lines": 82.5,
    "functions": 85.0,
    "branches": 78.3,
    "statements": 82.5
  },
  "build": {
    "duration": 45000,
    "cacheHitRate": 75.0,
    "bundleSize": 524288
  },
  "codeQuality": {
    "typeErrors": 0,
    "lintWarnings": 5,
    "lintErrors": 0,
    "todoCount": 23,
    "filesCount": 142,
    "linesOfCode": 12453
  },
  "git": {
    "commitCount": 250,
    "contributors": 5,
    "lastCommitDate": "2024-02-17T11:30:00Z",
    "filesChanged": 8
  }
}
```

### GET `/api/quality/history`

Returns last 30 metrics snapshots for trend visualization.

## Quality Thresholds

| Metric          | Target | Action           |
| --------------- | ------ | ---------------- |
| Line Coverage   | ≥ 80%  | ❌ Fail if below |
| Branch Coverage | ≥ 75%  | ❌ Fail if below |
| Type Errors     | 0      | ❌ Fail if > 0   |
| Lint Errors     | 0      | ❌ Fail if > 0   |
| Build Time      | < 60s  | ⚠️ Warn if above |

CI/CD pipeline fails if critical thresholds are not met.

## Quality Score Calculation

Overall score (0-100) is weighted as:

- **Coverage** (40%): Weighted average of lines/functions/branches/statements
- **Performance** (20%): Build time + cache hit rate
- **Code Quality** (30%): Penalties for errors, warnings, TODOs
- **Velocity** (10%): Development activity (commits, contributors)

### Penalties

- TypeScript error: -5 points each
- ESLint error: -3 points each
- ESLint warning: -1 point each
- TODO/FIXME: -0.5 points each

## Configuration

### Environment Variables

No configuration required - metrics are collected from:

- `coverage/coverage-summary.json` (Vitest)
- `.turbo/` (Turborepo cache)
- TypeScript compiler output
- ESLint output
- Git repository

### Customization

Edit thresholds in `.github/workflows/quality-metrics.yml`:

```yaml
- name: Check quality thresholds
  run: |
    # Customize thresholds here
    if (metrics.coverage.lines < 80) { ... }
```

## Best Practices

### ✅ Do

- Collect metrics regularly (pre-commit, pre-PR, daily)
- Focus on trends, not individual snapshots
- Set achievable thresholds and raise gradually
- Use metrics to identify problem areas
- Share dashboard with team for visibility

### ❌ Don't

- Game the metrics (write meaningless tests for coverage)
- Set unrealistic thresholds that block progress
- Ignore warnings - fix them before they become errors
- Let TODO count grow unbounded
- Skip metric collection on CI

## Troubleshooting

### Metrics not generating

```bash
# Run tests first
pnpm test:coverage

# Then collect
pnpm quality:collect
```

### Dashboard shows "Metrics not found"

```bash
# Generate metrics
pnpm quality:collect

# Restart dev server
pnpm dev
```

### CI workflow failing

Check:

1. Test coverage meets thresholds (≥ 80% lines)
2. No TypeScript errors (`pnpm type-check`)
3. No ESLint errors (`pnpm lint`)
4. Build completes successfully (`pnpm build`)

## Integration Timeline

### Week 1: Baseline

- Collect initial metrics
- Review baseline scores
- No enforcement

### Week 2-3: Monitoring

- Daily metric collection
- Track trends
- Identify problem areas

### Week 4+: Enforcement

- Enable quality gate in CI
- Require thresholds for PR merges
- Gradually raise thresholds

## Resources

- [Quality Metrics Tool README](../tools/quality-metrics/README.md)
- [Testing Guide](./TESTING.md)
- [Observability Guide](./OBSERVABILITY.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Roadmap

Future enhancements:

- [ ] Test flakiness detection
- [ ] Performance regression alerts
- [ ] Bundle size tracking
- [ ] Dependency vulnerability scanning
- [ ] Code complexity analysis
- [ ] Custom metric plugins
- [ ] Slack/Discord notifications
- [ ] Historical trend charts

---

**Last Updated:** February 17, 2026  
**Maintainer:** afenda Engineering Team
