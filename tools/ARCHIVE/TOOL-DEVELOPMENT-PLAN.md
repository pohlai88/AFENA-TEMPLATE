# AFENDA-NEXUS Tools Development Plan

**Created**: February 17, 2026\
**Last Updated**: February 17, 2026\
**Timeline**: 8 Weeks (Q1 2026)\
**Team Size**: 2-3 developers\
**Focus**: Enhance existing tools ecosystem with production-grade features

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Current State Assessment](#current-state-assessment)
- [Development Priorities](#development-priorities)
- [Sprint Plan](#sprint-plan)
- [Technical Specifications](#technical-specifications)
- [Success Metrics](#success-metrics)
- [Risk Assessment](#risk-assessment)

---

## Executive Summary

### Context

AFENDA-NEXUS has a **mature tools ecosystem** with:

- **afenda-cli**: 20+ commands for metadata, README generation, housekeeping
- **quality-metrics**: File-based metrics collection and analysis
- **CI/CD**: Comprehensive GitHub Actions workflows
- **Renovate**: Automated dependency management

### Goals

Enhance the existing tools with **4 production-grade features**:

1. ✅ **Database-Backed Metrics** - Persist quality metrics to PostgreSQL for
   historical tracking
2. ✅ **Security Scanning** - Integrate Snyk/npm audit for vulnerability
   detection
3. ✅ **Quality Gates** - Block PRs that fail quality thresholds
4. ✅ **Enhanced Dashboard** - Interactive Next.js dashboard with charts and
   trends

### Success Criteria

- ✅ 100% of quality metrics stored in database with 90+ day retention
- ✅ Security scans run on every PR with auto-comment
- ✅ Quality gates block PRs with coverage drop >2%
- ✅ Dashboard accessible at `/quality` with real-time updates
- ✅ Zero downtime during rollout

---

## Current State Assessment

### ✅ What's Working (Already Implemented)

#### 1. **afenda-cli** (`tools/afenda-cli/`)

**Status**: ✅ Production-ready, 20+ commands

| Command                    | Purpose                               | Output                                             |
| -------------------------- | ------------------------------------- | -------------------------------------------------- |
| `pnpm afenda meta gen`     | Generate capability documentation     | `.afenda/capability.ledger.json`, Mermaid diagrams |
| `pnpm afenda meta check`   | Validate metadata quality             | CLI report + exit code                             |
| `pnpm afenda readme gen`   | Generate package READMEs              | Auto-generated README.md files                     |
| `pnpm afenda housekeeping` | Run invariant checks (E1-E7, H00-H02) | Pass/fail report                                   |
| `pnpm afenda bundle`       | Run all maintenance tasks             | Consolidated report                                |
| `pnpm afenda tools-docs`   | Generate tools documentation          | Updated docs/                                      |

**Architecture**:

- Commander.js-based CLI
- Flat feature-based structure (`src/core/`, `src/readme/`, `src/capability/`)
- Report system with ReportBuilder
- TypeScript + ESLint + Vitest

#### 2. **quality-metrics** (`tools/quality-metrics/`)

**Status**: ✅ Working, file-based storage

| Script                                      | Purpose             | Output                             |
| ------------------------------------------- | ------------------- | ---------------------------------- |
| `pnpm --filter quality-metrics collect`     | Collect metrics     | `.quality-metrics/snapshot-*.json` |
| `pnpm --filter quality-metrics analyze`     | Analyze trends      | `.quality-metrics/analysis.md`     |
| `pnpm --filter quality-metrics flakiness`   | Detect flaky tests  | Flakiness report                   |
| `pnpm --filter quality-metrics performance` | Track performance   | Performance regression detection   |
| `pnpm --filter quality-metrics insights`    | AI-powered insights | Recommendations                    |

**Current Metrics**:

- Test coverage (lines, functions, statements, branches)
- Build times
- TypeScript errors
- ESLint warnings/errors
- Git metrics (commit count, contributors)
- Package-level metrics

**Storage**: JSON files in `.quality-metrics/` directory

#### 3. **CI/CD Workflows** (`.github/workflows/`)

**Status**: ✅ Comprehensive automation

| Workflow              | Trigger                | Purpose                                 |
| --------------------- | ---------------------- | --------------------------------------- |
| `ci.yml`              | Push/PR                | Build, test, lint, type-check, coverage |
| `quality-metrics.yml` | Daily 2AM UTC, PR      | Collect and analyze metrics             |
| `sbom.yml`            | Weekly Monday, release | Generate SBOM with CycloneDX            |

**Features**:

- Codecov integration for coverage reports
- PR comments with coverage summary (lcov-reporter-action)
- Database schema validation
- Adapter contract validation
- Auto-artifact upload

#### 4. **Renovate** (`renovate.json5`)

**Status**: ✅ Configured for weekly updates

- Weekly Monday 8AM (Asia/Kuala_Lumpur)
- Auto-merge for patch devDependencies
- Security vulnerability alerts
- Lockfile maintenance

#### 5. **Database Infrastructure** (`packages/database/`)

**Status**: ✅ Drizzle ORM with PostgreSQL (Neon serverless)

- 170+ schema tables
- `meta_quality_checks` table exists (for future use)
- Schema linting and drift checking
- `db` (read-write) and `dbRo` (read-only) exports

### ⚠️ What Needs Enhancement

#### 1. **Metrics Persistence**

**Current**: JSON files in `.quality-metrics/`\
**Issue**: No historical trend queries, manual cleanup, no dashboard data
source\
**Need**: Database-backed storage with retention policy

#### 2. **Security Scanning**

**Current**: Minimal (`pnpm audit` only)\
**Issue**: No PR comments, no Snyk integration, no SBOM vulnerability scanning\
**Need**: Automated security workflow with PR feedback

#### 3. **Quality Gates**

**Current**: CI checks run but don't enforce thresholds\
**Issue**: Bad PRs can merge if coverage drops or errors increase\
**Need**: Automated PR blocking based on quality metrics

#### 4. **Quality Dashboard**

**Current**: Static HTML reports in `.quality-metrics/`\
**Issue**: No real-time updates, no interactive charts, not accessible to team\
**Need**: Live Next.js dashboard at `/quality`

---

## Development Priorities

### P1: Critical (Must-Have)

1. **Database-Backed Metrics** - Foundation for all other features
2. **Quality Gates** - Prevent quality regression

### P2: High-Value (Should-Have)

3. **Enhanced Dashboard** - Team visibility and insights
4. **Security Scanning** - Compliance and vulnerability management

### P3: Nice-to-Have (Could-Have)

5. Performance benchmarking suite
6. Changelog automation
7. Advanced visualizations (dependency graphs, heatmaps)

---

## Sprint Plan

### Sprint 0: Foundation (Week 1)

**Goal**: Database schema and metrics persistence

#### Database Schema Design

Create new tables in `packages/database/src/schema/`:

```typescript
// packages/database/src/schema/quality-snapshots.ts
import {
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const qualitySnapshots = pgTable("quality_snapshots", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  orgId: text("org_id").notNull().default(sql`(auth.require_org_id())`),

  // Git context
  gitSha: text("git_sha").notNull(),
  gitBranch: text("git_branch").notNull(),
  gitAuthor: text("git_author"),
  gitCommitMessage: text("git_commit_message"),

  // Coverage metrics
  coverageLines: decimal("coverage_lines", { precision: 5, scale: 2 }),
  coverageFunctions: decimal("coverage_functions", { precision: 5, scale: 2 }),
  coverageStatements: decimal("coverage_statements", {
    precision: 5,
    scale: 2,
  }),
  coverageBranches: decimal("coverage_branches", { precision: 5, scale: 2 }),

  // Quality metrics
  typeErrors: integer("type_errors").default(0),
  lintErrors: integer("lint_errors").default(0),
  lintWarnings: integer("lint_warnings").default(0),

  // Build metrics
  buildTimeMs: integer("build_time_ms"),
  bundleSizeBytes: integer("bundle_size_bytes"),

  // Test metrics
  testCount: integer("test_count"),
  testPassCount: integer("test_pass_count"),
  testFailCount: integer("test_fail_count"),
  testDurationMs: integer("test_duration_ms"),

  // Full data
  metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
    .defaultNow(),
});

// packages/database/src/schema/quality-package-metrics.ts
export const qualityPackageMetrics = pgTable("quality_package_metrics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  snapshotId: uuid("snapshot_id").notNull().references(
    () => qualitySnapshots.id,
    { onDelete: "cascade" },
  ),

  packageName: text("package_name").notNull(),
  coverage: decimal("coverage", { precision: 5, scale: 2 }),
  complexityAvg: decimal("complexity_avg", { precision: 5, scale: 2 }),
  testCount: integer("test_count"),
  fileCount: integer("file_count"),
  lineCount: integer("line_count"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
    .defaultNow(),
});
```

#### Migration Steps

1. **Create schema files** (above)
2. **Generate migration**:
   ```bash
   pnpm --filter afenda-database db:generate
   ```
3. **Apply migration**:
   ```bash
   pnpm --filter afenda-database db:push
   ```
4. **Update barrel export** in `packages/database/src/schema/index.ts`

#### Update Metrics Collection

Modify `tools/quality-metrics/src/collect.ts`:

```typescript
import { db } from "afenda-database";
import { qualityPackageMetrics, qualitySnapshots } from "afenda-database";
import { execSync } from "child_process";
import fs from "fs";

async function collectMetrics() {
  // Get git context
  const gitSha = execSync("git rev-parse HEAD").toString().trim();
  const gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString()
    .trim();
  const gitAuthor = execSync('git log -1 --format="%an"').toString().trim();
  const gitCommitMessage = execSync('git log -1 --format="%s"').toString()
    .trim();

  // Run existing metrics collection
  execSync("pnpm test:coverage --json > /tmp/coverage.json");
  execSync("pnpm type-check --json > /tmp/typecheck.json");
  execSync("pnpm lint --format=json > /tmp/lint.json");

  const coverage = JSON.parse(fs.readFileSync("/tmp/coverage.json", "utf8"));
  const typecheck = JSON.parse(fs.readFileSync("/tmp/typecheck.json", "utf8"));
  const lint = JSON.parse(fs.readFileSync("/tmp/lint.json", "utf8"));

  // Insert snapshot
  const [snapshot] = await db.insert(qualitySnapshots).values({
    gitSha,
    gitBranch,
    gitAuthor,
    gitCommitMessage,
    coverageLines: coverage.total?.lines?.pct?.toString(),
    coverageFunctions: coverage.total?.functions?.pct?.toString(),
    coverageStatements: coverage.total?.statements?.pct?.toString(),
    coverageBranches: coverage.total?.branches?.pct?.toString(),
    typeErrors: typecheck.errors?.length || 0,
    lintErrors: lint.errorCount || 0,
    lintWarnings: lint.warningCount || 0,
    metadata: { coverage, typecheck, lint },
  }).returning();

  // Insert package metrics
  if (coverage.packages) {
    await db.insert(qualityPackageMetrics).values(
      Object.entries(coverage.packages).map(([name, data]: [string, any]) => ({
        snapshotId: snapshot.id,
        packageName: name,
        coverage: data.lines?.pct?.toString(),
        testCount: data.tests,
        fileCount: data.files,
        lineCount: data.lines?.total,
      })),
    );
  }

  console.log(`✅ Metrics collected: snapshot ${snapshot.id}`);
}

collectMetrics().catch(console.error);
```

#### Tasks

- [ ] Create `quality-snapshots.ts` schema
- [ ] Create `quality-package-metrics.ts` schema
- [ ] Generate and apply migration
- [ ] Update `collect.ts` to insert to database
- [ ] Test metrics collection locally
- [ ] Update CI workflow to use new collection script
- [ ] Add retention policy (90 days via cron job)

**Definition of Done**:

- ✅ Database tables created and migrated
- ✅ Metrics collection writes to database
- ✅ CI workflow runs successfully
- ✅ 90-day retention policy documented

---

### Sprint 1: Quality Gates (Week 2)

**Goal**: Automated PR blocking based on quality thresholds

#### Quality Gate Rules

Create `tools/quality-metrics/src/gates.ts`:

```typescript
import { db, dbRo } from "afenda-database";
import { qualitySnapshots } from "afenda-database";
import { desc, eq } from "drizzle-orm";

interface QualityGateConfig {
  minCoverageLines: number;
  minCoverageFunctions: number;
  maxCoverageDropPct: number;
  maxTypeErrors: number;
  maxLintErrors: number;
}

const DEFAULT_CONFIG: QualityGateConfig = {
  minCoverageLines: 80,
  minCoverageFunctions: 80,
  maxCoverageDropPct: 2,
  maxTypeErrors: 0,
  maxLintErrors: 0,
};

export async function checkQualityGates(
  currentSha: string,
  baseBranch = "main",
  config: QualityGateConfig = DEFAULT_CONFIG,
): Promise<{ passed: boolean; violations: string[] }> {
  const violations: string[] = [];

  // Get current snapshot
  const [current] = await dbRo
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitSha, currentSha))
    .limit(1);

  if (!current) {
    throw new Error(`No metrics found for SHA: ${currentSha}`);
  }

  // Get baseline (latest from base branch)
  const [baseline] = await dbRo
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitBranch, baseBranch))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(1);

  // Check absolute thresholds
  if (Number(current.coverageLines) < config.minCoverageLines) {
    violations.push(
      `Coverage lines ${current.coverageLines}% < ${config.minCoverageLines}%`,
    );
  }

  if (Number(current.coverageFunctions) < config.minCoverageFunctions) {
    violations.push(
      `Coverage functions ${current.coverageFunctions}% < ${config.minCoverageFunctions}%`,
    );
  }

  if (current.typeErrors > config.maxTypeErrors) {
    violations.push(
      `Type errors ${current.typeErrors} > ${config.maxTypeErrors}`,
    );
  }

  if (current.lintErrors > config.maxLintErrors) {
    violations.push(
      `Lint errors ${current.lintErrors} > ${config.maxLintErrors}`,
    );
  }

  // Check regression vs baseline
  if (baseline) {
    const coverageDrop = Number(baseline.coverageLines) -
      Number(current.coverageLines);
    if (coverageDrop > config.maxCoverageDropPct) {
      violations.push(
        `Coverage dropped ${
          coverageDrop.toFixed(2)
        }% from baseline (max: ${config.maxCoverageDropPct}%)`,
      );
    }
  }

  return { passed: violations.length === 0, violations };
}
```

#### GitHub Actions Workflow

Create `.github/workflows/quality-gates.yml`:

```yaml
name: Quality Gates

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  quality-check:
    name: Enforce Quality Standards
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests with coverage
        run: pnpm test:coverage

      - name: Collect metrics
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: pnpm --filter quality-metrics collect

      - name: Check quality gates
        id: gates
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pnpm --filter quality-metrics gates \
            --sha=${{ github.event.pull_request.head.sha }} \
            --base-branch=${{ github.event.pull_request.base.ref }} \
            > /tmp/gates-report.txt

          if [ $? -ne 0 ]; then
            echo "gates_passed=false" >> $GITHUB_OUTPUT
          else
            echo "gates_passed=true" >> $GITHUB_OUTPUT
          fi

      - name: Post PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('/tmp/gates-report.txt', 'utf8');
            const gatesPassed = '${{ steps.gates.outputs.gates_passed }}' === 'true';

            const emoji = gatesPassed ? '✅' : '❌';
            const status = gatesPassed ? 'PASSED' : 'FAILED';

            const body = `## ${emoji} Quality Gates ${status}\n\n${report}`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });

      - name: Fail if gates not passed
        if: steps.gates.outputs.gates_passed == 'false'
        run: exit 1
```

#### CLI Command

Add to `tools/quality-metrics/package.json`:

```json
{
  "scripts": {
    "gates": "tsx src/gates.ts"
  }
}
```

Create `tools/quality-metrics/src/gates-cli.ts`:

```typescript
import { checkQualityGates } from "./gates";

async function main() {
  const args = process.argv.slice(2);
  const sha = args.find((a) => a.startsWith("--sha="))?.split("=")[1];
  const baseBranch =
    args.find((a) => a.startsWith("--base-branch="))?.split("=")[1] || "main";

  if (!sha) {
    console.error("❌ Missing --sha argument");
    process.exit(1);
  }

  const result = await checkQualityGates(sha, baseBranch);

  if (result.passed) {
    console.log("✅ All quality gates passed!");
    process.exit(0);
  } else {
    console.log("❌ Quality gates failed:\n");
    result.violations.forEach((v) => console.log(`  • ${v}`));
    process.exit(1);
  }
}

main();
```

#### Tasks

- [ ] Create `gates.ts` with quality check logic
- [ ] Create `gates-cli.ts` command
- [ ] Create `.github/workflows/quality-gates.yml`
- [ ] Test locally with different scenarios
- [ ] Configure thresholds in `renovate.json5` or `.quality-gates.json`
- [ ] Test on PR
- [ ] Document gate configuration

**Definition of Done**:

- ✅ PRs blocked if coverage drops >2%
- ✅ PRs blocked if type errors > 0
- ✅ PR comments show quality gate results
- ✅ Configuration documented

---

### Sprint 2: Security Scanning (Week 3)

**Goal**: Automated vulnerability scanning with PR feedback

#### Snyk Integration

Create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main]
  schedule:
    - cron: "0 3 * * 1" # Weekly Monday 3AM UTC

jobs:
  snyk-scan:
    name: Snyk Security Scan
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      security-events: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --json-file-output=snyk-results.json
        continue-on-error: true

      - name: Upload Snyk results to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk-results.json

      - name: Post PR comment
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('snyk-results.json', 'utf8'));

            const high = results.vulnerabilities?.filter(v => v.severity === 'high').length || 0;
            const medium = results.vulnerabilities?.filter(v => v.severity === 'medium').length || 0;
            const low = results.vulnerabilities?.filter(v => v.severity === 'low').length || 0;

            const emoji = high > 0 ? '🔴' : medium > 0 ? '🟡' : '✅';

            const body = `## ${emoji} Security Scan Results\n\n` +
              `- 🔴 High: ${high}\n` +
              `- 🟡 Medium: ${medium}\n` +
              `- 🔵 Low: ${low}\n\n` +
              `[View detailed report in Security tab](https://github.com/${context.repo.owner}/${context.repo.repo}/security/code-scanning)`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });

  npm-audit:
    name: NPM Audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run npm audit
        run: pnpm audit --audit-level=moderate --json > audit-results.json
        continue-on-error: true

      - name: Post audit summary
        if: github.event_name == 'pull_request'
        run: |
          pnpm audit --audit-level=moderate || echo "✅ No moderate+ vulnerabilities found"
```

#### SBOM Vulnerability Scanning

Update `.github/workflows/sbom.yml`:

```yaml
# Add vulnerability scanning step
- name: Scan SBOM for vulnerabilities
  run: |
    pnpm dlx @cyclonedx/cdxgen -r --no-install-deps -o sbom.json
    # Use Grype or similar to scan SBOM
    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin
    grype sbom:sbom.json --output json > sbom-vulnerabilities.json

- name: Upload vulnerability report
  uses: actions/upload-artifact@v4
  with:
    name: sbom-vulnerabilities-${{ github.sha }}
    path: sbom-vulnerabilities.json
```

#### Tasks

- [ ] Set up Snyk account and get API token
- [ ] Add `SNYK_TOKEN` to GitHub secrets
- [ ] Create `security.yml` workflow
- [ ] Enable GitHub Code Scanning
- [ ] Update SBOM workflow with vulnerability scanning
- [ ] Test on PR with known vulnerable package
- [ ] Configure severity thresholds
- [ ] Document security scanning process

**Definition of Done**:

- ✅ Snyk runs on every PR
- ✅ High-severity vulnerabilities block PRs
- ✅ Security tab shows vulnerabilities
- ✅ PR comments include security summary
- ✅ Weekly security scans scheduled
- ✅ SBOM includes vulnerability data

---

### Sprint 3: Enhanced Dashboard (Weeks 4-5)

**Goal**: Interactive quality dashboard at `/quality`

#### API Routes

Create `apps/web/app/api/quality/metrics/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { dbRo } from "afenda-database";
import { qualityPackageMetrics, qualitySnapshots } from "afenda-database";
import { desc, eq, gte, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get("branch") || "main";
  const limit = parseInt(searchParams.get("limit") || "30");
  const days = parseInt(searchParams.get("days") || "30");

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Query snapshots
  const snapshots = await dbRo
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitBranch, branch))
    .where(gte(qualitySnapshots.createdAt, cutoffDate))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(limit);

  // Fetch related packages
  const snapshotIds = snapshots.map((s) => s.id);
  const packages = snapshotIds.length > 0
    ? await dbRo.select().from(qualityPackageMetrics).where(
      inArray(qualityPackageMetrics.snapshotId, snapshotIds),
    )
    : [];

  // Group packages by snapshot
  const snapshotsWithPackages = snapshots.map((snapshot) => ({
    ...snapshot,
    packages: packages.filter((p) => p.snapshotId === snapshot.id),
  }));

  return NextResponse.json({ snapshots: snapshotsWithPackages });
}
```

Create `apps/web/app/api/quality/latest/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { dbRo } from "afenda-database";
import { qualityPackageMetrics, qualitySnapshots } from "afenda-database";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  // Get latest snapshot
  const [snapshot] = await dbRo
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitBranch, "main"))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(1);

  if (!snapshot) {
    return NextResponse.json({ snapshot: null });
  }

  // Get related packages
  const packages = await dbRo
    .select()
    .from(qualityPackageMetrics)
    .where(eq(qualityPackageMetrics.snapshotId, snapshot.id));

  return NextResponse.json({ snapshot: { ...snapshot, packages } });
}
```

#### Dashboard Page

Create `apps/web/app/quality/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "afenda-ui/components/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Snapshot {
  id: string;
  gitSha: string;
  gitBranch: string;
  coverageLines: string;
  typeErrors: number;
  lintErrors: number;
  createdAt: string;
}

export default function QualityDashboard() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [latest, setLatest] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [snapshotsRes, latestRes] = await Promise.all([
        fetch("/api/quality/metrics?limit=30"),
        fetch("/api/quality/latest"),
      ]);

      const snapshotsData = await snapshotsRes.json();
      const latestData = await latestRes.json();

      setSnapshots(snapshotsData.snapshots || []);
      setLatest(latestData.snapshot);
      setLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  const chartData = snapshots.reverse().map((s) => ({
    date: new Date(s.createdAt).toLocaleDateString(),
    coverage: parseFloat(s.coverageLines),
    errors: s.typeErrors + s.lintErrors,
  }));

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Quality Dashboard</h1>

      {/* Current Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latest?.coverageLines}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latest?.typeErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lint Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latest?.lintErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest SHA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">
              {latest?.gitSha.slice(0, 7)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Coverage Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coverage" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Errors Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Errors Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Dependencies

Add to `apps/web/package.json`:

```json
{
  "dependencies": {
    "recharts": "^2.10.4"
  }
}
```

#### Tasks

- [ ] Create API routes (`/api/quality/metrics`, `/api/quality/latest`)
- [ ] Create dashboard page at `/quality`
- [ ] Install recharts
- [ ] Add navigation link to dashboard
- [ ] Implement real-time refresh (30s interval)
- [ ] Add package drill-down view
- [ ] Add date range filter
- [ ] Add branch selector
- [ ] Test dashboard with sample data
- [ ] Add E2E tests for dashboard

**Definition of Done**:

- ✅ Dashboard accessible at `/quality`
- ✅ Charts render correctly
- ✅ Real-time updates every 30s
- ✅ Mobile-responsive
- ✅ E2E tests passing
- ✅ Documentation updated

---

### Sprint 4: Polish & Documentation (Week 6)

**Goal**: Production readiness, documentation, and team training

#### Documentation Updates

Update `tools/README.md`:

````markdown
## Quality Metrics & Dashboard

### Database-Backed Metrics

All quality metrics are now persisted to PostgreSQL for historical analysis.

**Schema**:

- `quality_snapshots` - Git SHA, coverage, errors, build metrics
- `quality_package_metrics` - Per-package metrics

**Retention**: 90 days (automated cleanup via cron)

### Collecting Metrics

```bash
# Collect current metrics
pnpm --filter quality-metrics collect

# View latest snapshot
psql $DATABASE_URL -c "SELECT * FROM quality_snapshots ORDER BY created_at DESC LIMIT 1"
```
````

### Quality Gates

Quality gates run on every PR and enforce:

- Minimum 80% line coverage
- Maximum 2% coverage drop from baseline
- Zero type errors
- Zero lint errors

**Configuration**: `.quality-gates.json`

```json
{
  "minCoverageLines": 80,
  "maxCoverageDropPct": 2,
  "maxTypeErrors": 0,
  "maxLintErrors": 0
}
```

### Security Scanning

**Snyk** runs on every PR:

- Checks for high/medium/low vulnerabilities
- Blocks PRs with high-severity issues
- Posts comments with security summary

**SBOM Scanning**:

- Weekly generation of CycloneDX SBOM
- Vulnerability scanning with Grype
- Uploaded to GitHub artifacts

### Quality Dashboard

Access the live dashboard at `/quality` (requires authentication).

**Features**:

- Current metrics (coverage, errors, build time)
- 30-day trend charts
- Package drill-down
- Real-time updates (30s refresh)
- Branch comparison

````
#### Training Materials

Create `tools/docs/QUALITY-DASHBOARD-GUIDE.md`:

```markdown
# Quality Dashboard User Guide

## Accessing the Dashboard

1. Navigate to `/quality` in your browser
2. Log in with your organization credentials
3. Dashboard auto-refreshes every 30 seconds

## Understanding Metrics

### Coverage
- **Lines**: % of lines executed by tests
- **Functions**: % of functions called by tests
- **Statements**: % of statements executed
- **Branches**: % of conditional branches tested

**Target**: 80%+ for all metrics

### Errors
- **Type Errors**: TypeScript compilation errors (Target: 0)
- **Lint Errors**: ESLint errors (Target: 0)
- **Lint Warnings**: ESLint warnings (Best effort to minimize)

### Build Metrics
- **Build Time**: Total build duration (Track trends)
- **Bundle Size**: Output bundle size (Monitor for regressions)

## Common Workflows

### Check PR Quality
1. Open PR
2. Wait for quality gates to run
3. Review PR comment for pass/fail
4. If failed, check dashboard for details
5. Fix issues and push again

### Monitor Team Progress
1. View 30-day trend charts
2. Identify areas needing attention
3. Drill down to package-level metrics
4. Share insights with team

### Debug Failing Tests
1. Check flakiness report
2. Review test duration trends
3. Identify slow/flaky tests
4. Prioritize fixes
````

#### Tasks

- [ ] Update all documentation (README, GUIDE, START_HERE)
- [ ] Create quality dashboard user guide
- [ ] Create quality gates configuration guide
- [ ] Create security scanning guide
- [ ] Create video walkthrough (5 min)
- [ ] Conduct team training session
- [ ] Create FAQ document
- [ ] Update CHANGELOG.md
- [ ] Create release notes

**Definition of Done**:

- ✅ All documentation updated
- ✅ User guides published
- ✅ Team trained (>80% attendance)
- ✅ FAQ covers common questions
- ✅ Release notes prepared

---

### Sprint 5: Advanced Features (Weeks 7-8)

**Goal**: Performance benchmarking, changelog automation, advanced
visualizations

#### Performance Benchmarking

Enhance `tools/quality-metrics/src/performance.ts`:

```typescript
import { db } from "afenda-database";
import { qualitySnapshots } from "afenda-database";
import { desc, eq } from "drizzle-orm";

interface PerformanceBenchmark {
  name: string;
  duration: number;
  memory: number;
  timestamp: Date;
}

export async function detectRegressions(branch = "main", threshold = 1.2) {
  // Get last 10 snapshots
  const snapshots = await db
    .select()
    .from(qualitySnapshots)
    .where(eq(qualitySnapshots.gitBranch, branch))
    .orderBy(desc(qualitySnapshots.createdAt))
    .limit(10);

  if (snapshots.length < 2) return { regressions: [] };

  const latest = snapshots[0];
  const baseline = snapshots.slice(1).reduce((acc, s) => ({
    buildTimeMs: acc.buildTimeMs + (s.buildTimeMs || 0),
    count: acc.count + 1,
  }), { buildTimeMs: 0, count: 0 });

  const avgBuildTime = baseline.buildTimeMs / baseline.count;
  const regressions = [];

  if (latest.buildTimeMs && latest.buildTimeMs > avgBuildTime * threshold) {
    regressions.push({
      metric: "buildTimeMs",
      current: latest.buildTimeMs,
      baseline: avgBuildTime,
      increase: ((latest.buildTimeMs - avgBuildTime) / avgBuildTime * 100)
        .toFixed(2),
    });
  }

  return { regressions };
}
```

#### Changelog Automation

Create `tools/scripts/generate-changelog.ts`:

```typescript
import { execSync } from "child_process";
import fs from "fs";

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

function getCommitsSince(since: string): Commit[] {
  const output = execSync(
    `git log ${since}..HEAD --format="%H|%s|%an|%ad" --date=short`,
  ).toString();

  return output.split("\n").filter(Boolean).map((line) => {
    const [sha, message, author, date] = line.split("|");
    return { sha, message, author, date };
  });
}

function categorizeCommit(message: string): string {
  if (message.startsWith("feat:")) return "Features";
  if (message.startsWith("fix:")) return "Bug Fixes";
  if (message.startsWith("docs:")) return "Documentation";
  if (message.startsWith("perf:")) return "Performance";
  if (message.startsWith("refactor:")) return "Refactoring";
  if (message.startsWith("test:")) return "Tests";
  if (message.startsWith("chore:")) return "Chores";
  return "Other";
}

function generateChangelog(version: string, since: string) {
  const commits = getCommitsSince(since);
  const categorized: Record<string, Commit[]> = {};

  commits.forEach((commit) => {
    const category = categorizeCommit(commit.message);
    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(commit);
  });

  let changelog = `## ${version} (${
    new Date().toISOString().split("T")[0]
  })\n\n`;

  Object.entries(categorized).forEach(([category, commits]) => {
    changelog += `### ${category}\n\n`;
    commits.forEach((commit) => {
      const cleanMessage = commit.message.replace(
        /^(feat|fix|docs|perf|refactor|test|chore):\s*/,
        "",
      );
      changelog += `- ${cleanMessage} (${commit.sha.slice(0, 7)})\n`;
    });
    changelog += "\n";
  });

  return changelog;
}

// Usage
const version = process.argv[2] || "Unreleased";
const since = process.argv[3] || "v1.0.0";
const changelog = generateChangelog(version, since);

console.log(changelog);
fs.writeFileSync("CHANGELOG-GENERATED.md", changelog);
```

#### Dependency Graph Visualization

Create `apps/web/app/tools/dependencies/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactFlow = dynamic(() => import("reactflow"), { ssr: false });

export default function DependencyGraph() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    async function fetchGraph() {
      const res = await fetch("/api/tools/dependency-graph");
      const data = await res.json();
      setNodes(data.nodes);
      setEdges(data.edges);
    }
    fetchGraph();
  }, []);

  return (
    <div className="h-screen">
      <h1 className="text-2xl font-bold p-4">Dependency Graph</h1>
      <div className="h-full">
        <ReactFlow nodes={nodes} edges={edges} />
      </div>
    </div>
  );
}
```

#### Tasks

- [ ] Implement performance regression detection
- [ ] Create changelog automation script
- [ ] Add dependency graph visualization
- [ ] Create coverage heatmap
- [ ] Add package complexity visualization
- [ ] Implement automated release notes
- [ ] Add performance dashboard
- [ ] Test all advanced features

**Definition of Done**:

- ✅ Performance regressions detected and reported
- ✅ Changelog auto-generated from commits
- ✅ Dependency graph interactive
- ✅ Advanced visualizations working
- ✅ Documentation updated

---

## Technical Specifications

### Database Schema

**Tables**:

- `quality_snapshots` - Main metrics table
- `quality_package_metrics` - Per-package metrics

**Indexes**:

```sql
CREATE INDEX idx_quality_snapshots_branch_created ON quality_snapshots(git_branch, created_at DESC);
CREATE INDEX idx_quality_snapshots_sha ON quality_snapshots(git_sha);
CREATE INDEX idx_quality_package_metrics_snapshot ON quality_package_metrics(snapshot_id);
```

**Retention Policy**:

```sql
-- Delete snapshots older than 90 days
DELETE FROM quality_snapshots WHERE created_at < NOW() - INTERVAL '90 days';
```

### API Endpoints

| Endpoint                | Method | Purpose                     |
| ----------------------- | ------ | --------------------------- |
| `/api/quality/metrics`  | GET    | List snapshots with filters |
| `/api/quality/latest`   | GET    | Get latest snapshot         |
| `/api/quality/trends`   | GET    | Get trend data              |
| `/api/quality/packages` | GET    | Package-level metrics       |

### CLI Commands

| Command                                     | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| `pnpm --filter quality-metrics collect`     | Collect and persist metrics    |
| `pnpm --filter quality-metrics analyze`     | Analyze trends                 |
| `pnpm --filter quality-metrics gates`       | Check quality gates            |
| `pnpm --filter quality-metrics performance` | Detect performance regressions |

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
SNYK_TOKEN=...

# Optional
QUALITY_GATE_MIN_COVERAGE=80
QUALITY_GATE_MAX_DROP=2
QUALITY_RETENTION_DAYS=90
```

---

## Success Metrics

### Quantitative

- ✅ **100% metrics persistence** - All metrics stored in database
- ✅ **90-day retention** - Historical data available
- ✅ **<5 min CI time** - Quality gates run fast
- ✅ **Zero false positives** - Quality gates accurate
- ✅ **>80% dashboard adoption** - Team uses dashboard weekly
- ✅ **100% security scan coverage** - All PRs scanned

### Qualitative

- ✅ Team finds dashboard useful
- ✅ Quality gates improve code quality
- ✅ Security posture improved
- ✅ Documentation comprehensive
- ✅ Onboarding time reduced

---

## Risk Assessment

### Technical Risks

| Risk                         | Probability | Impact | Mitigation                                     |
| ---------------------------- | ----------- | ------ | ---------------------------------------------- |
| Database migration issues    | Medium      | High   | Test migrations thoroughly, have rollback plan |
| Performance impact on CI     | Medium      | Medium | Optimize queries, use indexes, cache results   |
| False positive quality gates | Low         | High   | Start with lenient thresholds, tune over time  |
| Snyk integration issues      | Low         | Low    | Fallback to npm audit only                     |

### Operational Risks

| Risk                     | Probability | Impact | Mitigation                                     |
| ------------------------ | ----------- | ------ | ---------------------------------------------- |
| Team resistance to gates | Medium      | Medium | Gradual rollout, clear communication, training |
| Dashboard downtime       | Low         | Low    | Monitor uptime, have fallback to JSON reports  |
| Data retention issues    | Low         | Medium | Automated cleanup, monitoring                  |

---

## Rollout Plan

### Phase 1: Foundation (Weeks 1-2)

- [ ] Deploy database schema
- [ ] Update metrics collection
- [ ] Test locally and in staging

### Phase 2: Quality Gates (Weeks 2-3)

- [ ] Deploy quality gates workflow
- [ ] Enable for non-production branches first
- [ ] Monitor false positives
- [ ] Enable for main branch after tuning

### Phase 3: Security & Dashboard (Weeks 3-5)

- [ ] Deploy security scanning
- [ ] Deploy quality dashboard
- [ ] Train team
- [ ] Gather feedback

### Phase 4: Polish & Advanced Features (Weeks 6-8)

- [ ] Implement advanced features
- [ ] Update all documentation
- [ ] Final training session
- [ ] Go-live announcement

---

## Maintenance & Support

### Ongoing Tasks

**Weekly**:

- Review quality gate failures
- Check security scan results
- Monitor dashboard usage

**Monthly**:

- Review quality trends
- Update thresholds if needed
- Review retention policy

**Quarterly**:

- Audit database performance
- Review and update documentation
- Team satisfaction survey

### Support Resources

- **Documentation**: `tools/README.md`, user guides
- **Training**: Video walkthrough, live sessions
- **Support**: GitHub Issues, team Slack channel

---

**Last Updated**: February 17, 2026\
**Owner**: AFENDA-NEXUS Tools Team\
**Next Review**: End of Sprint 2 (Week 3)
