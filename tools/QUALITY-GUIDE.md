# Quality Metrics & Gates - Quick Start Guide

## 📋 Overview

AFENDA-NEXUS now has a comprehensive quality management system with:

- 📊 **Quality Metrics Collection** - Track coverage, build times, code quality
- 🚦 **Quality Gates** - Automated PR blocking based on thresholds
- 🔒 **Security Scanning** - Vulnerability detection with npm audit
- 📈 **Interactive Dashboard** - Real-time visualizations with historical trends
  ✨ NEW!
- 🔌 **Dashboard API** - REST endpoints for metrics and trends
- ⚙️ **CI/CD Integration** - Automated checks on every PR

## 🖥️ Quality Dashboard

### Viewing the Dashboard

1. **Start the development server**:

   ```bash
   pnpm dev
   ```

2. **Open in browser**:
   ```
   http://localhost:3000/quality
   ```

### Dashboard Features

#### Real-time Metrics

- **Auto-refresh**: Updates every 30 seconds
- **Key Metrics Cards**: Coverage, type errors, build time, bundle size
- **Status Indicators**: Pass/warn/fail badges with color coding
- **Trend Indicators**: ↑ up, ↓ down, — stable

#### Interactive Charts (7-day trends)

1. **Coverage Trend**: Test coverage over time (area chart)
2. **Build Performance**: Build time and bundle size (dual-axis line chart)
3. **Quality Metrics**: Type errors vs lint errors (bar chart)
4. **Cache Performance**: Build cache hit rate (area chart)

#### Package Metrics

- Top 5 packages by coverage
- Coverage percentage bars
- Lines of code and complexity stats
- Color-coded status (green ≥80%, yellow ≥60%, red <60%)

#### Additional Stats

- Code quality metrics (LOC, files, TODO count)
- Build information (size, duration, cache rate)
- Repository statistics (commits, contributors, changes)

## 🚀 Quick Start

### 1. Collect Metrics

```bash
# Collect metrics (file storage only)
pnpm --filter quality-metrics collect

# Collect metrics with database storage
DATABASE_URL="postgresql://..." pnpm --filter quality-metrics collect
```

### 2. Check Quality Gates

```bash
# Check if current commit passes quality gates
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)

# Compare against different baseline
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD) --base-branch=develop

# Use custom config
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD) --config=my-config.json
```

### 3. Run Security Scan

```bash
# Default (fails on critical + high)
pnpm --filter quality-metrics security

# Fail on moderate too
pnpm --filter quality-metrics security --fail-moderate

# Get markdown report
pnpm --filter quality-metrics security --format=markdown
```

## 📊 Quality Gates Configuration

Create `.quality-gates.json` in workspace root:

```json
{
  "minCoverageLines": 80,
  "minCoverageFunctions": 80,
  "minCoverageStatements": 80,
  "minCoverageBranches": 75,
  "maxCoverageDropPct": 2,
  "maxTypeErrors": 0,
  "maxLintErrors": 0,
  "maxLintWarnings": 10,
  "maxBuildTimeIncreasePct": 20
}
```

**Gate Rules:**

- ✅ **Absolute Thresholds** - Min coverage %, max errors/warnings
- ✅ **Regression Detection** - Max allowed coverage drop from baseline
- ✅ **Build Time** - Warn on significant build time increases
- ✅ **Type Safety** - Zero TypeScript errors required (configurable)
- ✅ **Lint Quality** - Zero lint errors, limited warnings

## 🔒 Security Scanning

**Configuration Options:**

```bash
# Don't fail on critical (not recommended)
pnpm --filter quality-metrics security --no-fail-critical

# Don't fail on high (not recommended)
pnpm --filter quality-metrics security --no-fail-high

# Fail on moderate severity
pnpm --filter quality-metrics security --fail-moderate
```

**Output Formats:**

| Format     | Use Case           | File                                    |
| ---------- | ------------------ | --------------------------------------- |
| `text`     | Console output     | -                                       |
| `json`     | Tooling/automation | `.quality-metrics/security-report.json` |
| `markdown` | GitHub PR comments | `.quality-metrics/security-report.md`   |

## 📈 API Endpoints

### Get Latest Metrics

```bash
GET /api/quality/metrics
```

**Response:**

```json
{
  "timestamp": "2026-02-17T10:30:00Z",
  "coverage": {
    "lines": 85.5,
    "functions": 88.2,
    "branches": 78.9,
    "statements": 86.1
  },
  "build": {
    "duration": 12300,
    "bundleSize": 512000
  },
  "codeQuality": {
    "typeErrors": 0,
    "lintErrors": 0,
    "lintWarnings": 5,
    "todoCount": 12,
    "filesCount": 450,
    "linesOfCode": 45000
  },
  "git": {
    "commitCount": 1000,
    "contributors": 137,
    "lastCommitDate": "2026-02-17T10:30:00Z"
  }
}
```

### Get Historical Data

```bash
GET /api/quality/history?limit=30&days=30
```

**Query Params:**

- `limit` - Max number of snapshots (default: 30, max: 100)
- `days` - Number of days to look back (default: 30)

**Response:** Array of metrics snapshots with git context and package metrics

```json
[
  {
    "timestamp": "2026-02-17T10:30:00Z",
    "coverage": { "lines": 85.5, "functions": 88.2, "branches": 78.9, "statements": 86.1 },
    "build": { "duration": 12300, "cacheHitRate": 0, "bundleSize": 512000 },
    "codeQuality": { "typeErrors": 0, "lintErrors": 0, "lintWarnings": 5, ... },
    "git": { "sha": "abc123", "branch": "main", "author": "dev@example.com", ... },
    "packages": [
      {
        "packageName": "afenda-crm",
        "coverage": 92.5,
        "lines": 1250,
        "complexity": 4.2
      }
    ]
  }
]
```

### Get Daily Trends (For Charts)

```bash
GET /api/quality/trends?days=7
```

**Query Params:**

- `days` - Number of days to aggregate (default: 7)

**Response (Flattened for Chart Libraries):**

```json
[
  {
    "date": "2026-02-17",
    "coverage": 85.5,
    "buildTime": 12300,
    "typeErrors": 0,
    "lintErrors": 0,
    "bundleSize": 2.4,
    "cacheHitRate": 0
  }
]
```

### Compare Commits

```bash
GET /api/quality/compare?sha=abc123&base=main
```

**Query Params:**

- `sha` - Commit SHA to compare (required)
- `base` - Baseline branch (default: main)

**Response:**

```json
{
  "current": {
    "sha": "abc123",
    "branch": "feature/new-feature",
    "timestamp": "2026-02-17T10:30:00Z",
    "coverage": { "lines": 85.5, ... },
    "quality": { "typeErrors": 0, ... }
  },
  "baseline": {
    "sha": "def456",
    "branch": "main",
    "timestamp": "2026-02-16T08:00:00Z",
    "coverage": { "lines": 83.0, ... },
    "quality": { "typeErrors": 0, ... }
  },
  "diff": {
    "coverage": { "lines": 2.5, ... },
    "quality": { "typeErrors": 0, ... }
  }
}
```

## ⚙️ CI/CD Integration

### Automatic PR Checks

Quality gates automatically run on every PR via
`.github/workflows/quality-gates.yml`:

1. **Triggered On:**
   - PR opened
   - PR synchronized (new commits pushed)
   - PR reopened

2. **Steps:**
   - Install dependencies
   - Build packages
   - Run tests with coverage
   - Collect metrics → save to database
   - Check quality gates
   - Run security scan
   - Post PR comment with results
   - Fail if violations found

3. **Required Secrets:**
   - `DATABASE_URL` - Neon PostgreSQL connection string (optional for file-only
     mode)
   - `ORG_ID` - Organization ID for multi-tenant (optional, defaults to
     `org_ci_default`)

### Manual Workflow Dispatch

Run quality checks on any SHA:

```yaml
# In GitHub UI: Actions → Quality Gates → Run workflow
Inputs:
  sha: abc123def456
  base-branch: main
```

### Local CI Simulation

```bash
# Simulate CI locally
DATABASE_URL="..." pnpm test:coverage
pnpm --filter quality-metrics collect
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)
pnpm --filter quality-metrics security
```

## 🎯 Common Workflows

### Pre-commit Check

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run quality checks
pnpm test:coverage
pnpm --filter quality-metrics collect
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD) || {
  echo "❌ Quality gates failed! Commit aborted."
  exit 1
}
```

### PR Review Checklist

- [ ] All tests passing
- [ ] Coverage ≥ 80%
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] ≤ 10 ESLint warnings
- [ ] No critical/high security vulnerabilities
- [ ] Build time increase < 20%

### Fixing Failed Gates

**Coverage Drop:**

```bash
# Find untested files
pnpm test:coverage
# Add tests for low-coverage files
# Re-run: pnpm test:coverage
```

**Type Errors:**

```bash
# Find errors
pnpm type-check
# Fix errors in reported files
# Re-run: pnpm type-check
```

**Lint Issues:**

```bash
# Find and auto-fix
pnpm lint:fix
# Manual fixes for unfixable issues
# Re-run: pnpm lint
```

**Security Vulnerabilities:**

```bash
# Review vulnerabilities
pnpm audit

# Auto-fix (may break compatibility)
pnpm audit --fix

# Or update specific package
pnpm update <package-name>
```

## 📝 Metrics Storage

**File-based (default):**

- Location: `.quality-metrics/`
- Latest: `latest.json`
- History: `history.jsonl`
- Security: `security-report.{json,md}`

**Database (recommended for production):**

- Table: `quality_snapshots`
- Retention: Configurable (default: unlimited)
- Benefits: Historical queries, trends, comparisons
- Setup: Set `DATABASE_URL` environment variable

## 🔧 Troubleshooting

**"No metrics found for SHA"**

- Run: `DATABASE_URL="..." pnpm --filter quality-metrics collect`
- Ensure metrics collection happened before gates check

**"DATABASE_URL is not set"**

- Optional for file-only mode
- Required for database storage
- Set in CI secrets or local `.env`

**"Failed to run security audit"**

- Ensure `pnpm` is installed
- Run manually: `pnpm audit`
- Check internet connection

**"Quality gates failed"**

- Review violations in output
- Fix issues (see "Fixing Failed Gates")
- Adjust thresholds in `.quality-gates.json` if needed

## 📚 Additional Resources

- TOOL-DEVELOPMENT-PLAN.md - Full development plan
- SPRINT-0-COMPLETE.md - Database foundation
- SPRINT-1-COMPLETE.md - Quality gates + security
- Quality Dashboard - Interactive UI
- API Documentation - Full API reference

---

**Need Help?** Check the
[GitHub Issues](https://github.com/pohlai88/afenda-TEMPLATE/issues) or contact
the development team.
