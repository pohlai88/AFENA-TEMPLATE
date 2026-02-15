---
name: vitest-testing
description: Comprehensive Vitest testing guide for AFENDA-NEXUS monorepo. Use when writing tests, debugging test failures, configuring Vitest, running integration tests, analyzing coverage, or when the user mentions test, vitest, coverage, or MCP test tooling.
---

# Vitest Testing (AFENDA-NEXUS)

Enterprise-grade testing with Vitest 3.2+ in a pnpm monorepo. Covers unit tests, integration tests, coverage analysis, MCP tooling, and CI/CD integration.

---

## Quick Commands

| Task                   | Command                                       |
| ---------------------- | --------------------------------------------- |
| Run all tests          | `pnpm test`                                   |
| Run tests in package   | `pnpm --filter afena-crud test`               |
| Run specific test file | `pnpm --filter afena-crud test cursor.test`   |
| Run with coverage      | `pnpm test:coverage`                          |
| Watch mode (dev)       | `pnpm --filter afena-crud test --watch`       |
| UI mode (interactive)  | `pnpm --filter afena-crud test --ui`          |
| Run integration tests  | `DATABASE_URL=<url> pnpm test` (sets env var) |
| List all tests         | `pnpm --filter afena-crud test --list`        |
| Run failed tests only  | `pnpm --filter afena-crud test --changed`     |

**MCP Commands** (via `@djankies/vitest-mcp`):

- Set project root, run tests, list tests, analyze coverage
- See [MCP Integration](#mcp-integration) section

---

## Test Types

### Unit Tests (Always Run)

- **Speed:** Fast (<5s timeout)
- **Dependencies:** No DATABASE_URL required, mocked dependencies
- **Execution:** Run on all PRs and commits
- **Pattern:** `*.test.ts` files with mocked database via `vi.mock('afena-database')`

### Integration Tests (Conditional)

- **Speed:** Slower (30s timeout)
- **Dependencies:** Requires DATABASE_URL + RLS/JWT secrets
- **Execution:** Run on main branch only (when secrets available)
- **Pattern:** `*.integration.test.ts` or tests using `describe.skipIf(!DATABASE_URL)`

**Smart Gating:** Tests automatically skip when required environment variables are not set. No separate commands needed - same `pnpm test` works everywhere.

---

## Architecture Overview

### Workspace Structure

```
AFENDA-NEXUS/
├── vitest.config.ts              # Root: projects, reporters, coverage (global only)
├── vitest.mcp.config.ts          # MCP-specific: JSON reporter, coverage-mcp/
├── vitest.setup.ts               # Env loader (apps/web/.env → DATABASE_URL)
├── packages/
│   ├── vitest-config/            # Shared presets
│   │   └── presets/
│   │       ├── unit.ts           # Fast, threads, 5s timeout
│   │       └── integration.ts    # Forks, 30s timeout, setupFiles
│   ├── crud/
│   │   ├── vitest.config.ts      # mergeConfig(unitPreset, defineProject({}))
│   │   └── src/__tests__/
│   │       ├── *.test.ts         # Unit tests
│   │       └── *.integration.test.ts  # Integration tests
│   └── ...
└── .cursor/mcp.json              # MCP server registry (Cursor)
```

### Configuration Hierarchy

**CRITICAL:** In workspace/projects mode, root config only affects:

- `reporters` (global)
- `coverage` (global)
- `outputFile` (global)

Runner knobs (`pool`, `isolate`, `setupFiles`, `exclude`, etc.) **must be in presets or per-project configs**. They do NOT affect workspace projects when placed in root.

See: [Vitest Projects Guide](https://vitest.dev/guide/projects)

---

## Test Types & Presets

### Unit Tests (Fast, No DB)

**Preset:** `packages/vitest-config/presets/unit.ts`

**Characteristics:**

- Pool: `threads` (~30% faster than forks)
- Timeout: 5s (unit tests should be fast)
- Isolation: `true` (clean state per file)
- No `setupFiles` (no DATABASE_URL needed)

**Example:**

```typescript
// packages/crud/src/__tests__/cursor.test.ts
import { describe, it, expect } from 'vitest';
import { encodeCursor, decodeCursor } from '../cursor';

describe('cursor codec', () => {
  it('encodeCursor produces base64url string', () => {
    const cursor = encodeCursor({
      v: 1,
      order: 'createdAt_desc_id_desc',
      orgId: 'test-org',
      createdAt: '2024-01-01T00:00:00.000Z',
      id: 'test-id-123',
    });
    expect(typeof cursor).toBe('string');
    expect(cursor).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
```

### Integration Tests (Real DB)

**Preset:** `packages/vitest-config/presets/integration.ts`

**Characteristics:**

- Pool: `forks` (child processes, better isolation for native PG driver)
- Timeout: 30s (DB operations can be slow)
- Isolation: `true` (full isolation per file)
- `setupFiles: ['../../vitest.setup.ts']` (loads DATABASE_URL from apps/web/.env)

**Example:**

```typescript
// packages/crud/src/__tests__/list-entities.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const DATABASE_URL = process.env.DATABASE_URL;
const describeIf = DATABASE_URL ? describe : describe.skip;

let pgClient: any;

describeIf('listEntities integration', () => {
  beforeAll(async () => {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: DATABASE_URL });
    pgClient = await pool.connect();
  });

  afterAll(async () => {
    if (pgClient) pgClient.release();
  });

  it('cursor pagination returns page and nextCursor', async () => {
    const { listEntities } = await import('../read');
    // Test implementation...
  });
});
```

**Key Pattern:** Use `describeIf` to skip when `DATABASE_URL` is not set.

---

## Coverage Configuration

### Root Config

```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',  // Fast, low memory (Vitest default)
  include: [
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    'tools/*/src/**/*.{js,jsx,ts,tsx}',
  ],
  exclude: [
    '**/__tests__/**',
    '**/dist/**',
    '**/*.config.*',
    '**/setup/**',
    '**/*.d.ts',
    '**/node_modules/**',
    '**/coverage/**',
    '**/coverage-mcp/**',
  ],
  reporter: ['text-summary', 'lcov', 'html'],
  reportsDirectory: './coverage',
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### Coverage Commands

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/index.html  # macOS
start coverage/index.html # Windows

# Coverage for specific package
pnpm --filter afena-crud test --coverage

# MCP coverage analysis (via vitest-mcp)
# Uses coverage-mcp/ directory to avoid polluting main coverage
```

### Coverage Best Practices

1. **Include uncovered files:** `coverage.include` lists source patterns explicitly
2. **Exclude test utilities:** `**/__tests__/**`, `**/setup/**`
3. **Exclude generated code:** `**/dist/**`, `**/*.d.ts`
4. **V8 provider:** Default, faster than Istanbul (since v3.2, AST-based remapping matches accuracy)
5. **HTML reporter:** Add `html` to `coverage.reporter` for interactive coverage in Vitest UI

---

## MCP Integration

### Setup

**1. MCP Server Registry (Windsurf):**

```json
// C:\Users\dlbja\.codeium\windsurf\mcp_config.json
{
  "mcpServers": {
    "vitest": {
      "args": ["-y", "@djankies/vitest-mcp"],
      "command": "npx",
      "disabled": false
    }
  }
}
```

**2. MCP Config (Project):**

```typescript
// vitest.mcp.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import rootConfig from './vitest.config';

export default mergeConfig(
  rootConfig,
  defineConfig({
    test: {
      reporters: ['json'], // Structured output for AI
      coverage: {
        reportsDirectory: './coverage-mcp', // Separate from main coverage
      },
    },
  }),
);
```

### MCP Commands

**Available via `@djankies/vitest-mcp`:**

1. **`set_project_root`** - Set workspace root for monorepo
2. **`run_tests`** - Run tests with options:
   - `target`: File/directory path
   - `project`: Project name (optional)
   - `grep`: Filter by test name
   - `coverage`: Include coverage
3. **`list_tests`** - List all tests in project
4. **`analyze_coverage`** - Analyze coverage gaps

**Example Usage:**

```
# Via AI chat
"Run cursor tests in crud package"
→ MCP calls: set_project_root → run_tests({ target: "./packages/crud", grep: "cursor" })

"Show me coverage gaps in crud package"
→ MCP calls: analyze_coverage({ project: "crud" })
```

### MCP vs Manual Commands

| Task              | MCP                           | Manual                                           |
| ----------------- | ----------------------------- | ------------------------------------------------ |
| Run specific test | `run_tests({ target, grep })` | `pnpm --filter <pkg> test <pattern>`             |
| Coverage analysis | `analyze_coverage()`          | `pnpm test:coverage && open coverage/index.html` |
| List tests        | `list_tests()`                | `pnpm --filter <pkg> test --list`                |
| Scoped runs       | AI-powered targeting          | Manual filter + pattern                          |

**When to use MCP:**

- Debugging specific test failures (AI can analyze and suggest fixes)
- Coverage gap analysis (AI identifies untested code paths)
- Test discovery (AI finds relevant tests for code changes)

**When to use manual:**

- CI/CD pipelines (deterministic, no AI overhead)
- Local dev workflow (faster, no MCP startup)
- Full test suite runs (coverage thresholds, CI gates)

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ['main']
  pull_request:
    types: [opened, synchronize]

concurrency:
  group: ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  afena-ci:
    name: Build & Test (Unit)
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: 'postgresql://ci:ci@ci-placeholder.neon.tech/neondb?sslmode=require'
      GITHUB_ACTIONS: 'true' # Enables github-actions reporter
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test # Unit tests run with placeholder DATABASE_URL
      - run: pnpm test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
      - uses: actions/upload-artifact@v4
        with:
          name: junit-report
          path: test-results/junit.xml

  afena-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: afena-ci
    if: ${{ secrets.DATABASE_URL != '' }} # Only run when secret exists
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      RUN_INTEGRATION_TESTS: '1'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test # Integration tests run with real DATABASE_URL
```

### CI Reporters

**GitHub Actions Reporter:**

- Auto-enabled when `GITHUB_ACTIONS === 'true'` AND using default reporter
- **Must add explicitly** when using custom reporters (junit, json, etc.)

```typescript
// vitest.config.ts
reporters: process.env.GITHUB_ACTIONS === 'true'
  ? ['default', 'github-actions', 'junit']
  : ['default', 'junit'],
```

**JUnit Reporter:**

- XML format for CI systems
- Uploaded as artifact for test result tracking

```typescript
outputFile: {
  junit: './test-results/junit.xml',
}
```

---

## Common Patterns

### 1. Skip Tests Conditionally

```typescript
// Skip when DATABASE_URL not set
const describeIf = process.env.DATABASE_URL ? describe : describe.skip;

describeIf('integration tests', () => {
  // Tests only run when DATABASE_URL is available
});

// Skip in CI
describe.skipIf(process.env.CI)('local-only tests', () => {
  // Tests only run locally
});
```

### 2. Test Helpers

```typescript
// packages/crud/src/__tests__/helpers.ts
export function createMockContext() {
  return {
    requestId: crypto.randomUUID(),
    orgId: 'test-org',
    actorId: 'test-user',
    actorType: 'user' as const,
  };
}

export function assertOk<T>(result: ApiResponse): asserts result is { ok: true; data: T } {
  expect(result.ok).toBe(true);
}
```

### 3. Async Test Cleanup

```typescript
import { afterEach } from 'vitest';

let cleanup: (() => Promise<void>) | null = null;

afterEach(async () => {
  if (cleanup) {
    await cleanup();
    cleanup = null;
  }
});

it('test with cleanup', async () => {
  const resource = await createResource();
  cleanup = async () => await resource.destroy();

  // Test implementation...
});
```

### 4. Snapshot Testing

```typescript
import { expect, it } from 'vitest';

it('matches snapshot', () => {
  const result = generateComplexObject();
  expect(result).toMatchSnapshot();
});

// Update snapshots: pnpm test -u
```

### 5. Mocking

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('afena-logger', () => ({
  getLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock function
const mockFn = vi.fn().mockReturnValue('mocked');
expect(mockFn()).toBe('mocked');
expect(mockFn).toHaveBeenCalledTimes(1);
```

---

## Troubleshooting

### Tests Pass Locally, Fail in CI

**Causes:**

1. Different Node versions
2. Missing environment variables
3. Timezone differences
4. Lockfile drift

**Solutions:**

```bash
# Match CI Node version
nvm use 20

# Check env vars
echo $DATABASE_URL

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run with CI flag
CI=true pnpm test
```

### Integration Tests Timeout

**Symptoms:** Tests fail with "Test timed out in 30000ms"

**Causes:**

1. Database connection issues
2. Slow queries
3. Missing indexes
4. Transaction not committed/rolled back

**Solutions:**

```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // Test implementation...
}, 60_000); // 60s timeout

// Check database connection
beforeAll(async () => {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();
  await client.query('SELECT 1'); // Verify connection
  client.release();
});

// Always cleanup transactions
afterEach(async () => {
  await execSql('ROLLBACK'); // Ensure transaction cleanup
});
```

### Coverage Not Including Files

**Symptoms:** Coverage report missing untested files

**Cause:** `coverage.include` not set (Vitest only includes executed files by default)

**Solution:**

```typescript
// vitest.config.ts
coverage: {
  include: [
    'packages/*/src/**/*.{js,jsx,ts,tsx}',  // Explicit source patterns
    'tools/*/src/**/*.{js,jsx,ts,tsx}',
  ],
}
```

### Tests Discovering Unwanted Files

**Symptoms:** Tests run in `node_modules/.cache`, `.git`, etc.

**Cause:** Missing `configDefaults.exclude`

**Solution:**

```typescript
// packages/vitest-config/presets/unit.ts
import { configDefaults } from 'vitest/config';

export const unitPreset = {
  test: {
    exclude: [
      ...configDefaults.exclude, // CRITICAL: Include Vitest defaults
      'node_modules',
      'dist',
      '**/coverage/**',
    ],
  },
};
```

### MCP Server Not Working

**Symptoms:** MCP commands fail or not available

**Causes:**

1. MCP server not registered in Windsurf
2. `@djankies/vitest-mcp` not installed
3. Wrong project root

**Solutions:**

```bash
# 1. Check MCP registry
cat ~/.codeium/windsurf/mcp_config.json | grep vitest

# 2. Install MCP package
pnpm add -D -w @djankies/vitest-mcp

# 3. Restart Windsurf to reload MCP config

# 4. Set project root via MCP
# (AI will call set_project_root automatically)
```

---

## Best Practices

### Test Organization

1. **Co-locate tests:** `src/__tests__/` next to source files
2. **Naming convention:** `*.test.ts` for unit, `*.integration.test.ts` for integration
3. **One describe per file:** Group related tests
4. **Descriptive names:** `it('returns nextCursor when more data exists')` not `it('works')`

### Test Quality

1. **AAA pattern:** Arrange, Act, Assert
2. **One assertion per test:** Focus on single behavior
3. **Avoid test interdependence:** Each test should run independently
4. **Use helpers:** Extract common setup to helper functions
5. **Test edge cases:** Empty arrays, null values, boundary conditions

### Performance

1. **Use unit preset by default:** Only use integration preset when DB needed
2. **Minimize beforeAll/afterAll:** Prefer beforeEach/afterEach for isolation
3. **Mock external dependencies:** Don't hit real APIs in unit tests
4. **Parallel execution:** Default `fileParallelism: true` in presets
5. **Watch mode for dev:** `pnpm test --watch` for fast feedback

### Coverage

1. **70% threshold:** Global minimum (branches, functions, lines, statements)
2. **Focus on critical paths:** 100% coverage on core business logic
3. **Exclude generated code:** Config files, type definitions, build output
4. **Review uncovered lines:** Use HTML report to identify gaps
5. **Don't game metrics:** Write meaningful tests, not just coverage fillers

---

## Additional Resources

- **Vitest official docs:** [vitest.dev](https://vitest.dev/)
- **Vitest Projects Guide:** [vitest.dev/guide/projects](https://vitest.dev/guide/projects)
- **Vitest Coverage:** [vitest.dev/guide/coverage](https://vitest.dev/guide/coverage)
- **Vitest Reporters:** [vitest.dev/guide/reporters](https://vitest.dev/guide/reporters)
- **vitest-mcp GitHub:** [github.com/djankies/vitest-mcp](https://github.com/djankies/vitest-mcp)
- **Configuration plan:** [.cursor/plans/vitest.config.md](../../.cursor/plans/vitest.config.md)
- **Supporting references:** [reference.md](reference.md)
- **Test examples:** [examples.md](examples.md)
