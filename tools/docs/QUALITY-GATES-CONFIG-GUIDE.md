# Quality Gates Configuration Guide

> **Automated PR quality enforcement for AFENDA-NEXUS**

---

## 📋 Table of Contents

- [Overview](#overview)
- [How Quality Gates Work](#how-quality-gates-work)
- [Configuration File](#configuration-file)
- [Threshold Parameters](#threshold-parameters)
- [Running Quality Gates](#running-quality-gates)
- [CI/CD Integration](#cicd-integration)
- [Customization Examples](#customization-examples)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

Quality Gates automatically enforce code quality standards on every pull
request. They validate metrics against configurable thresholds and block PRs
that fail to meet minimum requirements.

### What Gets Checked

- ✅ **Test Coverage** - Minimum coverage percentages
- ✅ **Coverage Regressions** - Maximum allowed coverage drops
- ✅ **Type Safety** - TypeScript compilation errors
- ✅ **Lint Quality** - ESLint errors and warnings
- ✅ **Build Performance** - Build time increases

### Benefits

- 🛡️ **Prevents quality degradation** - Blocks PRs before merge
- 📊 **Objective standards** - No subjective code review debates
- ⏱️ **Fast feedback** - Results in minutes, not hours
- 📈 **Continuous improvement** - Ratchet up standards over time

---

## 

How Quality Gates Work

### Execution Flow

```mermaid
graph LR
    A[PR Opened] --> B[CI Triggers]
    B --> C[Collect Metrics]
    C --> D[Check Gates]
    D --> E{Pass?}
    E -->|Yes| F[✅ PR Comment: Passed]
    E -->|No| G[❌ PR Comment: Failed]
    G --> H[Block Merge]
    F --> I[Allow Merge]
```

### Implementation Details

1. **Metric Collection** (`collect.ts`)
   - Runs test suite with coverage
   - Type-checks with `tsc --noEmit`
   - Lints with ESLint
   - Captures build timing
   - Stores in database + file

2. **Gate Validation** (`gates.ts`)
   - Loads configuration from `.quality-gates.json`
   - Fetches current + baseline metrics
   - Applies absolute thresholds
   - Detects regressions
   - Generates pass/fail report

3. **PR Feedback** (GitHub Actions)
   - Posts detailed comment
   - Shows pass/fail for each gate
   - Includes metric comparisons
   - Links to dashboard for details

---

## Configuration File

### Location

Create `.quality-gates.json` in the repository root:

```
AFENDA-NEXUS/
├── .quality-gates.json  ← Configuration file
├── apps/
├── packages/
└── tools/
```

### Default Configuration

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

### Schema Validation

The configuration is validated against this TypeScript interface:

```typescript
interface QualityGatesConfig {
    // Absolute coverage minimums (percentages)
    minCoverageLines: number;
    minCoverageFunctions: number;
    minCoverageStatements: number;
    minCoverageBranches: number;

    // Regression detection (percentages)
    maxCoverageDropPct: number;
    maxBuildTimeIncreasePct: number;

    // Quality standards (counts)
    maxTypeErrors: number;
    maxLintErrors: number;
    maxLintWarnings: number;
}
```

---

## Threshold Parameters

### Absolute Thresholds

#### `minCoverageLines`

**Type**: `number` (percentage, 0-100) **Default**: `80`

**Description**: Minimum percentage of lines covered by tests

**Example**:

```json
{
    "minCoverageLines": 85
}
```

**When to adjust**:

- **Increase**: Mature codebase with good test coverage
- **Decrease**: Legacy code with poor coverage (temporary)

**Recommendations**:

- **80%** - Industry standard for production code
- **90%** - High-quality libraries
- **70%** - Acceptable for rapid prototyping

---

#### `minCoverageFunctions`

**Type**: `number` (percentage, 0-100) **Default**: `80`

**Description**: Minimum percentage of functions called by tests

**Example**:

```json
{
    "minCoverageFunctions": 85
}
```

**When to adjust**:

- Usually matches `minCoverageLines`
- May be higher if you have many small functions

---

#### `minCoverageStatements`

**Type**: `number` (percentage, 0-100) **Default**: `80`

**Description**: Minimum percentage of statements executed by tests

**Example**:

```json
{
    "minCoverageStatements": 80
}
```

**Notes**:

- Often slightly higher than lines coverage
- One line can contain multiple statements

---

#### `minCoverageBranches`

**Type**: `number` (percentage, 0-100) **Default**: `75`

**Description**: Minimum percentage of conditional branches tested

**Example**:

```json
{
    "minCoverageBranches": 70
}
```

**Why lower?**:

- Branch testing is harder (if/else, switch, ternary)
- 75% is good balance between coverage and effort

**When to adjust**:

- **Increase**: Critical business logic with many conditionals
- **Decrease**: UI code with many edge cases

---

### Regression Thresholds

#### `maxCoverageDropPct`

**Type**: `number` (percentage, 0-100) **Default**: `2`

**Description**: Maximum allowed coverage decrease from baseline

**Example**:

```json
{
    "maxCoverageDropPct": 1.5
}
```

**How it works**:

```
baseline coverage = 85%
current coverage = 83.5%
drop = 85 - 83.5 = 1.5%

If maxCoverageDropPct = 2:  ✅ Pass (1.5 < 2)
If maxCoverageDropPct = 1:  ❌ Fail (1.5 > 1)
```

**When to adjust**:

- **Stricter (1%)**: Well-tested codebase, prevent backsliding
- **Relaxed (3%)**: Large refactorings expected
- **Very strict (0%)**: Never allow coverage drops

---

#### `maxBuildTimeIncreasePct`

**Type**: `number` (percentage, 0-100) **Default**: `20`

**Description**: Maximum allowed build time increase from average

**Example**:

```json
{
    "maxBuildTimeIncreasePct": 15
}
```

**How it works**:

```
average build time = 60s (last 10 builds)
current build time = 72s
increase = ((72 - 60) / 60) * 100 = 20%

If maxBuildTimeIncreasePct = 20:  ✅ Pass (20 = 20)
If maxBuildTimeIncreasePct = 15:  ❌ Fail (20 > 15)
```

**When to adjust**:

- **Stricter (10%)**: CI/CD performance critical
- **Relaxed (30%)**: Expect variability in build times

---

### Quality Standards

#### `maxTypeErrors`

**Type**: `number` (count) **Default**: `0`

**Description**: Maximum allowed TypeScript compilation errors

**Example**:

```json
{
    "maxTypeErrors": 0
}
```

**Recommendation**: Always keep at `0`

**Why strict?**:

- Type errors indicate broken code
- May cause runtime failures
- Easy to fix during development

**Exception**: Set to higher value only for gradual TypeScript adoption

---

#### `maxLintErrors`

**Type**: `number` (count) **Default**: `0`

**Description**: Maximum allowed ESLint errors

**Example**:

```json
{
    "maxLintErrors": 0
}
```

**Recommendation**: Keep at `0` for production code

**Why strict?**:

- ESLint errors indicate real issues
- Should be auto-fixable with `--fix`
- Enforces code standards

---

#### `maxLintWarnings`

**Type**: `number` (count) **Default**: `10`

**Description**: Maximum allowed ESLint warnings

**Example**:

```json
{
    "maxLintWarnings": 5
}
```

**When to adjust**:

- **Stricter (0)**: Zero-tolerance policy
- **Relaxed (20)**: Legacy codebase cleanup in progress

**Recommendations**:

- **0** - New greenfield projects
- **5** - Well-maintained projects
- **10** - Acceptable for active development
- **20+** - Only for legacy code migration

---

## Running Quality Gates

### Command-Line Usage

#### Basic Usage

```bash
# Check current commit against main baseline
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)
```

#### Custom Baseline

```bash
# Check against develop branch
pnpm --filter quality-metrics gates \
  --sha=$(git rev-parse HEAD) \
  --base-branch=develop
```

#### Custom Configuration

```bash
# Use different config file
pnpm --filter quality-metrics gates \
  --sha=$(git rev-parse HEAD) \
  --config=.quality-gates.strict.json
```

### Exit Codes

| Code | Meaning                  | CI Behavior               |
| ---- | ------------------------ | ------------------------- |
| `0`  | All gates passed         | Continue workflow         |
| `1`  | One or more gates failed | Fail workflow (blocks PR) |
| `2`  | Error running gates      | Fail workflow             |

### Output Format

**Success**:

```
✅ Quality Gates PASSED

📊 Coverage Metrics:
  Lines:      85.2% (target: 80%) ✓
  Functions:  88.1% (target: 80%) ✓
  Statements: 86.5% (target: 80%) ✓
  Branches:   79.3% (target: 75%) ✓

🔍 Code Quality:
  Type Errors:  0 (max: 0) ✓
  Lint Errors:  0 (max: 0) ✓
  Lint Warnings: 5 (max: 10) ✓

📈 Regressions:
  Coverage Drop: 0.5% (max: 2%) ✓
  Build Time Increase: 5% (max: 20%) ✓
```

**Failure**:

```
❌ Quality Gates FAILED

VIOLATIONS (2):
  ❌ Lines coverage too low: 78.5% < 80%
  ❌ Coverage dropped by 3.2% (max: 2%)

WARNINGS (1):
  ⚠️  Build time increased by 25% (max: 20%)

📊 Details:
  Baseline coverage: 82%
  Current coverage:  78.5%
  Coverage drop:     3.5%
```

---

## CI/CD Integration

### GitHub Actions Workflow

The quality gates workflow is defined in `.github/workflows/quality-gates.yml`:

```yaml
name: Quality Gates & Security

on:
    pull_request:
        types: [opened, synchronize, reopened]

jobs:
    quality-gates:
        runs-on: ubuntu-latest
        steps:
            # ... setup steps ...
            - name: Collect Metrics
              run: pnpm --filter quality-metrics collect
              env:
                  DATABASE_URL: ${{ secrets.DATABASE_URL }}

            - name: Check Quality Gates
              id: gates
              run: pnpm --filter quality-metrics gates --sha=${{ github.sha }}
              continue-on-error: true

            - name: Post PR Comment
              if: github.event_name == 'pull_request'
              uses: actions/github-script@v7
              with:
                  script: |
                      // Read gate results and post comment
                      // ...

            - name: Fail if gates failed
              if: steps.gates.outcome == 'failure'
              run: exit 1
```

### Workflow Features

- ✅ **Automatic trigger** on PR open/update
- ✅ **Database persistence** (optional, via DATABASE_URL secret)
- ✅ **PR comments** with detailed results
- ✅ **Merge blocking** on failure
- ✅ **Artifact upload** (30-day retention)

### Setting Up

1. **Add workflow file** (already included)

2. **Configure secrets** (optional for database):
   ```bash
   # In GitHub repo settings → Secrets
   DATABASE_URL=postgresql://user:pass@host/db
   ```

3. **Enable branch protection**:
   - Settings → Branches → Add rule
   - Require status checks to pass
   - Select "quality-gates" check

---

## Customization Examples

### Example 1: Strict Quality Gates

For production-critical code with high standards:

```json
{
    "minCoverageLines": 90,
    "minCoverageFunctions": 90,
    "minCoverageStatements": 90,
    "minCoverageBranches": 85,
    "maxCoverageDropPct": 0.5,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 0,
    "maxBuildTimeIncreasePct": 10
}
```

**Use case**: Financial systems, healthcare, mission-critical

---

### Example 2: Relaxed Gates (Legacy Code)

For gradual quality improvement of legacy codebase:

```json
{
    "minCoverageLines": 60,
    "minCoverageFunctions": 60,
    "minCoverageStatements": 60,
    "min CoverageBranches": 50,
    "maxCoverageDropPct": 5,
    "maxTypeErrors": 10,
    "maxLintErrors": 5,
    "maxLintWarnings": 50,
    "maxBuildTimeIncreasePct": 30
}
```

**Use case**: Legacy migration, temporary during cleanup

**Note**: Gradually tighten thresholds over time

---

### Example 3: Prototype/MVP

For rapid development with basic quality gates:

```json
{
    "minCoverageLines": 70,
    "minCoverageFunctions": 70,
    "minCoverageStatements": 70,
    "minCoverageBranches": 65,
    "maxCoverageDropPct": 3,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 20,
    "maxBuildTimeIncreasePct": 25
}
```

**Use case**: MVP, proof-of-concept, rapid prototyping

---

### Example 4: Library/Framework

For open-source library with high quality bar:

```json
{
    "minCoverageLines": 95,
    "minCoverageFunctions": 95,
    "minCoverageStatements": 95,
    "minCoverageBranches": 90,
    "maxCoverageDropPct": 0,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 0,
    "maxBuildTimeIncreasePct": 15
}
```

**Use case**: Public APIs, npm packages, frameworks

---

## Troubleshooting

### Common Issues

#### Gates Failing Despite Good Code

**Symptom**: Quality gates fail but code looks fine

**Solutions**:

1. **Check baseline metrics**:
   ```bash
   # View historical snapshots
   curl http://localhost:3000/api/quality/history?limit=10
   ```

2. **Review failure details**:
   - Check PR comment for exact failures
   - Compare current vs baseline metrics

3. **Verify configuration**:
   ```bash
   # Validate config file
   cat .quality-gates.json | jq .
   ```

4. **Run gates locally**:
   ```bash
   pnpm --filter quality-metrics collect
   pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)
   ```

---

#### Coverage Regression False Positive

**Symptom**: Coverage drop detected but coverage actually increased

**Cause**: Baseline comparison against wrong branch

**Solution**:

```bash
# Specify correct baseline
pnpm --filter quality-metrics gates \
  --sha=$(git rev-parse HEAD) \
  --base-branch=main
```

---

#### Build Time Warnings

**Symptom**: Build time warnings despite no code changes

**Cause**: CI runner performance variability

**Solutions**:

1. **Increase threshold temporarily**:
   ```json
   {
       "maxBuildTimeIncreasePct": 30
   }
   ```

2. **Re-run CI** (might just be slow runner)

3. **Use average of last 10 builds** (already implemented)

---

#### Type Errors in CI but not Locally

**Symptom**: CI shows type errors that don't appear locally

**Cause**: Different TypeScript versions or stale cache

**Solutions**:

1. **Match CI TypeScript version**:
   ```bash
   # Check CI version in logs
   # Update package.json to match
   ```

2. **Clean local cache**:
   ```bash
   rm -rf node_modules .next
   pnpm install
   ```

3. **Run exact CI command**:
   ```bash
   pnpm type-check
   ```

---

## Best Practices

### Configuration Management

1. **Version control** - Always commit `.quality-gates.json`
2. **Document changes** - Add comment explaining threshold changes
3. **Gradual tightening** - Increase standards incrementally
4. **Team consensus** - Discuss threshold changes with team

### Threshold Setting

1. **Start conservative** - Begin with achievable targets
2. **Measure first** - Collect 2 weeks of data before setting gates
3. **Ratchet up** - Tighten standards as code improves
4. **Never relax** - Avoid lowering thresholds (address root cause instead)

### Exception Handling

**When to skip quality gates**:

- ✅ Emergency hotfixes (with follow-up PR)
- ✅ Documentation-only changes (separate workflow)
- ❌ "Just this once" - slippery slope!

**How to skip** (use sparingly):

```yaml
# In PR description
[skip quality-gates]
```

Or use workflow dispatch to manually override.

### Monitoring

1. **Review weekly** - Check dashboard trends
2. **Adjust as needed** - Standards should evolve with codebase
3. **Communicate changes** - Announce threshold updates to team
4. **Celebrate wins** - Recognize quality improvements

---

## Additional Resources

- **Quick Start**: [QUALITY-GUIDE.md](../QUALITY-GUIDE.md)
- **Dashboard Guide**:
  [QUALITY-DASHBOARD-GUIDE.md](./QUALITY-DASHBOARD-GUIDE.md)
- **Security Guide**: Coming soon
- **API Docs**: See `apps/web/app/api/quality/` routes

---

**Last Updated**: February 17, 2026\
**Version**: 1.0.0\
**Maintainer**: AFENDA-NEXUS Tools Team
