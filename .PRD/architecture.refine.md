````markdown
# Plan: Enterprise Code Quality Transformation

**TL;DR**: Transform afenda from strong architectural foundation (6.9/10) to enterprise-grade system (9+/10) through systematic improvements in test coverage, observability, documentation standards, and developer experience. Focus on "insight-first" outputs where every artifact provides actionable intelligence for future consumption.

---

## Critical Findings

**Strengths to Preserve:**

- ⭐ Exceptional TypeScript strictness (10/10) - `noUncheckedIndexedAccess`, all strict flags
- ⭐ Advanced architectural governance - `.architecture/` docs, gap registers, invariant tracking
- ⭐ Sophisticated custom tooling - `afenda-cli` with auto-gen docs and metadata validation
- ⭐ Comprehensive CI/CD - 3-job workflow with security audits, schema validation, E2E tests

**Critical Gaps to Address:**

- 🔴 **Test Coverage: 4/10** - Only 1 of 11 packages has unit tests, no coverage tooling
- 🔴 **Observability: 3/10** - Good logging, zero tracing/metrics/APM
- 🔴 **Release Management: 0/10** - No changelogs, version tracking, or deployment insights
- 🟡 **API Documentation: 5/10** - Planned OpenAPI but not implemented

---

## **Steps**

### **Phase 1: Testing & Coverage Foundation (Week 1-2)**

**1.1 Configure Enterprise-Grade Coverage Tooling**

Add to `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'json-summary', 'lcov'],
  reportsDirectory: './coverage',
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 75,
    statements: 80,
    perFile: true
  },
  exclude: [
    '**/node_modules/**',
    '**.turbo**',
    '**/dist/**',
    '**/__tests__/**',
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/ARCHIVE/**'
  ],
  all: true, // Include all source files
  skipFull: false // Always show 100% covered files
}
```
````

**1.2 Create Coverage Badge Generation**

Add to `tools/afenda-cli/src/bundle/command.ts`:

```typescript
// New task: Generate coverage badges
{
  key: 'coverage',
  title: 'Coverage Reporting',
  icon: '📊',
  description: 'Generate test coverage reports and badges'
}
```

**1.3 Add Coverage to CI**

Modify ci.yml:

```yaml
- name: Unit tests with coverage
  run: pnpm test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: true

- name: Coverage summary comment
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    lcov-file: ./coverage/lcov.info
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

**1.4 Create Per-Package Test Templates**

Generate standardized test structure for each package:

```
packages/{package}/src/__tests__/
├── unit/           # Pure unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

**Files to create:**

- `packages/logger/src/__tests__/unit/logger.test.ts`
- `packages/database/src/__tests__/unit/schema-validation.test.ts`
- `packages/canon/src/__tests__/unit/invariant.test.ts`
- `packages/workflow/src/__tests__/unit/state-machine.test.ts`
- `packages/advisory/src/__tests__/unit/analyzer.test.ts`

---

### **Phase 2: Observability Stack (Week 2-3)**

**2.1 Implement OpenTelemetry Tracing**

Modify instrumentation.ts:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'afenda-web',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

**2.2 Add Custom Metrics Collection**

Create `packages/logger/src/metrics.ts`:

```typescript
import { metrics } from '@opentelemetry/api';

export const meter = metrics.getMeter('afenda-metrics');

// Business metrics
export const entityCounters = {
  created: meter.createCounter('entities.created'),
  updated: meter.createCounter('entities.updated'),
  deleted: meter.createCounter('entities.deleted'),
};

// Performance metrics
export const queryHistogram = meter.createHistogram('db.query.duration', {
  description: 'Database query execution time',
  unit: 'ms',
});

// Health metrics
export const healthGauge = meter.createObservableGauge('service.health', {
  description: 'Service health status (1=healthy, 0=unhealthy)',
});
```

**2.3 Create Centralized Health Check System**

Create `apps/web/app/api/health/route.ts`:

```typescript
import { db } from '@afenda/database';
import { logger } from '@afenda/logger';

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: { status: string; latency?: number };
    search: { status: string; lag?: number };
    cache: { status: string; hitRate?: number };
  };
}

export async function GET() {
  const checks = await Promise.allSettled([checkDatabase(), checkSearch(), checkCache()]);

  // Return structured health data
}
```

**2.4 Add Error Tracking Integration**

Create `packages/logger/src/error-reporter.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

export class ErrorReporter {
  static capture(error: Error, context?: Record<string, unknown>) {
    logger.error({ err: error, ...context }, 'Error captured');
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { contexts: { custom: context } });
    }
  }

  static setUser(userId: string, email?: string) {
    Sentry.setUser({ id: userId, email });
  }
}
```

---

### **Phase 3: Enhanced Documentation Standards (Week 3-4)**

**3.1 Upgrade README Generation with Insights**

Modify templates.ts:

Add new sections to auto-generated READMEs:

```typescript
// Add to TemplateInput interface
export interface TemplateInput {
  // ... existing fields
  insights: {
    testCoverage: { lines: number; functions: number; branches: number };
    complexity: { average: number; max: number };
    dependencies: { total: number; outdated: number };
    performance: { buildTime: number; bundleSize: number };
    healthScore: number; // 0-100
  };
  recentChanges: {
    lastModified: string;
    commitCount: number;
    contributors: string[];
  };
}
```

**3.2 Generate API Documentation**

Create `tools/afenda-cli/src/docs/openapi-generator.ts`:

```typescript
import { Project } from 'ts-morph';
import { OpenAPIV3 } from 'openapi-types';

export function generateOpenAPISpec(routesDir: string): OpenAPIV3.Document {
  const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
  const sourceFiles = project.addSourceFilesAtPaths(`${routesDir}/**/route.ts`);

  const spec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      title: 'afenda API',
      version: '1.0.0',
      description: 'Auto-generated from route handlers',
    },
    paths: {},
  };

  // Parse route files, extract types, generate spec
  return spec;
}
```

**3.3 Create CHANGELOG.md Generator**

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/changelog-github",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Add automated changelog to command.ts.

**3.4 Add Inline Documentation Standards**

Create `docs/DOCUMENTATION_STANDARDS.md`:

```markdown
# Documentation Standards

## JSDoc Comments

All exported functions MUST have JSDoc with:

- `@description` - What it does
- `@param` - Each parameter with type and purpose
- `@returns` - Return value and meaning
- `@throws` - Exceptions that may be thrown
- `@example` - Usage example
- `@since` - Version added
- `@see` - Related functions

## Insight Comments

Add metadata for tooling consumption:
/\*\*

- @complexity O(n)
- @performance critical-path
- @tested unit,integration
- @monitors metrics.db.query.duration
  \*/
```

---

### **Phase 4: Enhanced Developer Experience (Week 4-5)**

**4.1 Create Comprehensive Environment Templates**

Create `.env.example`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/afenda
DATABASE_POOL_MAX=20
DATABASE_STATEMENT_TIMEOUT=30000

# Auth
NEON_AUTH_BASE_URL=http://localhost:3001
NEON_AUTH_COOKIE_SECRET=your-32-character-secret-here

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
SENTRY_DSN=https://...
LOG_LEVEL=info

# Feature Flags
NEXT_PUBLIC_FEATURE_SEARCH=true
```

**4.2 Add GitHub Templates**

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

<!-- What does this PR do? -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Quality Checklist

- [ ] Tests pass locally
- [ ] Coverage threshold met (80%)
- [ ] Type check passes
- [ ] Lint passes
- [ ] Architecture docs updated
- [ ] CHANGELOG entry added

## Performance Impact

<!-- Any performance implications? -->

## Deployment Notes

<!-- Special deployment considerations? -->
```

**4.3 Create CONTRIBUTING.md**

Create `CONTRIBUTING.md` with:

- Development setup walkthrough
- Testing requirements (80% coverage minimum)
- Documentation standards
- Commit message format
- PR process
- Architecture decision process

**4.4 Add .editorconfig**

Create `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

---

### **Phase 5: Quality Metrics Dashboard (Week 5-6)**

**5.1 Create Quality Metrics Collector**

Create `tools/afenda-cli/src/quality/metrics-collector.ts`:

```typescript
export interface QualityMetrics {
  codebase: {
    totalLines: number;
    packages: number;
    files: number;
  };
  testing: {
    totalTests: number;
    coverage: { lines: number; functions: number; branches: number };
    passingTests: number;
    flakyTests: string[];
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
    licenses: Record<string, number>;
  };
  performance: {
    averageBuildTime: number;
    bundleSize: Record<string, number>;
    lighthouse: { performance: number; accessibility: number; seo: number };
  };
  documentation: {
    packagesWithREADME: number;
    apiDocsCoverage: number;
    inlineDocsCoverage: number;
  };
  healthScore: number; // Weighted composite 0-100
}
```

**5.2 Generate Dashboard Markdown**

Create `tools/afenda-cli/src/quality/dashboard-generator.ts`:

```typescript
export function generateQualityDashboard(metrics: QualityMetrics): string {
  return `
# Code Quality Dashboard
Last Updated: ${new Date().toISOString()}
Overall Health Score: ${metrics.healthScore}/100

## Coverage
![Coverage](https://img.shields.io/badge/coverage-${metrics.testing.coverage.lines}%25-${getCoverageColor(metrics.testing.coverage.lines)})

## Dependencies
- Total: ${metrics.dependencies.total}
- Outdated: ${metrics.dependencies.outdated}
- Vulnerable: ${metrics.dependencies.vulnerable}

## Performance
- Build Time: ${metrics.performance.averageBuildTime}ms
- Main Bundle: ${formatBytes(metrics.performance.bundleSize.main)}
`;
}
```

**5.3 Add Quality Gate CLI Command**

Add to cli.ts:

```typescript
program
  .command('quality-gate')
  .description('Run quality gate checks (fails CI on threshold violations)')
  .action(async () => {
    const metrics = await collectQualityMetrics();
    const failures = [];

    if (metrics.testing.coverage.lines < 80) {
      failures.push('Coverage below 80%');
    }
    if (metrics.dependencies.vulnerable > 0) {
      failures.push(`${metrics.dependencies.vulnerable} vulnerable dependencies`);
    }
    if (metrics.healthScore < 85) {
      failures.push('Health score below 85');
    }

    if (failures.length > 0) {
      log.error('Quality gate failed:', failures);
      process.exitCode = 1;
    }
  });
```

---

### **Phase 6: Automated Insights Generation (Week 6-7)**

**6.1 Add Code Complexity Analysis**

Create `tools/afenda-cli/src/quality/complexity-analyzer.ts`:

```typescript
import { Project, SyntaxKind } from 'ts-morph';

export function analyzeComplexity(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const functions = sourceFile.getFunctions();
  const complexities = functions.map((fn) => ({
    name: fn.getName(),
    cyclomaticComplexity: calculateCyclomaticComplexity(fn),
    cognitiveComplexity: calculateCognitiveComplexity(fn),
    loc: fn.getEndLineNumber() - fn.getStartLineNumber(),
  }));

  return {
    file: filePath,
    averageComplexity: avg(complexities.map((c) => c.cyclomaticComplexity)),
    maxComplexity: max(complexities.map((c) => c.cyclomaticComplexity)),
    hotspots: complexities.filter((c) => c.cyclomaticComplexity > 10),
  };
}
```

**6.2 Generate Dependency Graph Insights**

Create `tools/afenda-cli/src/quality/dependency-analyzer.ts`:

```typescript
export function analyzeDependencies() {
  return {
    graph: buildDependencyGraph(),
    circular: detectCircularDependencies(),
    unused: findUnusedDependencies(),
    duplicates: findDuplicatedDependencies(),
    outdated: findOutdatedDependencies(),
    insights: {
      mostDepended: rankByIncomingEdges(),
      heaviestPackages: rankByTransitiveDeps(),
      updateRisk: calculateUpdateRisk(),
    },
  };
}
```

**6.3 Create Performance Budget Tracking**

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm dev",
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "interactive": ["error", { "maxNumericValue": 3500 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## **Verification**

### **Success Criteria**

**Testing (Phase 1):**

- [ ] All 11 packages have unit tests
- [ ] Overall coverage ≥80% (lines, functions, branches)
- [ ] Coverage reports generated in CI
- [ ] Coverage badges in all READMEs
- [ ] Test execution time <3 minutes

**Observability (Phase 2):**

- [ ] OpenTelemetry tracing operational
- [ ] Custom metrics collecting business events
- [ ] Centralized health endpoint returning structured data
- [ ] Error tracking integrated (Sentry or equivalent)
- [ ] Distributed tracing visible in UI (Jaeger/Honeycomb)

**Documentation (Phase 3):**

- [ ] All public APIs have JSDoc comments
- [ ] OpenAPI spec auto-generated from routes
- [ ] Swagger UI accessible at `/api/docs`
- [ ] CHANGELOG.md maintained for all packages
- [ ] Architecture docs include performance and complexity insights

**Developer Experience (Phase 4):**

- [ ] `.env.example` with all required variables
- [ ] PR/Issue templates in use
- [ ] CONTRIBUTING.md comprehensive
- [ ] `.editorconfig` enforced
- [ ] New developer onboarding <30 minutes

**Quality Metrics (Phase 5):**

- [ ] Quality dashboard generated automatically
- [ ] Health score ≥85/100
- [ ] Quality gate integrated in CI
- [ ] Metrics tracked over time
- [ ] Dashboard accessible to stakeholders

**Automated Insights (Phase 6):**

- [ ] Complexity analysis runs on each commit
- [ ] Dependency graph insights generated
- [ ] Performance budgets enforced
- [ ] Lighthouse CI integrated
- [ ] Automated recommendations generated

---

## **Decisions**

**Coverage Tool:** Using Vitest's native v8 coverage (fast, accurate, already in stack)

**Observability:** OpenTelemetry (vendor-neutral, future-proof, already in dependencies)

**Error Tracking:** Sentry (industry standard, excellent Next.js integration)

**Changelog:** Changesets (monorepo-native, automated, Git-friendly)

**API Docs:** Custom OpenAPI generator using ts-morph (type-safe, auto-sync with code)

**Quality Metrics:** Custom collector (full control, integrates with existing afenda-cli architecture)

---

## **Research Summary**

### **Current State Analysis**

**Strong Foundation (Preserve & Build Upon):**

- TypeScript configuration is world-class (strictest possible settings including `noUncheckedIndexedAccess`)
- Architecture documentation system (.architecture/ folder) with gap registers and invariant tracking
- Sophisticated custom tooling (afenda-cli) for maintenance automation
- Comprehensive CI/CD with security audits, schema validation, multiple test tiers
- Structured logging with Pino and AsyncLocalStorage for request context
- ESLint with security plugin and custom invariant rules

**Critical Gaps (Priority Fixes):**

- **Test Coverage: 4/10** - Only afenda-crud has unit tests (1 file), 10 other packages have zero tests
- **No coverage tooling** - No vitest coverage config, no thresholds, no reporting
- **Observability: 3/10** - Good logging exists, but zero tracing, metrics, or APM integration
- **No OpenTelemetry implementation** despite being in dependencies
- **No centralized health checks** - Only fragmented health endpoints
- **No error tracking integration** - No Sentry or equivalent
- **Release Management: 0/10** - No CHANGELOG.md, no changesets, no version tracking
- **API Documentation: 5/10** - Planned but not implemented (no OpenAPI specs, no Swagger UI)

**Medium Priority Gaps:**

- Missing developer experience files (.env.example, CONTRIBUTING.md, .editorconfig, GitHub templates)
- No performance monitoring (no Web Vitals tracking, no Lighthouse CI, no performance budgets)
- No SAST tools (CodeQL, Semgrep) beyond basic eslint-plugin-security
- Incomplete invariant checks (E1-E7, H00-H02 are stubbed out in tools/afenda-cli/src/checks/invariants.ts)
- Many READMEs show placeholder text ("TODO: Add entity-specific...")

**Package-Level Health:**
| Package | Tests | Coverage Config | README | Architecture Docs |
|---------|-------|-----------------|---------|-------------------|
| afenda-crud | ✅ 1 file | ❌ | ✅ Auto-gen | ✅ |
| afenda-database | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-logger | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-canon | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-workflow | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-advisory | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-search | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-migration | ❌ | ❌ | ✅ Auto-gen | ✅ |
| afenda-ui | ❌ | ❌ | ✅ Auto-gen | ✅ |
| apps/web | ✅ E2E only | ❌ | ✅ Manual | ✅ |

**Observability Stack Current State:**

- **Logging: 🟢 Good** - Pino with structured logs, ALS context tracking, graceful shutdown
- **Metrics: 🔴 Poor** - Only one search lag endpoint, no general metrics collection
- **Tracing: 🔴 None** - OpenTelemetry deps present in lockfile but completely unused
- **Error Tracking: 🔴 None** - No Sentry, no error aggregation, no alerting
- **Performance: 🟡 Basic** - React.cache and Next.js caching, but no APM or monitoring
- **Monitoring: 🔴 None** - No dashboards, no alerts, no health aggregation

**Overall Quality Score: 6.9/10**

- Architecture: 9/10 (Excellent governance)
- TypeScript: 10/10 (Strictest config)
- CI/CD: 8/10 (Comprehensive but no coverage)
- Testing: 4/10 (Good E2E, terrible unit coverage)
- Documentation: 8/10 (Strong arch docs, weak API docs)
- Observability: 3/10 (Logging only)
- Security: 6/10 (Basic scanning)
- Developer Experience: 7/10 (Good tooling, missing basics)

```

You can now copy this entire markdown content and paste it into a new file named `plan-enterpriseCodeQuality.prompt.md` in your editor!You can now copy this entire markdown content and paste it into a new file named `plan-enterpriseCodeQuality.prompt.md` in your editor!

Similar code found with 2 license types
```
