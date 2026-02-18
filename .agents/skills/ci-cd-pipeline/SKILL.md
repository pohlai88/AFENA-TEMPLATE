# ci-cd-pipeline

## Description

CI/CD pipeline configuration, GitHub Actions workflows, quality gates, security scanning, and deployment strategies for AFENDA-NEXUS.

## Trigger Conditions

Use this skill when:

- Setting up or modifying CI/CD workflows
- Adding quality gates or checks
- Questions about build/test/deploy pipeline
- Troubleshooting CI failures
- Security scanning and SBOM generation
- Coverage reporting

---

## Overview

AFENDA-NEXUS uses **GitHub Actions** for CI/CD with multiple workflows:

1. **CI**: Build, test, lint, type-check, quality gates
2. **E2E**: End-to-end browser tests
3. **Quality Metrics**: Code quality analysis, flakiness detection
4. **SBOM**: Software Bill of Materials generation

---

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers**:

- Push to `main` branch
- Pull requests (opened, synchronize)

**Jobs**: `afenda-ci`, `afenda-e2e`

---

#### Job: `afenda-ci`

**Steps**:

1. **Checkout code** (`actions/checkout@v4`)
2. **Setup pnpm** (`pnpm/action-setup@v4`)
3. **Setup Node.js 20** (`actions/setup-node@v4`)
4. **Install dependencies** (`pnpm install --frozen-lockfile`)
5. **Build** (`pnpm build`)
6. **Unit tests with coverage** (`pnpm test:coverage`)
7. **Upload coverage to Codecov**
8. **Coverage comment on PR** (lcov-reporter-action)
9. **Lint with import/no-cycle** (`pnpm lint:ci`)
10. **Type check** (`pnpm type-check`)
11. **CI invariants** (`pnpm ci:invariants`)
12. **Database barrel + registry** (Gate 7)
13. **Database schema lint** (Gate 0)
14. **Generated files up-to-date check** (Git diff)
15. **Adapter gates** (N2 contract, spine denylist)

---

#### Job: `afenda-e2e`

**Depends On**: `afenda-ci`

**Steps**:

1. **Checkout code**
2. **Setup pnpm & Node.js**
3. **Install dependencies**
4. **Install Playwright browsers** (`npx playwright install --with-deps chromium`)
5. **Build**
6. **Run E2E tests** (`pnpm test:e2e`)
7. **Upload Playwright report** (on failure or cancellation)
8. **Upload test results** (JUnit XML)

---

### 2. Quality Metrics Workflow (`quality-metrics.yml`)

**Triggers**:

- Push to `main` or `feat/*` branches
- Pull requests to `main`
- Daily at 2 AM UTC (cron)
- Manual dispatch

**Steps**:

1. **Checkout code** (with full history)
2. **Setup Node.js & pnpm**
3. **Install dependencies**
4. **Run tests with coverage**
5. **Build packages**
6. **Collect metrics** (`pnpm quality:collect`)
7. **Analyze metrics** (`pnpm quality:analyze`)
8. **Detect test flakiness** (`pnpm quality:flakiness`)
9. **Detect performance regressions** (`pnpm quality:performance`)
10. **Generate automated insights** (`pnpm quality:insights`)
11. **Generate markdown report**
12. **Generate HTML report**
13. **Upload metrics artifacts** (90-day retention)
14. **Comment PR with metrics** (if PR event)

---

### 3. SBOM Workflow (`sbom.yml`)

**Triggers**:

- Release published
- Weekly Monday 6 AM UTC
- Manual dispatch

**Steps**:

1. **Checkout code**
2. **Setup pnpm & Node.js**
3. **Install dependencies**
4. **Generate CycloneDX SBOM** (`@cyclonedx/cdxgen`)
5. **Generate SHA-256 checksum**
6. **Upload SBOM artifact** (90-day retention)

---

## Quality Gates

### Gate 0: Database Schema Lint

```bash
pnpm --filter afenda-database db:lint
```

**Checks**:

- Schema naming conventions
- Column naming conventions
- Index naming conventions
- Constraint naming conventions

---

### Gate 1: Dependency Validation

```bash
pnpm validate:deps
```

**Checks**:

- Layer isolation rules (no upward dependencies)
- Circular dependencies
- Forbidden cross-layer references

---

### Gate 2: Type Checking

```bash
pnpm type-check
pnpm type-check:refs
```

**Checks**:

- TypeScript compilation errors
- Project reference consistency

---

### Gate 3: Linting

```bash
pnpm lint:ci
```

**Checks**:

- ESLint rules (base + custom)
- **import/no-cycle**: Circular imports (CI-only, slow)
- Code style violations

---

### Gate 4: Unit Tests

```bash
pnpm test:coverage
```

**Requirements**:

- All tests pass
- Coverage thresholds met:
  - Lines: 80%
  - Functions: 80%
  - Branches: 75%
  - Statements: 80%

---

### Gate 5: E2E Tests

```bash
pnpm test:e2e
```

**Requirements**:

- Critical user flows pass
- No browser console errors
- Accessibility checks pass

---

### Gate 6: CI Invariants

```bash
pnpm ci:invariants
pnpm housekeeping
```

**Checks**:

- Package.json consistency
- Build configuration
- No uncommitted generated files

---

### Gate 7: Generated Files Up-to-Date

```bash
git diff --exit-code packages/database/src/schema/index.ts
```

**Checks**:

- Database barrel exports current
- Schema registry up-to-date
- No uncommitted generated code

---

### Gate 8: Adapter Gates

```bash
pnpm ci:adapter-gates
```

**Checks**:

- N2 contract integrity
- Spine denylist compliance

---

## Environment Variables

### CI Environment

```yaml
env:
  # Dummy values for build-time module evaluation
  DATABASE_URL: 'postgresql://ci:ci@ci-placeholder.neon.tech/neondb?sslmode=verify-full'
  NEON_AUTH_BASE_URL: 'https://ci-placeholder.neon.tech'
  NEON_AUTH_COOKIE_SECRET: 'ci-placeholder-secret-32chars-minimum'

  # Test environment
  NODE_ENV: test
  TEST_DATABASE_URL: 'postgresql://ci:ci@ci-placeholder.neon.tech/neondb?sslmode=verify-full'

  # Turbo Remote Cache (optional)
  # TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  # TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

---

### Required Secrets

- `CODECOV_TOKEN`: Codecov API token
- `GITHUB_TOKEN`: Auto-provided by GitHub Actions
- `TURBO_TOKEN` (optional): Vercel Remote Cache token

---

## Coverage Reporting

### Codecov Integration

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/coverage-final.json
    flags: unittests
    name: afenda-coverage
    fail_ci_if_error: false
    verbose: true
```

---

### PR Coverage Comment

```yaml
- name: Coverage summary comment
  if: github.event_name == 'pull_request'
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    lcov-file: ./coverage/lcov.info
    github-token: ${{ secrets.GITHUB_TOKEN }}
    delete-old-comments: true
```

**Output**: Adds comment to PR with coverage delta.

---

## Concurrency

```yaml
concurrency:
  group: ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```

**Effect**: Cancels in-progress runs when new commits are pushed to the same PR.

---

## Caching

### pnpm Cache

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
```

**Effect**: Caches `~/.pnpm-store` to speed up dependency installation.

---

### Turbo Cache (Optional)

```yaml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Effect**: Enables Vercel Remote Cache for Turborepo builds.

---

## Artifacts

### Unit Test Coverage

- **Path**: `./coverage/`
- **Uploaded to**: Codecov
- **Retention**: Codecov storage policy

---

### E2E Test Reports

- **Path**: `playwright-report/`
- **Artifact Name**: `playwright-report`
- **Retention**: 7 days

---

### E2E Test Results

- **Path**: `test-results/`
- **Artifact Name**: `test-results`
- **Retention**: 7 days

---

### Quality Metrics

- **Path**: `.quality-metrics/`, `*.txt`
- **Artifact Name**: `quality-metrics`
- **Retention**: 90 days

---

### SBOM

- **Path**: `sbom.json`, `sbom.sha256`
- **Artifact Name**: `sbom-${{ github.sha }}`
- **Retention**: 90 days

---

## Common CI Failures & Solutions

### 1. Frozen Lockfile Violation

**Error**:

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

**Solution**:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

---

### 2. Generated Files Stale

**Error**:

```
Generated schema files are stale. Run 'pnpm --filter afenda-database db:barrel' and commit.
```

**Solution**:

```bash
pnpm --filter afenda-database db:barrel
git add packages/database/src/schema/
git commit -m "chore: regenerate schema barrel"
```

---

### 3. Coverage Threshold Not Met

**Error**:

```
Coverage for lines (78%) does not meet threshold (80%)
```

**Solution**:

- Add more unit tests
- Focus on uncovered lines (check coverage report)
- If legitimate, adjust threshold in `vitest.config.ts`

---

### 4. Lint Failures

**Error**:

```
Import cycle detected: packages/a -> packages/b -> packages/a
```

**Solution**:

- Refactor to break circular dependency
- Extract shared code to lower layer
- Review architecture (Layer 2 shouldn't depend on Layer 2)

---

### 5. Type Check Failures

**Error**:

```
Property 'field' does not exist on type 'Type'
```

**Solution**:

```bash
pnpm type-check
# Fix TypeScript errors
pnpm type-check:refs  # Verify project references
```

---

### 6. E2E Test Timeouts

**Error**:

```
Test timeout of 30000ms exceeded
```

**Solution**:

- Increase timeout in `playwright.config.ts`
- Check if `webServer` is starting correctly
- Review test for infinite waits

---

## Local Pre-Commit Checks

Before pushing, run all CI checks locally:

```bash
# Full CI simulation
pnpm validate:deps
pnpm type-check:refs
pnpm lint:ci
pnpm test:coverage
pnpm housekeeping
pnpm afenda meta check
pnpm afenda readme check
pnpm build
```

**Shortcut**:

```bash
pnpm bundle  # Runs most checks
```

---

## Deployment (Future)

**Current Status**: Not yet implemented.

**Planned Strategy**:

1. **Preview Deployments**: Every PR → Vercel preview
2. **Staging Deployment**: Merge to `main` → staging environment
3. **Production Deployment**: Git tag → production environment

**Providers**:

- **Frontend**: Vercel (Next.js)
- **Database**: Neon Postgres (branching for preview)
- **Monitoring**: OpenTelemetry + observability platform

---

## Security Scanning

### pnpm Audit

```bash
pnpm audit --audit-level=moderate
pnpm audit:prod  # Production dependencies only
pnpm audit:fix   # Auto-fix vulnerabilities
```

**Run**: Locally before releases, CI on schedule.

---

### SBOM (Software Bill of Materials)

Generated weekly and on releases using CycloneDX:

```bash
pnpm sbom  # Alias for: pnpm dlx @cyclonedx/cdxgen -r --no-install-deps -o sbom.json
```

**Use Cases**:

- Vulnerability tracking
- License compliance
- Supply chain security

---

## Performance Optimization

### Turbo Cache

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

**Effect**: Caches build outputs, skips unchanged packages.

---

### Parallel Jobs

```yaml
strategy:
  matrix:
    package: [afenda-accounting, afenda-inventory, afenda-crm]
steps:
  - run: pnpm --filter ${{ matrix.package }} test
```

**Effect**: Runs tests for multiple packages in parallel.

---

## Monitoring & Alerting

### GitHub Actions Notifications

**Default**: Email notifications on workflow failures.

**Slack Integration** (optional):

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "CI failed for ${{ github.repository }} on ${{ github.ref }}"
      }
```

---

### Quality Metrics Trends

Daily cron job tracks:

- Code coverage trends
- Test flakiness
- Build performance
- Dependency security

Output: `.quality-metrics/` directory with JSON reports.

---

## Best Practices

### 1. Fast Feedback

- **Unit tests first**: Fastest, catch most issues
- **Lint & type-check early**: Before expensive operations
- **Parallel jobs**: Run E2E separately from CI

---

### 2. Fail Fast

- **Stop on first failure**: `--bail` (Vitest default)
- **Cancel in-progress**: Concurrency group
- **Early validation**: Lint before build

---

### 3. Deterministic Builds

- **Frozen lockfile**: `--frozen-lockfile`
- **Pinned versions**: Catalog versions in `package.json`
- **No network in tests**: Mock external API calls

---

### 4. Cache Aggressively

- **pnpm cache**: Automatic with `setup-node`
- **Turbo cache**: Remote cache for builds
- **Playwright browsers**: Cache installed browsers

---

### 5. Meaningful Artifacts

- **Test reports**: Always upload, even on failure
- **Coverage reports**: Track trends over time
- **Build logs**: Include in PR comments

---

## Troubleshooting

### CI Passes Locally, Fails in GitHub Actions

**Possible Causes**:

1. **Environment variables**: Check `.env` vs. workflow `env`
2. **Dependency versions**: Use `--frozen-lockfile`
3. **Generated files**: Commit all generated code
4. **Timezone differences**: Use UTC in tests

---

### Slow CI Runs

**Optimizations**:

1. **Enable Turbo cache**: Remote cache for builds
2. **Parallel jobs**: Split E2E from CI
3. **Prune dependencies**: Remove unused packages
4. **Cache pnpm store**: Already enabled

---

### Flaky E2E Tests

**Solutions**:

1. **Increase timeouts**: `playwright.config.ts`
2. **Wait for network idle**: `page.waitForLoadState('networkidle')`
3. **Retry on failure**: `retries: 2` in config
4. **Isolate tests**: Each test should be independent

---

## References

- [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) - Main CI workflow
- [.github/workflows/quality-metrics.yml](../../../.github/workflows/quality-metrics.yml) - Quality analysis
- [.github/workflows/sbom.yml](../../../.github/workflows/sbom.yml) - SBOM generation
- [turbo.json](../../../turbo.json) - Turborepo configuration
- [vitest.config.ts](../../../vitest.config.ts) - Test configuration
- [playwright.config.ts](../../../playwright.config.ts) - E2E test configuration
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## Quick Reference

### Run All CI Checks Locally

```bash
pnpm validate:deps
pnpm type-check:refs
pnpm lint:ci
pnpm test:coverage
pnpm housekeeping
pnpm afenda meta check
pnpm build
pnpm test:e2e
```

### Quality Gates Summary

| Gate | Command            | Purpose                       |
| ---- | ------------------ | ----------------------------- |
| 0    | `db:lint`          | Schema naming conventions     |
| 1    | `validate:deps`    | Layer isolation               |
| 2    | `type-check:refs`  | TypeScript compilation        |
| 3    | `lint:ci`          | Code style + circular imports |
| 4    | `test:coverage`    | Unit tests + coverage         |
| 5    | `test:e2e`         | End-to-end tests              |
| 6    | `housekeeping`     | Package.json consistency      |
| 7    | Git diff           | Generated files current       |
| 8    | `ci:adapter-gates` | N2 contract integrity         |

### Workflow Triggers

```yaml
# Run on push to main
on:
  push:
    branches: ['main']

# Run on PR
on:
  pull_request:
    types: [opened, synchronize]

# Run daily
on:
  schedule:
    - cron: '0 2 * * *'

# Manual trigger
on:
  workflow_dispatch:
```
