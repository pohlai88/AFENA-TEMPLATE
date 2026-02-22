# AFENDA-NEXUS Tools

> **Enterprise Development Tooling** - Unified development and maintenance
> utilities for the AFENDA-NEXUS monorepo

[![Monorepo](https://img.shields.io/badge/monorepo-pnpm-yellow)](https://pnpm.io/)
[![CLI](https://img.shields.io/badge/CLI-Commander.js-green)](https://github.com/tj/commander.js/)
[![Auto-Generated](https://img.shields.io/badge/docs-auto--generated-blue)](.)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Directory Structure](#directory-structure)
- [Core Tools](#core-tools)
- [Command Reference](#command-reference)
- [Architecture](#architecture)
- [Development Guide](#development-guide)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

---

## Overview

The `tools/` directory consolidates all development and maintenance utilities
for the AFENDA-NEXUS monorepo. It provides a unified CLI interface (`afenda`)
for code generation, validation, documentation, and quality assurance.

### Key Features

✅ **Unified CLI** - Single command interface for all tooling\
✅ **Auto-Documentation** - Self-documenting with auto-generated READMEs\
✅ **Quality Metrics** - Real-time code quality tracking and analysis\
✅ **Capability Governance** - Truth ledger for system capabilities\
✅ **Invariant Enforcement** - Automated code quality checks (E1-E7, H00-H02)\
✅ **Bundle Maintenance** - One-command monorepo maintenance

### Quick Stats

- **3 Core Tools** - afenda-cli, quality-metrics, scripts
- **20+ Commands** - Full-featured CLI toolkit
- **Auto-Generated Docs** - Always up-to-date documentation
- **CI-Integrated** - Automated quality checks in GitHub Actions

---

## Quick Start

### Prerequisites

```bash
# Ensure you're in the monorepo root
cd AFENDA-NEXUS

# Install dependencies
pnpm install
```

### Essential Commands

```bash
# Run all maintenance tasks (bundle)
pnpm bundle                      # Production mode
pnpm bundle:dry                  # Dry-run mode (preview)

# Generate documentation
pnpm afenda readme gen            # Generate all READMEs
pnpm afenda tools-docs            # Generate tools documentation

# Quality checks
pnpm afenda housekeeping          # Run invariant checks
pnpm afenda meta check            # Validate capability metadata

# Metrics collection
pnpm --filter quality-metrics collect    # Collect quality metrics
pnpm --filter quality-metrics analyze    # Analyze trends
```

### First-Time Setup

1. **Generate all documentation**:

   ```bash
   pnpm afenda readme gen
   pnpm afenda tools-docs
   ```

2. **Verify quality baselines**:

   ```bash
   pnpm afenda housekeeping
   pnpm --filter quality-metrics collect
   ```

3. **Review generated outputs**:
   - `.afenda/` - Capability ledger, matrix, manifest
   - `.agents/context/capability-map.md` - AI agent context
   - `packages/*/README.md` - Auto-generated package READMEs
   - `.quality-metrics/` - Quality metrics reports

---

## 🎯 Sprint 6: Developer Experience & Integration

**New in Sprint 6** - Enhanced GitHub integration, plugin system, team notifications, and advanced analytics!

### Enhanced GitHub Integration

Generate rich PR comments with visual charts, trends, and recommendations:

```bash
# Generate PR comment (in CI/CD)
pnpm quality:pr-comment --sha=abc123 --base=main --output=pr-comment.md

# Generate and update quality badges
pnpm quality:badges:update
```

**PR Comment Features**:

- ✅ Visual trend charts (coverage, build time, errors)
- ✅ Comparison table (current vs baseline)
- ✅ Automated recommendations
- ✅ Status badges
- ✅ Links to dashboard

**Badge Features**:

- Coverage, build time, tests passed, errors, vulnerabilities
- Auto-generated shields.io compatible badges
- Configurable styles: flat, flat-square, for-the-badge

### Quality Metrics Plugin System

**Extensible framework for custom metrics**:

```typescript
// Example plugin: tools/quality-metrics/plugins/custom-metric.ts
import type { QualityPlugin } from '../src/plugin-system.js';

export default {
  name: 'custom-metric',
  version: '1.0.0',

  hooks: {
    async onCollect(context) {
      // Collect custom metrics
      return { myMetric: 42 };
    },

    async onAnalyze(snapshot, data) {
      // Analyze metrics
      return {
        score: 90,
        issues: [],
        recommendations: ['Great job!'],
      };
    },
  },
} satisfies QualityPlugin;
```

**Built-in Plugins**:

- `code-smells` - Detects long functions, deep nesting, magic numbers
- `todo-tracker` - Tracks TODO, FIXME, HACK comments
- `dependency-health` - Analyzes dependency freshness

**Plugin Discovery**: Plugins are auto-discovered from `tools/quality-metrics/plugins/`

### Team Notifications

Send quality alerts to Slack, Discord, or Microsoft Teams:

```bash
# Configure notifications
cp .quality-notifications.example.json .quality-notifications.json
# Edit with your webhook URLs

# Send notification
pnpm quality:notify \
  --severity=critical \
  --title="Quality Gate Failed" \
  --message="Coverage dropped below threshold" \
  --metrics='{"coverage":"82.5%","threshold":"85%"}' \
  --dashboard="https://app.afenda.io/quality"
```

**Supported Channels**:

- ✅ Slack (with rich blocks and action buttons)
- ✅ Discord (with embeds and color coding)
- ✅ Microsoft Teams (with adaptive cards)

**Notification Modes**:

- `realtime` - Immediate alerts on quality changes
- `digest` - Daily summary (configurable time)

**Configuration**:

```json
{
  "enabled": true,
  "mode": "realtime",
  "slack": {
    "webhookUrl": "https://hooks.slack.com/services/...",
    "severity": ["critical", "warning"]
  },
  "discord": {
    "webhookUrl": "https://discord.com/api/webhooks/...",
    "severity": ["critical"]
  }
}
```

### Advanced Analytics

**Complexity Analysis**:

```bash
# Analyze package complexity
pnpm quality:complexity

# Output:
# - Cyclomatic complexity
# - Cognitive complexity
# - Lines of code
# - Maintainability index
# - Refactoring recommendations
```

**Code Churn Analysis**:

```bash
# Analyze code churn (last 90 days)
pnpm quality:churn

# Custom time range
pnpm quality:churn --days=30

# Output:
# - Top churned files
# - Hotspots (high churn + high complexity)
# - Volatility metrics
# - Refactoring priorities
```

**Analytics Dashboard**:

Access the advanced analytics dashboard at `/tools/analytics`:

- **Complexity Tab**: Package complexity metrics and maintainability index
- **Code Churn Tab**: Most frequently changed files
- **Hotspots Tab**: Scatter plot of churn vs complexity
- **Recommendations Tab**: Actionable refactoring recommendations

**Dashboard Features**:

- ✅ Interactive charts (Recharts)
- ✅ Risk-based color coding (red/orange/yellow/green)
- ✅ Package-level metrics
- ✅ File-level hotspot detection
- ✅ Automated recommendations

### CI/CD Integration (Sprint 6)

**Enhanced GitHub Actions Workflow**:

```yaml
# .github/workflows/quality-gates.yml
- name: Generate Rich PR Comment
  run: |
    pnpm quality:pr-comment \
      --sha=${{ github.event.pull_request.head.sha }} \
      --base=${{ github.event.pull_request.base.sha }} \
      --output=pr-comment.md

- name: Post PR Comment
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const comment = fs.readFileSync('pr-comment.md', 'utf8');

      github.rest.issues.createComment({
        ...context.repo,
        issue_number: context.issue.number,
        body: comment
      });

- name: Send Team Notifications
  if: failure()
  run: |
    pnpm quality:notify \
      --severity=critical \
      --title="Quality Gate Failed" \
      --message="PR #${{ github.event.pull_request.number }} failed quality checks"
```

**Auto-Update Badges**:

```yaml
- name: Update Quality Badges
  run: pnpm quality:badges:update

- name: Commit Badge Updates
  run: |
    git add README.md
    git commit -m "chore: update quality badges [skip ci]"
    git push
```

---

## Directory Structure

```
tools/
├── README.md                    # This file - Enterprise tools overview
├── START_HERE.md                # Getting started guide
├── GUIDE.md                     # Development guide
│
├── afenda-cli/                   # 🎯 Unified CLI tool
│   ├── src/
│   │   ├── cli.ts               # Main CLI entry point
│   │   ├── types.ts             # Zod schemas & TypeScript types
│   │   │
│   │   ├── core/                # Core utilities (shared across commands)
│   │   │   ├── exec.ts          # Command execution
│   │   │   ├── logger.ts        # Structured logging
│   │   │   ├── paths.ts         # Path utilities
│   │   │   ├── runner.ts        # Command registry & runner
│   │   │   ├── reporter.ts      # Report generation
│   │   │   ├── report-builder.ts  # Auto report builder
│   │   │   └── report-config.ts   # Report constants (single source of truth)
│   │   │
│   │   ├── readme/              # README generation engine
│   │   │   ├── readme-engine.ts # Main generation engine
│   │   │   ├── analyzer.ts      # Package analysis
│   │   │   ├── templates.ts     # README templates
│   │   │   └── renderer.ts      # Markdown rendering
│   │   │
│   │   ├── capability/          # Capability Truth Ledger
│   │   │   ├── collectors/      # Data collectors
│   │   │   ├── checks/          # VIS-00 through VIS-04
│   │   │   ├── emitters/        # Ledger & matrix generation
│   │   │   └── adapter/         # ERP adapter pipeline
│   │   │
│   │   ├── checks/              # Invariant checks
│   │   │   └── invariants.ts    # E1-E7, H00-H02 checks
│   │   │
│   │   ├── bundle/              # Bundle command
│   │   │   └── command.ts       # Orchestrate all maintenance tasks
│   │   │
│   │   ├── discovery/           # Package/script discovery
│   │   │   ├── scan.ts          # Workspace scanner
│   │   │   └── register.ts      # Registry builder
│   │   │
│   │   └── docs/                # Documentation generation
│   │       └── tools-docs.ts    # Auto-generate tools docs
│   │
│   ├── bin/afenda                # Binary entry point
│   ├── package.json             # Package manifest
│   └── README.md                # Auto-generated README
│
├── ci-ais-benchmark-gate.mjs    # 🎯 AIS Benchmark confidence gate (AIS-01…AIS-06)
├── ci-finance-audit-gate.mjs   # 🎯 Finance Audit confidence gate (FAR-01…FAR-06)
├── ci-ui-gates.mjs             # 🎯 ERP UI architecture gates (UI-ARCH-01…UI-A11Y-01)
├── finance-evidence-pack.mjs   # 📦 Close-period evidence pack assembler
├── finance-audit-docs.mjs      # 📝 Scorecard + dashboard generator
│
├── ci-gates/                    # 🔒 Structural CI gate tests (vitest)
│   ├── far-rls-isolation.test.ts         # RLS tenant isolation on all schema files
│   ├── far-posting-immutability.test.ts  # Posted entries immutability enforcement
│   ├── far-posting-balanced.test.ts      # DR=CR balance-by-construction
│   ├── far-idempotency.test.ts           # Idempotency infrastructure checks
│   ├── far-auditlog-coverage.test.ts     # Audit trail completeness
│   ├── far-migration-lineage.test.ts     # Migration journal integrity
│   ├── fin-01-ledger-id.test.ts          # ledgerId on ledger-impacting intents
│   ├── fin-03-deterministic-replay.test.ts # Deterministic replay in accounting-hub
│   ├── fin-04-idempotent-writes.test.ts  # Idempotency keys on high-severity intents
│   └── no-direct-db.test.ts             # No direct db imports in packages/crud
│
├── quality-metrics/             # 📊 Quality metrics & analysis
│   ├── src/
│   │   ├── collect.ts           # Metrics collection
│   │   ├── analyze.ts           # Trend analysis
│   │   ├── report.ts            # Report generation
│   │   ├── insights.ts          # Automated insights
│   │   └── dashboard.tsx        # Next.js dashboard
│   │
│   ├── .quality-metrics/        # Metrics storage
│   │   ├── history.json         # Historical metrics
│   │   ├── report.md            # Latest markdown report
│   │   ├── report.json          # Latest JSON report
│   │   └── report.html          # Latest HTML report
│   │
│   ├── package.json             # Package manifest
│   └── README.md                # Usage guide
│
└── scripts/                     # 🔧 Utility scripts
    └── validate-deps.ts         # Dependency validation
```

---

## Core Tools

### 1. afenda-cli

**Purpose**: Unified command-line interface for all development operations

**Key Features**:

- **README Generation** - Auto-generate package READMEs with live introspection; includes directory structure (with descriptions and file counts), source layout, and architecture sections for better coverage
- **Capability Governance** - Track and validate system capabilities
- **Metadata Management** - Scan, check, and fix capability metadata
- **Bundle Maintenance** - One-command monorepo maintenance
- **Architecture Docs** - Auto-generate architecture documentation
- **Invariant Checks** - Enforce code quality rules (E1-E7, H00-H02)

**Primary Commands**:

```bash
afenda meta gen              # Generate capability ledger & matrix
afenda meta check            # Validate metadata (VIS-00 to VIS-04)
afenda readme gen            # Generate all READMEs
afenda bundle                # Run all maintenance tasks
afenda housekeeping          # Run invariant checks
```

**Documentation**: [afenda-cli/README.md](./afenda-cli/README.md)

---

### 2. quality-metrics

**Purpose**: Production-grade code quality metrics with database persistence and
interactive dashboard

**Key Features**:

- **Database-Backed Storage** - PostgreSQL persistence with 90-day retention
- **Comprehensive Metrics** - Coverage, build times, errors, TODOs, Git activity
- **Quality Gates** - Automated PR blocking based on configurable thresholds
- **Security Scanning** - npm audit integration with vulnerability detection
- **Interactive Dashboard** - Real-time visualizations with historical trends at
  `/quality`
- **Trend Analysis** - Historical tracking with anomaly detection
- **Multiple Reports** - Markdown, JSON formats for CI/CD integration
- **CI Integration** - Automated quality gates and security scans in GitHub
  Actions

**Primary Commands**:

```bash
# Collect metrics (file + database storage)
pnpm --filter quality-metrics collect
DATABASE_URL="postgresql://..." pnpm --filter quality-metrics collect

# Quality gates (run on PRs)
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)
pnpm --filter quality-metrics gates --config=.quality-gates.json

# Security scanning
pnpm --filter quality-metrics security
pnpm --filter quality-metrics security --fail-moderate

# View dashboard (navigate to /quality)
pnpm dev
```

**API Endpoints**:

- `GET /api/quality/metrics` - Latest quality snapshot
- `GET /api/quality/history?limit=30&days=30` - Historical data with packages
- `GET /api/quality/trends?days=7` - Daily aggregated trends for charts
- `GET /api/quality/compare?sha=abc&base=main` - Compare commits

**Database Schema**:

- `quality_snapshots` - Historical metrics per commit
- `quality_package_metrics` - Per-package drill-down data

**Documentation**: [quality-metrics/README.md](./quality-metrics/README.md),
[QUALITY-GUIDE.md](./QUALITY-GUIDE.md)

**Sprint 5 Advanced Features** (NEW):

- **Performance Regression Detection** - Database-backed regression analysis
- **Changelog Automation** - Generate changelogs from conventional commits
- **Coverage Heatmap** - Visual coverage across all packages at `/tools/advanced`
- **Dependency Graph** - Interactive package dependency visualization at `/tools/dependencies`

**New Commands**:

```bash
# Performance regression detection (CLI)
pnpm quality:performance
pnpm --filter quality-metrics performance --branch=main --threshold=1.2

# Automated changelog generation
pnpm changelog:generate Unreleased v2.0.0
pnpm changelog:update  # Automatically update CHANGELOG.md

# Access visual izations
pnpm dev
# Visit http://localhost:3000/tools/advanced (Coverage Heatmap)
# Visit http://localhost:3000/tools/dependencies (Dependency Graph)
```

**New API Endpoints**:

- `GET /api/quality/coverage-heatmap` - Package-level coverage matrix
- `GET /api/tools/dependency-graph` - Workspace dependency graph data

**Sprint 6: Developer Experience & Integration** (NEW):

**Enhanced GitHub Integration**:

```bash
# Generate rich PR comment with trends and recommendations
pnpm quality:pr-comment \
  --sha=$(git rev-parse HEAD) \
  --base=$(git rev-parse main) \
  --output=pr-comment.md

# Generate and update quality badges in README
pnpm quality:badges          # Preview badges
pnpm quality:badges:update   # Update README with badges

# Send team notifications
pnpm quality:notify --severity=critical
pnpm quality:notify --mode=digest
```

**Plugin System**:

```bash
# Run quality plugins with database integration
pnpm quality:plugins              # Run all plugins
pnpm quality:plugins --plugin=code-smells  # Run specific plugin
pnpm quality:plugins --verbose    # Detailed output
pnpm quality:plugins --no-db      # Skip database save

# Available plugins:
# - code-smells: Detect long functions, deep nesting, magic numbers
# - todo-tracker: Track TODO, FIXME, HACK comments
# - dependency-health: Analyze package dependencies
```

**Plugin Configuration** (`.quality-plugins.json`):

```json
{
  "enabled": true,
  "pluginsDir": "tools/quality-metrics/plugins",
  "timeout": 30000,
  "plugins": {
    "code-smells": {
      "enabled": true,
      "config": {
        "maxFunctionLength": 50,
        "maxNestingLevel": 4,
        "maxParameters": 5
      }
    }
  },
  "database": {
    "enabled": true,
    "savePluginMetrics": true
  }
}
```

**Advanced Analytics Dashboard** (`/tools/analytics`):

- **Complexity Analysis**: Cyclomatic complexity, cognitive complexity, maintainability index
- **Code Churn**: Most frequently changed files with hotspot detection
- **Hotspot Visualization**: Scatter plot of churn vs complexity
- **Actionable Recommendations**: Automated refactoring priorities

```bash
# CLI commands for analytics
pnpm quality:complexity         # Analyze package complexity
pnpm quality:churn             # Analyze code churn (last 90 days)
pnpm quality:churn --days=30   # Custom time range
```

**Self-Hosted Badge API** (`/api/badges/[metric]`):

Available badge endpoints:

- `/api/badges/coverage` - Test coverage percentage
- `/api/badges/build-time` - Build time in seconds
- `/api/badges/tests` - Test pass rate
- `/api/badges/type-errors` - TypeScript errors
- `/api/badges/lint-errors` - ESLint errors
- `/api/badges/vulnerabilities` - Security vulnerabilities
- `/api/badges/quality-score` - Overall quality score (weighted)

Usage in README:

```markdown
![Coverage](https://your-app.vercel.app/api/badges/coverage)
![Build](https://your-app.vercel.app/api/badges/build-time)
![Quality](https://your-app.vercel.app/api/badges/quality-score)
```

**Team Notifications** (`.quality-notifications.json`):

```json
{
  "channels": {
    "slack": {
      "webhookUrl": "${SLACK_WEBHOOK_URL}",
      "enabled": true
    },
    "discord": {
      "webhookUrl": "${DISCORD_WEBHOOK_URL}",
      "enabled": false
    }
  },
  "filters": {
    "minSeverity": "warning"
  }
}
```

**Database Integration**:

Plugin metrics are automatically saved to PostgreSQL for historical tracking:

- Table: `quality_plugin_metrics`
- Trend analysis available via `PluginDatabase` API
- 90-day retention policy with automatic cleanup

**GitHub Actions Deferred** (see `GITHUB-ACTIONS-DEFERRED.md`):

- Enhanced PR comments (script ready, workflow update pending)
- Badge auto-update (script ready, workflow update pending)
- Team notifications (script ready, webhook secrets required)

**Documentation**:

- [QUALITY-GUIDE.md](./QUALITY-GUIDE.md) - Quality gates quick-start
- [docs/QUALITY-GATES-CONFIG-GUIDE.md](./docs/QUALITY-GATES-CONFIG-GUIDE.md) - Gate configuration

---

### 3. scripts

**Purpose**: Standalone utility scripts for specialized tasks

**Key Scripts**:

- **validate-deps.ts** - Dependency validation and circular dependency detection

**Usage**:

```bash
pnpm tsx tools/scripts/validate-deps.ts
```

---

## Command Reference

### Bundle Commands

Run all maintenance tasks in sequence with automatic reporting.

```bash
# Production mode - execute all tasks
pnpm bundle

# Dry-run mode - preview changes without executing
pnpm bundle:dry

# Skip specific tasks
pnpm afenda bundle --skip-readme
pnpm afenda bundle --skip-meta
pnpm afenda bundle --skip-housekeeping
```

**Tasks executed**:

1. 📝 **README Generation** - Generate and update package READMEs
2. 🔍 **Metadata Checks** - Validate capability metadata
3. 🧹 **Housekeeping** - Run invariant checks (E1-E7, H00-H02)

---

### README Commands

Auto-generate package READMEs with live codebase introspection.

```bash
# Generate all READMEs
pnpm afenda readme gen

# Preview changes (dry-run)
pnpm afenda readme gen --dry-run

# Generate for specific package
pnpm afenda readme gen --package afenda-crud

# Update existing READMEs only
pnpm afenda readme sync

# Validate READMEs
pnpm afenda readme validate
```

**Features**:

- ✅ Auto-detects package structure
- ✅ Identifies key exports (types, utils, components)
- ✅ Shows directory structure and entry points
- ✅ Maintains consistent format
- ✅ Preserves custom content outside autogen blocks

---

### Metadata Commands

Manage capability metadata and truth ledger.

```bash
# Generate capability ledger, matrix, manifest
pnpm afenda meta gen

# Deep scan (includes detailed analysis)
pnpm afenda meta gen --deep

# Validate metadata (VIS-00 to VIS-04 checks)
pnpm afenda meta check

# JSON output for CI/CD
pnpm afenda meta check --json

# Autofix missing annotations
pnpm afenda meta fix

# Generate capability matrix
pnpm afenda meta matrix

# Generate codebase manifest
pnpm afenda meta manifest
```

**Outputs**:

- `.afenda/capability.ledger.json` - Truth ledger
- `.afenda/capability.matrix.md` - Coverage matrix
- `.afenda/codebase.manifest.json` - Package graph & schema catalog
- `.afenda/capability.mermaid.md` - Mermaid diagrams
- `.agents/context/capability-map.md` - AI agent context

---

### Housekeeping Commands

Run invariant checks to enforce code quality rules.

```bash
# Run all checks
pnpm afenda housekeeping

# JSON output for CI/CD
pnpm afenda housekeeping --json
```

**Checks**:

- **E1-E7**: Code quality checks (imports, exports, naming, structure)
- **H00-H02**: Handler registry validation

---

### AIS Benchmark Gate

Confidence-scored verification of the AIS Benchmark (280 items) against the
actual codebase. Prevents false coverage claims by scanning for 7 weighted
evidence signals per item and emitting a machine-readable ledger.

```bash
# Run gates (fails CI if claimed coverage diverges from evidence)
pnpm ci:ais-benchmark

# Generate ledger only (no gate checks — useful for first-time baseline)
node tools/ci-ais-benchmark-gate.mjs --emit-only
```

**Confidence signals** (0–100 per item):

| Signal | What it checks                          | Weight |
| ------ | --------------------------------------- | ------ |
| **S1** | Package exists with `src/`              | +10    |
| **S2** | Barrel export keyword match             | +15    |
| **S3** | Source file (calculator/service) match  | +25    |
| **S4** | Matched file is substantial (>50 lines) | +10    |
| **S5** | ≥3 distinct keyword hits                | +10    |
| **S6** | Test file has keyword match             | +15    |
| **S7** | Item ID referenced in JSDoc/comment     | +15    |

**Status thresholds**: ≥60 → covered, 30–59 → partial, <30 → missing

**Gates** (AIS-01 through AIS-06):

- **AIS-01** — Item count parity (must be 280)
- **AIS-02** — Missing items vs `AIS-GAP-MAPPING.md` claimed coverage
- **AIS-03** — Coverage % must match GAP-MAPPING ±2%
- **AIS-04** — Average confidence ≥50
- **AIS-05** — Covered items should have test evidence (warning)
- **AIS-06** — Covered items must have source file evidence

**Output**: `.afenda/ais-benchmark.ledger.json` — v2.0 ledger with per-item
confidence scores, signal breakdowns, and evidence citations.

---

### Finance Audit Gate

Confidence-scored verification of the Finance Audit Registry (23 requirements)
against the actual codebase. Ensures finance-critical invariants are enforced
structurally — RLS isolation, posting immutability, balanced journals, idempotency,
audit trail coverage, and migration lineage integrity.

```bash
# Run gates (fails CI if requirements diverge from evidence)
pnpm ci:finance-audit

# Generate ledger only (no gate checks)
node tools/ci-finance-audit-gate.mjs --emit-only

# Generate evidence pack for a close period
pnpm finance:evidence-pack -- --period 2026-01

# Generate scorecard + dashboard
pnpm finance:docs
```

**Confidence signals** (0–100 per requirement):

| Signal | What it checks                                     | Weight |
| ------ | -------------------------------------------------- | ------ |
| **E1** | Entity evidence (≥50% of mustHaveEntities found)   | +20    |
| **E2** | API evidence (≥50% of mustHaveApis found)          | +20    |
| **E3** | Test evidence (requirement ID in test file)        | +20    |
| **E4** | Report evidence (≥50% of mustHaveReports found)    | +10    |
| **E5** | Evidence artifact kind keyword found               | +10    |
| **E6** | Gate reference in CI scripts                       | +10    |
| **E7** | Traceability (requirement ID in JSDoc near export) | +10    |

**Status thresholds**: ≥60 → covered, 30–59 → partial, <30 → missing

**Gates** (FAR-01 through FAR-06):

- **FAR-01** — All S0 (critical) requirements are ≥ partial
- **FAR-02** — No high-weight (≥4) requirements are missing
- **FAR-03** — Average confidence ≥25 baseline
- **FAR-04** — All requirement IDs are unique
- **FAR-05** — All sections have ≥1 requirement
- **FAR-06** — All 6 global gates referenced in requirements

**Global Gate Tests** (`tools/ci-gates/far-*.test.ts`):

| Test File                          | Gate                                  | Checks                                                    |
| ---------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| `far-rls-isolation.test.ts`        | `gate.rls.isolation`                  | tenantPolicy on all 120+ schema files                     |
| `far-posting-immutability.test.ts` | `gate.posting.immutability`           | posting lifecycle, CHECK constraints, triggers            |
| `far-posting-balanced.test.ts`     | `gate.posting.balancedByConstruction` | je_balance CHECK, valid side, non-negative amounts        |
| `far-idempotency.test.ts`          | `gate.idempotency`                    | idempotency_key column, unique index, registry policy     |
| `far-auditlog-coverage.test.ts`    | `gate.auditlog.coverage`              | audit_logs columns, append-only, JSONB, kernel writes     |
| `far-migration-lineage.test.ts`    | `gate.migration.lineage`              | journal integrity, sequential idx, no DROP finance tables |

**Emitter Jobs**:

| Script                      | Output                                                                |
| --------------------------- | --------------------------------------------------------------------- |
| `ci-finance-audit-gate.mjs` | `.afenda/finance-audit.ledger.json`                                   |
| `finance-evidence-pack.mjs` | `.afenda/evidence-packs/{period}-finance-evidence.json`               |
| `finance-audit-docs.mjs`    | `.afenda/FINANCE-AUDIT-SCORECARD.md` + `finance-audit-dashboard.json` |

---

### CI UI Gates

Enforces ERP Architecture UI governance (Section 10 of `packages/ui/erp-architecture.ui.md`).
Runs in `.github/workflows/ci.yml` as step "UI gates".

```bash
# Run all 5 gates (exit 1 on failure)
pnpm ci:ui-gates
```

| Gate         | Check                                                       |
| ------------ | ----------------------------------------------------------- |
| **UI-ARCH-01** | `erp-architecture.ui.md` exists; `ui.architecture.md` links to it |
| **UI-RSC-01**  | No `'use client'` in layout.tsx or page.tsx under org routes   |
| **UI-NAV-01**  | `@entity-gen:nav-items` in nav-config.ts                       |
| **UI-TOKEN-01**| No hardcoded hex/rgb/hsl (excludes `hsl(var(...))`, allowlist)   |
| **UI-A11Y-01** | Shell renders `<nav>` and `<main>` landmarks                     |

**Constraint (Zero Drift):** All UI must use shadcn-based afenda-ui components only; no raw `<input>`, `<select>`, `<button>`, `<textarea>`. See `erp-architecture.ui.md` Section 6a.

**Script**: `tools/ci-ui-gates.mjs`

**Spec**: [packages/ui/erp-architecture.ui.md](../packages/ui/erp-architecture.ui.md) — Section 10, 13

---

### Quality Metrics Commands

Collect, analyze, and enforce code quality metrics with database persistence.

```bash
# Collect current metrics (dual storage: file + database)
pnpm --filter quality-metrics collect
DATABASE_URL="postgresql://..." pnpm --filter quality-metrics collect

# Quality gates (PR validation)
pnpm --filter quality-metrics gates --sha=$(git rev-parse HEAD)
pnpm --filter quality-metrics gates --sha=abc123 --base-branch=develop
pnpm --filter quality-metrics gates --config=custom-config.json

# Security scanning
pnpm --filter quality-metrics security               # Fail on critical+high
pnpm --filter quality-metrics security --fail-moderate  # Fail on moderate+
pnpm --filter quality-metrics security --format=markdown  # PR comment format

# View interactive dashboard
pnpm dev  # Navigate to http://localhost:3000/quality
```

**Quality Gates Configuration** (`.quality-gates.json`):

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

**Dashboard Features**:

- 📊 **Real-time Metrics** - Auto-refresh every 30s
- 📈 **Interactive Charts** - 7-day trends for coverage, build time, errors,
  cache hit rate
- 📦 **Package Drill-down** - Top 5 packages with coverage breakdowns
- 🎯 **Status Indicators** - Pass/warn/fail badges with color coding
- ⚡ **Trend Analysis** - ↑ up, ↓ down, — stable indicators

---

## Architecture

### Design Principles

1. **Flat, Feature-Based Structure** - Max 2 levels deep, organized by purpose
2. **Constants-Based Configuration** - Single source of truth in
   `report-config.ts`
3. **Auto-Generated Reports** - Consistent CLI and Markdown output
4. **Type-Safe** - Full TypeScript with Zod schema validation
5. **Composable** - Modular commands that can be composed

### Report System

All commands use a unified report system:

**Configuration** (`core/report-config.ts`):

```typescript
export const REPORT_CONFIGS = {
  bundle: {
    command: 'bundle',
    displayName: 'Bundle',
    tasks: [
      { key: 'readme', title: 'README Generation', icon: '📝' },
      { key: 'meta', title: 'Metadata Checks', icon: '🔍' },
      { key: 'housekeeping', title: 'Housekeeping', icon: '🧹' },
    ],
  },
};
```

**Report Builder** (`core/report-builder.ts`):

```typescript
const reportBuilder = new ReportBuilder('bundle', { dryRun });
reportBuilder.addTask('readme', { success: true, message: '...', count: 5 });
reportBuilder.generate(); // Auto-generates CLI + Markdown
```

**Benefits**:

- ⏱️ Automatic timestamps & duration tracking
- 📊 Standardized metrics (total/success/warnings/errors)
- ✓ Color-coded task status
- 💡 Smart recommendations
- 📄 Optional Markdown export

---

## Development Guide

### Adding New Commands

1. **Add Report Configuration** (`core/report-config.ts`):

   ```typescript
   export const REPORT_CONFIGS = {
     mycommand: {
       command: 'mycommand',
       displayName: 'My Command',
       description: 'Does something useful',
       tasks: [{ key: 'task1', title: 'Task 1', icon: '✓' }],
     },
   };
   ```

2. **Create Command Implementation** (`mycommand/command.ts`):

   ```typescript
   import { ReportBuilder } from '../core/report-builder';

   export async function runMyCommand(options: MyOptions) {
     const reportBuilder = new ReportBuilder('mycommand', {
       dryRun: options.dryRun,
     });

     const result = await doSomething();

     reportBuilder.addTask('task1', {
       success: result.ok,
       message: result.message,
     });

     reportBuilder.generate();
   }
   ```

3. **Register in CLI** (`cli.ts`):

   ```typescript
   program
     .command('mycommand')
     .description('Does something useful')
     .option('--dry-run', 'Preview changes')
     .action(async (opts) => {
       const { runMyCommand } = await import('./mycommand/command');
       await runMyCommand({ dryRun: opts.dryRun });
     });
   ```

4. **Regenerate Documentation**:
   ```bash
   pnpm afenda tools-docs
   ```

### Code Organization Best Practices

1. **One feature per directory** - Clear separation of concerns
2. **Flat structure** - Avoid deep nesting (max 2 levels)
3. **Clear naming** - Name by purpose, not type
4. **Shared code in core/** - Common utilities only
5. **Use ReportBuilder** - Consistent reporting interface
6. **Define in constants** - Single source of truth for config

### Documentation Workflow

```bash
# 1. Make code changes
# 2. Update constants if needed
# 3. Regenerate documentation
pnpm afenda tools-docs

# 4. Verify generated docs
cat tools/README.md
cat tools/GUIDE.md

# 5. Commit both source and generated files
```

**Important**: Never edit `README.md` or `GUIDE.md` manually - changes will be
overwritten!

---

## CI/CD Integration

### GitHub Actions Workflows

The tools are integrated into CI/CD with automated quality gates:

#### Quality Gates Workflow (`.github/workflows/quality-gates.yml`)

Runs on every PR to enforce quality standards:

```yaml
name: Quality Gates & Security

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - name: Collect Metrics
        run: pnpm --filter quality-metrics collect
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Domain CI gates (SK-01 through SK-08)
        run: pnpm ci:domain-gates

      - name: AIS Benchmark gates (AIS-01 through AIS-06)
        run: pnpm ci:ais-benchmark

      - name: Finance Audit gates (FAR-01 through FAR-06)
        run: pnpm ci:finance-audit

      - name: Finance Audit structural gates (35 tests)
        run: pnpm --filter ci-gates test

      - name: Check Quality Gates
        run: pnpm --filter quality-metrics gates --sha=${{ github.sha }}
        continue-on-error: true

      - name: Security Scan
        run: pnpm --filter quality-metrics security --format=markdown
        continue-on-error: true

      - name: Post PR Comment
        uses: actions/github-script@v7
        with:
          script: |
            // Post quality gates + security results
```

**Features**:

- ✅ Blocks PRs that fail quality gates
- ✅ Shows security vulnerabilities
- ✅ Posts detailed PR comments
- ✅ Uploads artifacts (30-day retention)
- ✅ Database persistence (optional)

#### Standard CI Workflow

```yaml
# .github/workflows/ci.yml
jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Run Housekeeping
        run: pnpm afenda housekeeping --json

      - name: Validate Metadata
        run: pnpm afenda meta check --json

      - name: Collect Quality Metrics
        run: pnpm --filter quality-metrics collect
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Quality Gates

The following checks run automatically on every PR:

**Absolute Thresholds**:

- ✅ **Test Coverage** - ≥80% lines, functions, statements; ≥75% branches
- ✅ **TypeScript Errors** - 0 errors (configurable)
- ✅ **Lint Errors** - 0 errors (configurable)
- ✅ **Lint Warnings** - ≤10 warnings

**Regression Detection**:

- ✅ **Coverage Drop** - Max 2% decrease from baseline
- ✅ **Build Time** - Max 20% increase from average
- ✅ **Security** - No critical/high vulnerabilities

**AIS Benchmark Verification** (AIS-01 to AIS-06):

- ✅ **AIS-01** - Benchmark item count parity (280 items)
- ✅ **AIS-02** - Missing items vs claimed coverage in GAP-MAPPING
- ✅ **AIS-03** - Coverage % must match GAP-MAPPING ±2%
- ✅ **AIS-04** - Average confidence score ≥50
- ✅ **AIS-05** - Covered items should have test evidence
- ✅ **AIS-06** - Covered items must have source file evidence

**Finance Audit Verification** (FAR-01 to FAR-06):

- ✅ **FAR-01** - All S0 (critical) requirements ≥ partial
- ✅ **FAR-02** - No high-weight (≥4) requirements missing
- ✅ **FAR-03** - Average confidence ≥25 baseline
- ✅ **FAR-04** - All requirement IDs unique
- ✅ **FAR-05** - All sections non-empty
- ✅ **FAR-06** - All 6 global gates referenced

**Finance Structural Gates** (35 tests in `tools/ci-gates/far-*.test.ts`):

- ✅ RLS tenant isolation on all finance tables
- ✅ Posted entries immutability enforcement
- ✅ DR=CR balance-by-construction
- ✅ Idempotency infrastructure
- ✅ Audit trail completeness
- ✅ Migration journal integrity

**Metadata Validation** (VIS-00 to VIS-04):

- ✅ Package metadata completeness
- ✅ Capability annotations
- ✅ Schema documentation

**Invariant Checks** (E1-E7, H00-H02):

- ✅ Import/export structure
- ✅ Naming conventions
- ✅ File organization

### Security Scanning

**npm audit** runs on every PR:

- Detects vulnerabilities in dependencies
- Severity levels: Critical, High, Moderate, Low
- Blocks PRs with critical/high by default
- Generates markdown reports for PR comments

---

## Contributing

### Development Workflow

1. **Make changes** to source files
2. **Run lint/type-check**:
   ```bash
   pnpm --filter afenda-cli lint:fix
   pnpm --filter afenda-cli type-check
   ```
3. **Test changes**:
   ```bash
   pnpm afenda <command> --dry-run
   ```
4. **Regenerate docs**:
   ```bash
   pnpm afenda tools-docs
   ```
5. **Verify quality**:
   ```bash
   pnpm afenda housekeeping
   ```
6. **Commit** source + generated files

### Code Quality Standards

- ✅ All code must pass ESLint checks
- ✅ All code must pass TypeScript type checking
- ✅ All commands must use `ReportBuilder`
- ✅ All configs must be in `report-config.ts`
- ✅ Documentation must be auto-generated

### Testing

```bash
# Test README generation
pnpm afenda readme gen --dry-run

# Test metadata generation
pnpm afenda meta gen --deep

# Test bundle
pnpm bundle:dry

# Test quality metrics
pnpm --filter quality-metrics collect
pnpm --filter quality-metrics analyze
```

---

## Related Documentation

- [START_HERE.md](./START_HERE.md) - Getting started guide
- [GUIDE.md](./GUIDE.md) - Detailed development guide
- [afenda-cli/README.md](./afenda-cli/README.md) - CLI tool documentation
- [quality-metrics/README.md](./quality-metrics/README.md) - Quality metrics
  guide
- [.agents/skills/afenda-cli-usage/](../.agents/skills/afenda-cli-usage/) - AI
  agent skill

---

## Support

- **Issues**: Report bugs and feature requests in GitHub Issues
- **Documentation**: See `.agents/skills/` for AI-powered guidance
- **Questions**: Ask in team Slack channel

---

**Maintained by**: AFENDA-NEXUS Team\
**Last Updated**: February 17, 2026\
**Auto-Generated**: Run `pnpm afenda tools-docs` to regenerate
