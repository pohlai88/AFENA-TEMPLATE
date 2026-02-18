# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Database-Backed Quality Metrics (Sprints 0-2)

- **NEW**: PostgreSQL database storage for quality metrics
  - `quality_snapshots` table - stores full metric snapshots with timestamps
  - `quality_package_metrics` table - stores per-package detailed metrics
  - Database-first approach with insert/query capabilities
  - Migration scripts for database setup (`tools/quality-metrics/db/schema.sql`)
  - Support for historical trend analysis via database queries
- **NEW**: Quality Gates System (`tools/quality-metrics/src/gates.ts`)
  - Configurable thresholds via `.quality-gates.json`
  - Absolute thresholds: minimum coverage percentages (lines, functions,
    statements, branches)
  - Regression detection: max coverage drop %, max build time increase %
  - Quality standards: max type errors, max lint errors/warnings
  - CLI command: `pnpm --filter quality-metrics gates`
  - Exit code 1 on failures (blocks CI/PR merges)
  - Detailed violations and warnings reporting
  - JSON and Markdown output formats
- **NEW**: Security Scanning (`tools/quality-metrics/src/security.ts`)
  - npm audit integration for vulnerability detection
  - Severity-based thresholds (critical, high, moderate, low)
  - Configurable fail conditions via CLI flags
  - Multiple output formats (text, JSON, Markdown)
  - CLI command: `pnpm --filter quality-metrics security`
  - Detailed vulnerability reporting with CVE links, CVSS scores, remediation
    steps
  - CI integration with PR comments
- **ENHANCED**: Quality Dashboard (`/quality` route)
  - Added Recharts library for interactive visualizations
  - 4 trend charts: Coverage, Build Performance, Code Quality, Technical Debt
  - Package-level drill-down with per-package metrics table
  - Historical trend indicators (↑/↓/→ arrows)
  - Auto-refresh every 30 seconds
  - Database-backed data fetching via API endpoints
  - Enhanced error handling and loading states
- **ENHANCED**: Quality Metrics API
  - `GET /api/quality/metrics` - Latest snapshot with package breakdown
  - `GET /api/quality/history` - Configurable historical data (default: 30
    snapshots)
  - `GET /api/quality/trends` - Calculated trend indicators
    (improving/declining/stable)
  - `POST /api/quality/compare` - Compare two specific snapshots
  - Database queries with proper indexing and performance optimization
- **ENHANCED**: CI/CD Integration
  - `.github/workflows/quality-gates.yml` - New workflow for quality enforcement
  - Runs quality gates on every PR
  - Runs security scans on every PR
  - Posts detailed PR comments with violations, warnings, trends
  - Branch protection integration (blocks merge on failures)
  - Artifact retention for reports (30 days)
  - Support for manual workflow dispatch
- **NEW**: Configuration System
  - `.quality-gates.json` - Quality gates threshold configuration
  - Default thresholds:
    - `minCoverageLines: 80`, `minCoverageFunctions: 80`,
      `minCoverageStatements: 80`, `minCoverageBranches: 75`
    - `maxCoverageDropPct: 2`, `maxBuildTimeIncreasePct: 20`
    - `maxTypeErrors: 0`, `maxLintErrors: 0`, `maxLintWarnings: 10`
  - Environment-based configuration (`DATABASE_URL` for database storage)
  - Customizable per-project needs (strict, relaxed, prototype, library presets)
- **NEW**: Comprehensive Documentation
  - `tools/docs/QUALITY-DASHBOARD-GUIDE.md` - 16KB user guide covering dashboard
    features, workflows, troubleshooting
  - `tools/docs/QUALITY-GATES-CONFIG-GUIDE.md` - Configuration guide with
    threshold explanations, customization presets
  - `tools/docs/SECURITY-SCANNING-GUIDE.md` - Security scanning guide with
    vulnerability remediation workflows
  - Enhanced `tools/README.md` with detailed quality-metrics section
  - `SPRINT-0-COMPLETE.md`, `SPRINT-1-COMPLETE.md`, `SPRINT-2-COMPLETE.md` -
    Sprint completion reports

#### Quality Metrics Dashboard (Phase 5)

- **NEW**: `tools/quality-metrics/` - Automated quality metrics collection and
  analysis
  - Metrics collection from Vitest coverage, build times, TypeScript errors,
    ESLint
  - Trend analysis with quality score calculation (0-100)
  - Historical tracking with JSONL storage
  - Markdown, JSON, and HTML report generation
  - CLI commands: `quality:collect`, `quality:analyze`, `quality:report`
- **NEW**: Quality Dashboard UI (`/quality`)
  - Real-time metrics visualization in Next.js
  - Coverage breakdown with progress bars
  - Status indicators (pass/warn/fail)
  - Auto-refresh every 30 seconds
  - Dark mode support
- **NEW**: Quality Metrics API
  - `GET /api/quality/metrics` - Latest metrics snapshot
  - `GET /api/quality/history` - Last 30 metrics for trends
- **NEW**: GitHub Actions workflow (`quality-metrics.yml`)
  - Automated metrics collection on push/PR/daily schedule
  - PR comments with quality reports
  - Quality threshold enforcement (fails CI if below targets)
  - GitHub Pages deployment of HTML dashboard
- **NEW**: Quality thresholds
  - Line coverage ≥ 80% (fail if below)
  - Branch coverage ≥ 75% (fail if below)
  - Type errors = 0 (fail if > 0)
  - Lint errors = 0 (fail if > 0)
  - Build time < 60s (warn if above)
- Documentation: `docs/QUALITY-DASHBOARD.md` - Comprehensive quality metrics
  guide

#### Automated Insights & Quality Intelligence (Phase 6)

- **NEW**: Test Flakiness Detection (`tools/quality-metrics/src/flakiness.ts`)
  - Identifies unreliable tests with intermittent failures
  - Flakiness scoring (0-100) based on pass/fail patterns and timing variance
  - Severity classification: Critical (>70%), Warning (40-70%), Acceptable
    (<40%)
  - Historical test result tracking in JSONL format
  - Recommendations for fixing timing issues, race conditions, external
    dependencies
  - CLI command: `quality:flakiness`
- **NEW**: Performance Regression Detection
  (`tools/quality-metrics/src/performance.ts`)
  - Monitors build time and bundle size trends
  - Baseline calculation using median of last 10 runs
  - Detects >5% regressions with warning/critical thresholds
  - Improvement detection for positive changes
  - Exit code 1 on critical regressions (>50% build time, >25% bundle size)
  - CLI command: `quality:performance`
- **NEW**: Automated Insights Engine (`tools/quality-metrics/src/insights.ts`)
  - Cross-metric correlation analysis
  - Health score calculation (0-100) with quality/performance/maintenance
    weighting
  - Priority-ranked insights: Critical > High > Medium > Low
  - Trend detection: declining coverage, growing tech debt, velocity changes
  - Actionable recommendations based on patterns
  - CLI command: `quality:insights`
- **NEW**: Full Quality Suite (`quality:full`)
  - Runs all quality checks in sequence: collect → analyze → flakiness →
    performance → insights
  - Comprehensive quality report generation
- **ENHANCED**: GitHub Actions workflow
  - Integrated flakiness detection in CI pipeline
  - Performance regression checks on every PR
  - Automated insights in PR comments
  - Multi-dimensional quality gates
- Documentation: `docs/AUTOMATED-INSIGHTS.md` - Complete guide to intelligent
  quality analysis

#### Infrastructure

- Enterprise-grade testing infrastructure with Vitest
  - Coverage thresholds: 80% lines, 80% functions, 75% branches, 80% statements
  - Test structure for all packages (logger, database, canon, workflow,
    advisory, migration, search)
  - CI integration with GitHub Actions and Codecov
  - Test scripts: `test`, `test:watch`, `test:ui`, `test:coverage`

#### Observability

- **NEW**: `afenda-observability` package
  - OpenTelemetry SDK integration with auto-instrumentation
  - Distributed tracing with OTLP export
  - Custom metrics (counters, histograms, gauges)
  - Sentry error tracking integration
  - Health check framework (Kubernetes-compatible)
  - Correlation ID propagation with AsyncLocalStorage
  - `initializeObservability()` unified initialization
- Health check API endpoints in Next.js app
  - `/api/health` - Full health status with database + memory checks
  - `/api/ready` - Kubernetes readiness probe
  - `/api/alive` - Kubernetes liveness probe
- Next.js instrumentation hook for automatic observability initialization

#### Documentation

- **NEW**: Architecture Decision Records (ADRs)
  - ADR 001: Use Neon Postgres (vs RDS, Supabase, PlanetScale)
  - ADR 002: Monorepo with Turborepo (vs Nx, Lerna, Rush)
  - ADR 003: TypeScript Strict Mode (all strict flags enabled)
  - ADR 004: OpenTelemetry Observability (vs Datadog, X-Ray, Jaeger)
  - ADR 005: Shared Package Structure (domain-driven design)
  - ADR 006: Neon Auth Authentication (vs Auth0, Clerk, NextAuth)
- **NEW**: API Documentation
  - OpenAPI 3.1 specification (`docs/api/openapi.yaml`)
  - Health API endpoints documented
  - User API endpoints documented
  - JWT authentication schema
- **NEW**: Comprehensive guides
  - `docs/OBSERVABILITY.md` - 400+ line observability implementation guide
  - `docs/TESTING.md` - Testing best practices and patterns
  - `CONTRIBUTING.md` - Contributor guide with development workflow
  - `CHANGELOG.md` - This file
- Enhanced package READMEs with usage examples
  - `afenda-logger` - Installation, usage, API reference, best practices
  - `afenda-database` - Schema definition, queries, migrations, RLS, branching
  - `afenda-observability` - Already had comprehensive documentation

#### Developer Experience

- `.env.example` - Comprehensive environment variable template
- `.github/pull_request_template.md` - PR quality checklist
- `.editorconfig` - Consistent editor settings across team
- Coverage reporting in CI with PR comments

### Changed

#### Configuration

- Upgraded TypeScript to strictest mode
  - Enabled `noUncheckedIndexedAccess`
  - Enabled `exactOptionalPropertyTypes`
  - All strict flags enabled
- Enhanced vitest configuration
  - Enterprise-grade coverage thresholds
  - Coverage reporting to `coverage/` directory
  - Exclude patterns for build artifacts and tests

#### CI/CD

- Enhanced GitHub Actions workflow
  - Added coverage collection step
  - Codecov integration with PR comments
  - Coverage summary in CI output

#### Dependencies

- Added OpenTelemetry SDK packages (`@opentelemetry/*` v0.55.0)
- Added Sentry Node SDK (`@sentry/node` v8.48.0)
- Removed deprecated `@sentry/tracing` (included in `@sentry/node` v8)

### Fixed

- Resolved OpenTelemetry version mismatches (downgraded to stable v0.55.0)
- Corrected Sentry integration (v8 includes tracing, removed separate package)

### Documentation

- Added comprehensive JSDoc comments to observability package
- Updated README files with real-world usage examples
- Created ADR index with template and guidelines

## [0.1.0] - 2024-02-17

### Added

- Initial monorepo setup with Turborepo
- 13 shared packages:
  - `afenda-logger` - Structured logging with Pino
  - `afenda-database` - Drizzle ORM with Neon Postgres
  - `afenda-crud` - Generic CRUD operations
  - `afenda-canon` - RFC definitions
  - `afenda-workflow` - Business process engine
  - `afenda-advisory` - REA accounting engine
  - `afenda-migration` - Legacy system adapters
  - `afenda-search` - Full-text search
  - `afenda-ui` - Shared React components
  - `afenda-eslint-config` - ESLint configuration
  - `afenda-typescript-config` - TypeScript configuration
- Next.js web application (`apps/web`)
- Drizzle ORM with Neon Postgres integration
- TypeScript strict mode configuration
- ESLint + Prettier setup
- pnpm workspace configuration
- Turborepo build caching

### Developer Tools

- `afenda-cli` - Metadata generation tool
  - Generate entity metadata
  - Auto-generate package READMEs
  - Analyze codebase structure

---

## Version History

- **Unreleased** - Enterprise transformation (testing, observability,
  documentation)
- **0.1.0** - Initial release with core architecture

## Migration Guides

### Upgrading to Observability Package

If you have existing OpenTelemetry code:

```diff
- import { trace } from '@opentelemetry/api';
- import { NodeSDK } from '@opentelemetry/sdk-node';
+ import { initializeObservability } from 'afenda-observability';
+ import { createSpan, withTracing } from 'afenda-observability/tracing';

- const sdk = new NodeSDK({...});
- sdk.start();
+ initializeObservability({
+   serviceName: 'my-service',
+   environment: process.env.NODE_ENV,
+ });
```

See [docs/OBSERVABILITY.md](./docs/OBSERVABILITY.md) for full migration guide.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow and
guidelines.
