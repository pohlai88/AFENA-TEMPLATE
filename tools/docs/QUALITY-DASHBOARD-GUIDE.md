# Quality Dashboard User Guide

> **Interactive visualization and monitoring for AFENDA-NEXUS code quality
> metrics**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Accessing the Dashboard](#accessing-the-dashboard)
- [Dashboard Features](#dashboard-features)
- [Understanding Metrics](#understanding-metrics)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## Overview

The Quality Dashboard provides real-time visualization of code quality metrics
with historical trends, helping teams maintain high code standards and identify
areas for improvement.

### Key Features

- 📊 **Real-time Metrics** - Auto-refresh every 30 seconds
- 📈 **Interactive Charts** - 7-day trend visualizations
- 📦 **Package Drill-down** - Per-package coverage analysis
- 🎯 **Status Indicators** - Pass/warn/fail badges
- ⚡ **Trend Analysis** - Visual trend indicators (↑↓)
- 🔄 **Database-backed** - Historical data persistence

### Access Requirements

- Active development environment (`pnpm dev` running)
- Browser: Chrome, Firefox, Safari, Edge (latest versions)
- Optional: Database connection for historical trends

---

## Accessing the Dashboard

### Local Development

1. **Start the development server**:

   ```bash
   cd AFENDA-NEXUS
   pnpm dev
   ```

2. **Open in browser**:

   ```
   http://localhost:3000/quality
   ```

3. **Dashboard loads automatically** with latest metrics

### Production Deployment

For production deployments, ensure:

- `DATABASE_URL` environment variable is set
- Quality metrics collection runs regularly
- Next.js app is deployed with `/quality` route enabled

---

## Dashboard Features

### 1. Key Metrics Cards (Top Section)

Four primary metric cards display current state:

#### Test Coverage Card

- **Display**: Percentage of lines covered by tests
- **Progress Bar**: Visual representation of coverage
- **Status Badge**: Pass (≥80%), Warn (70-79%), Fail (<70%)
- **Trend Indicator**: ↑ improving, ↓ declining, — stable

**Example**:

```
┌─────────────────────────┐
│ Test Coverage           │
│ 85.2% ✓                 │
│ ████████████████░░░░    │
│ Line coverage           │
└─────────────────────────┘
```

#### Type Errors Card

- **Display**: Number of TypeScript compilation errors
- **Description**: Also shows lint error count
- **Status**: Pass (0 errors), Warn (1-5), Fail (>5)
- **Target**: Always 0 errors

#### Build Time Card

- **Display**: Build duration in seconds/minutes
- **Description**: Cache hit rate percentage
- **Monitoring**: Track for performance regressions

#### Bundle Size Card

- **Display**: Output bundle size in MB
- **Description**: Total file count
- **Monitoring**: Watch for unexpected increases

### 2. Coverage Breakdown

Detailed breakdown of all coverage metrics:

| Metric     | Target | Visualization               |
| ---------- | ------ | --------------------------- |
| Lines      | 80%    | Progress bar with threshold |
| Functions  | 80%    | Progress bar with threshold |
| Branches   | 75%    | Progress bar with threshold |
| Statements | 80%    | Progress bar with threshold |

**Color Coding**:

- 🟢 Green: Above threshold
- 🟡 Yellow: Below threshold but >60%
- 🔴 Red: Below 60%

### 3. Interactive Trend Charts (7-Day View)

#### Coverage Trend Chart (Area Chart)

- **X-axis**: Date (last 7 days)
- **Y-axis**: Coverage percentage (0-100%)
- **Visualization**: Green gradient area chart
- **Purpose**: Identify coverage trends over time

**How to Read**:

- Upward trend = Improving coverage
- Downward trend = Coverage degradation
- Flat line = Stable coverage

#### Build Performance Chart (Dual-Axis Line Chart)

- **Left Y-axis**: Build time (milliseconds)
- **Right Y-axis**: Bundle size (MB)
- **Lines**: Blue (build time), Purple (bundle size)
- **Purpose**: Correlate build time with bundle size changes

**Warning Signs**:

- Sudden spikes in build time
- Gradual bundle size creep
- Uncorrelated changes (investigate further)

#### Quality Metrics Chart (Bar Chart)

- **Bars**: Red (type errors), Orange (lint errors)
- **X-axis**: Date
- **Y-axis**: Error count
- **Purpose**: Track error introduction and resolution

**Goal**: All bars at zero (perfect quality)

#### Cache Performance Chart (Area Chart)

- **X-axis**: Date
- **Y-axis**: Cache hit rate percentage (0-100%)
- **Visualization**: Cyan gradient
- **Purpose**: Monitor build caching effectiveness

**Note**: Currently shows 0% (tracking not yet implemented)

### 4. Package Metrics (Drill-Down)

Shows top 5 packages by coverage:

```
┌──────────────────────────────────────────────┐
│ Top Packages by Coverage                    │
├──────────────────────────────────────────────┤
│ afenda-crm                                   │
│ 1,250 lines | Complexity: 4.2               │
│ ████████████████████░░░░ 92.5%              │
├──────────────────────────────────────────────┤
│ afenda-accounting                            │
│ 2,100 lines | Complexity: 5.8               │
│ ███████████████░░░░░ 78.3%                   │
└──────────────────────────────────────────────┘
```

**Metrics Shown**:

- Package name
- Lines of code
- Average complexity
- Coverage percentage with color-coded bar

### 5. Additional Stats (Bottom Cards)

Three summary cards provide context:

#### Code Quality Card

- Lines of code
- Total files
- Technical debt (TODO count)
- Lint warnings

#### Build Info Card

- Bundle size (MB)
- Build duration
- Cache hit rate

#### Repository Stats Card

- Total commits
- Contributors count
- Files changed (recent)
- Last commit date

---

## Understanding Metrics

### Test Coverage

**What it measures**: Percentage of code executed during test runs

**Types**:

- **Lines**: Individual lines of code executed
- **Functions**: Functions/methods called during tests
- **Statements**: JavaScript statements executed
- **Branches**: Conditional branches (if/else) tested

**Target**: 80%+ for all types (75% for branches)

**Why it matters**:

- High coverage = Better tested code
- Low coverage = Higher bug risk
- Coverage trends indicate code quality trajectory

**Tips**:

- Focus on critical paths first
- Don't chase 100% (diminishing returns)
- Coverage ≠ quality (write meaningful tests)

### Type Errors

**What it measures**: TypeScript compilation errors

**Target**: 0 errors

**Why it matters**:

- Type safety prevents runtime bugs
- Enforces API contracts
- Improves IDE autocomplete

**Common causes**:

- Missing type definitions
- Incorrect type annotations
- Breaking API changes

### Lint Errors and Warnings

**What it measures**: ESLint rule violations

**Targets**:

- Errors: 0
- Warnings: ≤10

**Why it matters**:

- Code consistency
- Best practice adherence
- Bug prevention (e.g., unused variables)

**Categories**:

- **Errors**: Must fix (blocks PR)
- **Warnings**: Should fix (doesn't block)

### Build Metrics

**Build Time**: Duration from start to completion

**Why monitor**:

- Affects developer productivity
- Indicates dependency complexity
- Helps optimize CI/CD pipeline

**Normal range**: <2 minutes for typical changes

**Bundle Size**: Total output size after compilation

**Why monitor**:

- Affects page load performance
- Indicates code bloat
- Helps identify heavy dependencies

**Target**: Keep under 5MB for web apps

### Technical Debt

**What it measures**: TODO/FIXME comments in code

**Purpose**: Track intentional shortcuts

**Best practice**:

- TODO for planned improvements
- FIXME for known issues
- Always include context (why/when)

---

## Common Workflows

### 1. Check PR Quality

**Scenario**: You've opened a pull request and want to check if it meets quality
standards.

**Steps**:

1. **Wait for CI to complete** (usually 5-10 minutes)
2. **Check PR comments** for quality gates results
3. **If failed**, navigate to dashboard:

   ```bash
   # Checkout your PR branch locally
   git checkout feature/my-feature

   # Collect fresh metrics
   pnpm --filter quality-metrics collect

   # Start dev server
   pnpm dev

   # Open http://localhost:3000/quality
   ```

4. **Review failing metrics**:
   - Coverage below threshold? Add more tests
   - Type errors? Fix type annotations
   - Lint errors? Run `pnpm lint:fix`
5. **Fix issues and push again**

### 2. Monitor Team Progress

**Scenario**: Weekly quality review with the team

**Steps**:

1. **Open dashboard** at `/quality`
2. **Review trend charts** (7-day view):
   - Coverage trending up? 🎉 Celebrate!
   - Coverage trending down? Investigate
   - Errors increasing? Action needed
3. **Check package metrics**:
   - Identify packages needing attention
   - Compare coverage across packages
4. **Share insights**:
   - Screenshot interesting trends
   - Discuss in team meeting
   - Set improvement goals

### 3. Debug Failing Tests

**Scenario**: Tests are failing but you're not sure why

**Steps**:

1. **Check dashboard** for context:
   - Coverage dropped? Missing test cases
   - Build time increased? Slow tests added
2. **Review package metrics**:
   - Which package has low coverage?
   - High complexity packages = more testing needed
3. **Run tests locally**:
   ```bash
   pnpm test --coverage
   ```
4. **Compare with baseline**:
   - Use historical trends to identify when issue started
   - Check git history for related changes

### 4. Maintain Quality Standards

**Scenario**: Onboarding new team members or enforcing standards

**Steps**:

1. **Show dashboard** to new developers
2. **Explain thresholds**:
   - Coverage: 80%+ required
   - Errors: 0 tolerated
   - Build time: <2 min preferred
3. **Monitor PRs**:
   - Quality gates auto-enforce standards
   - Dashboard provides detailed breakdowns
4. **Regular reviews**:
   - Weekly dashboard check-ins
   - Celebrate improvements
   - Address declining metrics

### 5. Investigate Performance Regressions

**Scenario**: Build time suddenly increased

**Steps**:

1. **Check Build Performance chart**:
   - Identify when spike occurred
   - Correlate with bundle size changes
2. **Review corresponding commits**:
   ```bash
   # Find commits on that date
   git log --since="2026-02-10" --until="2026-02-11" --oneline
   ```
3. **Investigate changes**:
   - New dependencies added?
   - Large files committed?
   - Complex computation introduced?
4. **Optimize**:
   - Remove unnecessary dependencies
   - Optimize algorithms
   - Use code splitting

---

## Troubleshooting

### Dashboard Not Loading

**Symptom**: `/quality` shows 404 or blank page

**Solutions**:

1. **Verify dev server is running**:

   ```bash
   pnpm dev
   # Should show "ready on http://localhost:3000"
   ```

2. **Check console for errors**:
   - Open browser DevTools (F12)
   - Look for red errors in Console tab

3. **Verify route exists**:

   ```bash
   # Check file exists
   ls apps/web/app/quality/page.tsx
   ```

4. **Rebuild if needed**:
   ```bash
   pnpm --filter web build
   ```

### No Metrics Displayed

**Symptom**: Dashboard loads but shows "No data available"

**Solutions**:

1. **Collect metrics first**:

   ```bash
   pnpm --filter quality-metrics collect
   ```

2. **Check API endpoints**:
   - Open browser DevTools → Network tab
   - Look for `/api/quality/metrics` request
   - Should return 200 status with JSON data

3. **Verify database connection** (if using DB):

   ```bash
   # Check DATABASE_URL is set
   echo $DATABASE_URL

   # Test connection
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM quality_snapshots"
   ```

4. **Check file storage fallback**:
   ```bash
   # Verify metrics file exists
   ls .quality-metrics/snapshot-*.json
   ```

### Charts Not Rendering

**Symptom**: Dashboard shows metrics but charts are blank

**Solutions**:

1. **Check browser console** for JavaScript errors

2. **Verify recharts dependency**:

   ```bash
   # Should already be installed
   pnpm list recharts
   ```

3. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

4. **Update to latest charts**:
   - Ensure quality-dashboard-enhanced.tsx is being used
   - Check imports are correct

### Metrics Not Updating

**Symptom**: Dashboard shows old data, doesn't auto-refresh

**Solutions**:

1. **Verify auto-refresh is enabled**:
   - Check browser console for refresh logs
   - Default interval: 30 seconds

2. **Manually refresh**:
   - Click browser refresh button
   - Should fetch latest data

3. **Check API is responding**:

   ```bash
   curl http://localhost:3000/api/quality/metrics
   # Should return recent timestamp
   ```

4. **Restart dev server**:
   ```bash
   # Stop current process (Ctrl+C)
   pnpm dev
   ```

### Database Connection Issues

**Symptom**: Warnings about database fallback in logs

**Solutions**:

1. **Check DATABASE_URL is set**:

   ```bash
   echo $DATABASE_URL
   # Should show postgresql://...
   ```

2. **Verify database is accessible**:

   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

3. **Check permissions**:
   - Ensure user has SELECT permissions on quality tables

4. **File fallback still works**:
   - Dashboard gracefully falls back to file-based metrics
   - Historical trends won't be available without database

---

## FAQ

### General Questions

**Q: How often does the dashboard update?**\
A: Auto-refresh every 30 seconds. You can also manually refresh the page.

**Q: Can I customize the refresh interval?**\
A: Yes! Edit `quality-dashboard-enhanced.tsx` and change the interval value
(currently 30000ms).

**Q: Does the dashboard require database connection?**\
A: No, it falls back to file-based metrics. However, historical trends require
database.

**Q: Can I export metrics data?**\
A: Yes, use the API endpoints directly or download from database:

```bash
# Export via API
curl http://localhost:3000/api/quality/history?limit=100 > metrics.json

# Or query database directly
psql $DATABASE_URL -c "COPY (SELECT * FROM quality_snapshots) TO STDOUT CSV" > metrics.csv
```

### Metrics Questions

**Q: Why is my coverage showing 0%?**\
A: Run `pnpm test -- --coverage` first to generate coverage data, then collect
metrics.

**Q: What's the difference between lines and statements coverage?**\
A: Lines = physical lines of code. Statements = logical operations. A single
line can have multiple statements.

**Q: Why do I see warnings about cache hit rate showing 0%?**\
A: Cache hit rate tracking not yet implemented. This is a known limitation.

**Q: How far back does historical data go?**\
A: Database retention is 90 days. Charts show last 7 days by default
(configurable).

### Troubleshooting Questions

**Q: Dashboard shows different metrics than CI?**\
A: CI uses fresh metrics collection. Dashboard shows last collected snapshot.
Run `pnpm --filter quality-metrics collect` to sync.

**Q: Charts are missing data points?**\
A: Metrics collection needs to run daily for complete trends. Gaps indicate days
without collection.

**Q: Package metrics not showing?**\
A: Per-package metrics require database storage and recent collection run
including package data.

**Q: Why are trend indicators not showing?**\
A: Trend calculation requires at least 2 historical snapshots for comparison.

### Configuration Questions

**Q: Can I change quality gate thresholds?**\
A: Yes, edit `.quality-gates.json` in the repository root.

**Q: Can I add custom metrics to the dashboard?**\
A: Yes, extend the `quality_snapshots` schema and update dashboard components.

**Q: Can I change which packages show in the drill-down?**\
A: Currently shows top 5. Edit `quality-dashboard-enhanced.tsx` to change the
limit.

**Q: Can I change the trend window from 7 days?**\
A: Yes, modify the API call in the dashboard:
`fetch('/api/quality/trends?days=14')`

---

## Best Practices

### For Developers

1. **Check dashboard before pushing** - Ensure local metrics meet standards
2. **Monitor your PR** - Watch for quality gate failures
3. **Fix issues quickly** - Don't let technical debt accumulate
4. **Review trends weekly** - Stay informed about team progress

### For Team Leads

1. **Weekly dashboard reviews** - Discuss trends in stand-ups
2. **Set improvement goals** - Track progress week over week
3. **Celebrate wins** - Recognize quality improvements
4. **Address declining metrics** - Don't let issues snowball

### For Project Managers

1. **Use trends for planning** - Quality metrics inform velocity
2. **Monitor technical debt** - TODO count indicates future work
3. **Track build performance** - Affects team productivity
4. **Share with stakeholders** - Visualize code quality progress

---

## Additional Resources

- **Quick Start Guide**: [QUALITY-GUIDE.md](./QUALITY-GUIDE.md)
- **API Documentation**: See `/api/quality/*` route files
- **Configuration Guide**: [QUALITY-GATES-CONFIG-GUIDE.md](./QUALITY-GATES-CONFIG-GUIDE.md)
- **Security Guide**: [SECURITY-SCANNING-GUIDE.md](./SECURITY-SCANNING-GUIDE.md)

---

**Last Updated**: February 21, 2026\
**Version**: 1.0.0\
**Maintainer**: AFENDA-NEXUS Tools Team
