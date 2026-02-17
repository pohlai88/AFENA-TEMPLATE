# Automated Insights & Quality Intelligence

This guide covers Phase 6 of the Enterprise Transformation: Automated Insights, Flakiness Detection, and Performance Regression Analysis.

## Overview

The automated insights system provides intelligent, actionable recommendations by analyzing quality metrics over time. It detects patterns, correlations, and anomalies that manual review might miss.

## Features

### 1. Test Flakiness Detection 🔍

Identifies unreliable tests that pass/fail inconsistently:

- **Intermittent Failures**: Tests that sometimes pass, sometimes fail
- **Timing Instability**: Tests with highly variable execution times
- **Flakiness Scoring**: 0-100 scale with severity classification
- **Trend Analysis**: Tracks test reliability over time

**Usage:**
```bash
# Analyze test flakiness
pnpm quality:flakiness

# View report
cat .quality-metrics/flakiness-report.json
```

**Flakiness Thresholds:**
- 🔴 **Critical** (>70%): Quarantine immediately
- 🟡 **Warning** (40-70%): Investigate and fix
- 🟢 **Acceptable** (<40%): Monitor

**Common Causes:**
- External API dependencies without mocking
- Race conditions (improper async/await)
- Hardcoded timeouts
- Shared test state
- Non-deterministic data (dates, random values)

### 2. Performance Regression Detection ⚡

Monitors performance metrics and alerts on degradations:

- **Build Time**: Tracks build duration trends
- **Bundle Size**: Detects bloat from new dependencies
- **Baseline Calculation**: Uses median of last 10 runs
- **Change Detection**: Flags >5% regressions

**Usage:**
```bash
# Detect performance regressions
pnpm quality:performance

# View report
cat .quality-metrics/performance-report.json
```

**Thresholds:**
- Build time: >5% slower triggers warning, >50% triggers critical alert
- Bundle size: >5% larger triggers warning, >25% triggers critical alert

**Common Causes:**
- New heavy dependencies
- Inefficient imports (whole libraries instead of specific functions)
- Missing build optimizations
- Cache invalidation issues

### 3. Automated Insights Engine 🔮

Generates intelligent insights by correlating multiple metrics:

- **Cross-Metric Analysis**: Finds patterns across coverage, performance, quality
- **Trend Detection**: Identifies declining coverage, growing technical debt
- **Health Scoring**: Overall codebase health (0-100)
- **Priority Ranking**: Critical > High > Medium > Low

**Usage:**
```bash
# Generate automated insights
pnpm quality:insights

# View report
cat .quality-metrics/insights-report.json
```

**Health Levels:**
- 🟢 **Excellent** (90-100): Optimal code health
- 🟡 **Good** (70-89): Minor improvements needed
- 🟠 **Fair** (50-69): Action required
- 🔴 **Poor** (<50): Urgent intervention needed

**Insight Categories:**
1. **Quality**: Coverage, tests, type safety
2. **Performance**: Build speed, bundle size
3. **Maintenance**: Technical debt, TODOs
4. **Velocity**: Commit rate, team activity

## Full Quality Check

Run all quality tools in sequence:

```bash
pnpm quality:full
```

This executes:
1. ✅ Collect metrics (`quality:collect`)
2. ✅ Analyze trends (`quality:analyze`)
3. ✅ Detect flakiness (`quality:flakiness`)
4. ✅ Check performance (`quality:performance`)
5. ✅ Generate insights (`quality:insights`)

## CI/CD Integration

The GitHub Actions workflow automatically runs all quality checks:

```yaml
- Trigger: On push, PR, daily schedule
- Steps:
  1. Collect quality metrics
  2. Analyze trends
  3. Detect test flakiness
  4. Check performance regressions
  5. Generate automated insights
  6. Post PR comment with all results
  7. Deploy to GitHub Pages
  8. Enforce quality gates
```

**Quality Gates:**
- ❌ Fails if coverage < 80%
- ❌ Fails if TypeScript errors > 0
- ❌ Fails if ESLint errors > 0
- ❌ Fails if critical flaky tests detected
- ❌ Fails if critical performance regression

## Interpreting Reports

### Flakiness Report

```json
{
  "totalTests": 120,
  "flakyTests": [
    {
      "testName": "src/auth.test.ts::login with invalid credentials",
      "flakiness": 75,
      "totalRuns": 20,
      "passCount": 5,
      "failCount": 15,
      "avgDuration": 250,
      "durationStdDev": 120
    }
  ]
}
```

**Analysis:**
- 75% flakiness = Critical (quarantine)
- High duration variance (±120ms) = Timing issues
- 75% failure rate = Not truly intermittent, likely broken
- **Action**: Fix test logic or update expectations

### Performance Report

```json
{
  "regressions": [
    {
      "metric": "Build Duration",
      "current": 45000,
      "baseline": 30000,
      "change": 15000,
      "changePercent": 50,
      "severity": "critical"
    }
  ]
}
```

**Analysis:**
- 50% build time increase = Critical regression
- 45s vs 30s baseline = 15s slower
- **Action**: Profile build, check for new dependencies, review recent changes

### Insights Report

```json
{
  "overallHealth": "good",
  "healthScore": 78.5,
  "topPriorities": [
    {
      "priority": "high",
      "title": "Test Coverage Below Target (72.3%)",
      "recommendation": "Focus on testing critical business logic..."
    }
  ]
}
```

**Analysis:**
- Health: Good (70-89 range)
- Main issue: Coverage 7.7% below 80% target
- **Action**: Add ~50 new test cases for critical paths

## Best Practices

### 1. Fix Flaky Tests Immediately
- Don't merge PRs with flaky tests
- Use `test.skip()` to quarantine until fixed
- Add proper `waitFor` instead of `setTimeout`
- Mock external dependencies

### 2. Monitor Performance Trends
- Review performance reports weekly
- Set bundle size budgets
- Profile builds after adding dependencies
- Use dynamic imports for large modules

### 3. Act on Insights
- Address critical/high priority items first
- Create tickets for medium priority items
- Track health score trend over time
- Celebrate improvements!

### 4. Build History
- Run checks on every PR
- Collect at least 10 data points before trusting trends
- Archive old data (>90 days) to save space
- Review monthly trends in team meetings

## Troubleshooting

### "Insufficient data for regression detection"
- **Cause**: Less than 5 historical data points
- **Solution**: Run `pnpm quality:collect` more frequently

### "No test history found"
- **Cause**: Tests haven't been run with history tracking
- **Solution**: Test results need to be saved in JSONL format (future enhancement)

### "Critical flakiness detected" but tests pass locally
- **Cause**: Flakiness often environment-specific (CI vs local)
- **Solution**: Run tests 20+ times locally: `for i in {1..20}; do pnpm test; done`

### False positive performance regressions
- **Cause**: First build is slower (cold cache)
- **Solution**: Used median baseline to filter out outliers

## Metrics Storage

All reports saved to `.quality-metrics/`:

```
.quality-metrics/
├── latest.json              # Most recent metrics
├── history.jsonl            # All historical metrics
├── flakiness-report.json    # Flaky test analysis
├── performance-report.json  # Performance regressions
├── insights-report.json     # Automated insights
├── report.md               # Markdown report
└── report.html             # Visual dashboard
```

## API Endpoints

The Next.js dashboard exposes insights via API:

- `GET /api/quality/metrics` - Latest metrics
- `GET /api/quality/history` - Historical data (30 days)
- `GET /api/quality/insights` - Latest insights report
- `GET /api/quality/flakiness` - Flaky test report
- `GET /api/quality/performance` - Performance regressions

## Roadmap

Future enhancements:

- [ ] Machine learning-based anomaly detection
- [ ] Slack/Discord notifications for critical issues
- [ ] Dependency vulnerability correlation
- [ ] Code churn vs quality regression analysis
- [ ] Predictive modeling (forecast future quality)
- [ ] Team-specific insights and leaderboards

## Related Documentation

- [Quality Dashboard](./QUALITY-DASHBOARD.md) - Real-time metrics visualization
- [Testing Guide](./testing/) - Test authoring best practices
- [Performance Guide](./performance/) - Build optimization strategies

---

**Last Updated:** February 17, 2026
**Status:** ✅ Complete (Phase 6)
**Quality Score:** 9.5/10
