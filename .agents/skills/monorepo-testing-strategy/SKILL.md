# monorepo-testing-strategy

## Description
Testing strategy for AFENDA-NEXUS monorepo: unit tests, integration tests, E2E tests, coverage requirements, and best practices.

## Trigger Conditions
Use this skill when:
- Writing tests for packages or applications
- Questions about testing patterns
- Coverage requirements
- Test organization and structure
- Mock/stub strategies
- CI/CD test integration

---

## Overview

AFENDA-NEXUS uses a **layered testing strategy**:
1. **Unit Tests**: Isolated function/class testing (Vitest)
2. **Integration Tests**: Cross-module/database testing (Vitest + Neon)
3. **E2E Tests**: User workflow testing (Playwright)

**Test Framework**: **Vitest** (unit + integration), **Playwright** (E2E)

---

## Test Structure

### Package Test Organization

```
packages/<package-name>/
├── src/
│   ├── index.ts
│   ├── services/
│   │   └── tax-calc.ts
│   └── __tests__/
│       ├── unit/              # Unit tests (isolated, fast)
│       │   ├── tax-calc.test.ts
│       │   └── validation.test.ts
│       ├── integration/       # Integration tests (database, API)
│       │   ├── tax-service.integration.test.ts
│       │   └── database.integration.test.ts
│       └── fixtures/          # Shared test data, mocks
│           ├── mock-database.ts
│           ├── test-data.ts
│           └── factories.ts
├── vitest.config.ts
└── package.json
```

---

### Application E2E Tests

```
apps/web/
├── e2e/
│   ├── tests/              # Test files
│   │   ├── smoke.spec.ts
│   │   ├── accessibility.spec.ts
│   │   └── auth.spec.ts
│   ├── fixtures/           # Test data
│   └── helpers/            # Test utilities
├── playwright.config.ts
└── package.json
```

---

## Coverage Requirements

### Thresholds (Vitest)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,        // 80% line coverage
        functions: 80,    // 80% function coverage
        branches: 75,     // 75% branch coverage
        statements: 80,   // 80% statement coverage
        perFile: true,    // Enforce per file
      },
    },
  },
});
```

**Per-Layer Targets**:
- **Layer 0 (Config)**: 50% (tooling, mostly external)
- **Layer 1 (Foundation)**: 80% (critical infrastructure)
- **Layer 2 (Domain)**: 80% (business logic)
- **Layer 3 (Application)**: 70% (orchestration, integration-heavy)

---

## Unit Tests

### Purpose
Test individual functions/classes in **complete isolation**.

### Characteristics
- **Fast**: < 100ms per test
- **No external dependencies**: No database, API, filesystem
- **Mock all dependencies**: Use `vi.mock()`, `vi.fn()`
- **Pure logic**: Business rules, calculations, validations

---

### Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { functionUnderTest } from '../../services/module';

describe('functionUnderTest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid input', () => {
    // Arrange
    const input = 'valid-input';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected-output');
  });

  it('should throw on invalid input', () => {
    // Arrange
    const input = '';

    // Act & Assert
    expect(() => functionUnderTest(input)).toThrow('validation error');
  });

  it('should handle edge cases', () => {
    // Test edge cases, boundary conditions
    expect(functionUnderTest(null)).toBeUndefined();
  });
});
```

---

### Mocking Database

```typescript
import { describe, it, expect, vi } from 'vitest';
import { calculateLineTax } from '../../services/tax-calc';

describe('calculateLineTax', () => {
  it('should calculate tax correctly', async () => {
    // Mock database
    const mockDb = {
      query: {
        taxRates: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'rate-1',
            rate: 6,
            taxCode: 'VAT-6',
          }),
        },
      },
    };

    // Act
    const result = await calculateLineTax(
      mockDb as any,
      'org-1',
      10000, // $100.00
      'rate-1',
    );

    // Assert
    expect(result.taxAmount).toBe(600); // $6.00
    expect(mockDb.query.taxRates.findFirst).toHaveBeenCalledWith({
      where: expect.any(Function),
    });
  });
});
```

---

### Testing Pure Functions

```typescript
import { describe, it, expect } from 'vitest';
import { allocateByQty } from '../../services/landed-cost-engine';

describe('allocateByQty', () => {
  it('should allocate cost proportionally by quantity', () => {
    const result = allocateByQty(1000, [
      { id: 'line-1', qty: 3 },
      { id: 'line-2', qty: 7 },
    ]);

    expect(result.get('line-1')).toBe(300);
    expect(result.get('line-2')).toBe(700);
  });

  it('should handle zero quantity', () => {
    const result = allocateByQty(1000, []);
    expect(result.size).toBe(0);
  });

  it('should absorb rounding remainder in last line', () => {
    const result = allocateByQty(100, [
      { id: 'line-1', qty: 3 },
      { id: 'line-2', qty: 3 },
      { id: 'line-3', qty: 3 },
    ]);

    const total = Array.from(result.values()).reduce((sum, v) => sum + v, 0);
    expect(total).toBe(100); // No penny drift
  });
});
```

---

## Integration Tests

### Purpose
Test **interactions** between modules, database, external services.

### Characteristics
- **Slower**: 100ms - 5s per test
- **Real dependencies**: Test database, actual Drizzle queries
- **End-to-end flows**: Within a package or across packages
- **Transaction rollback**: Clean up after each test

---

### Template

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { createItem, findItemByCode } from '../../services/item-service';

describe('Item Service (Integration)', () => {
  let db: ReturnType<typeof drizzle>;

  beforeAll(() => {
    const sql = neon(process.env.TEST_DATABASE_URL!);
    db = drizzle(sql);
  });

  beforeEach(async () => {
    // Clean up test data
    await db.delete(items).where(eq(items.orgId, 'test-org'));
  });

  it('should create and retrieve item', async () => {
    // Arrange
    const itemData = {
      orgId: 'test-org',
      itemCode: 'ITM-001',
      itemName: 'Test Item',
      unitPrice: 1000,
    };

    // Act
    const created = await createItem(db, itemData);
    const retrieved = await findItemByCode(db, 'test-org', 'ITM-001');

    // Assert
    expect(retrieved).toMatchObject({
      itemCode: 'ITM-001',
      itemName: 'Test Item',
    });
    expect(retrieved?.id).toBe(created.id);
  });

  it('should enforce RLS isolation', async () => {
    // Create item in org-1
    await createItem(db, {
      orgId: 'org-1',
      itemCode: 'ITM-001',
      itemName: 'Item 1',
    });

    // Try to find in org-2
    const result = await findItemByCode(db, 'org-2', 'ITM-001');

    // Should not find item from different org
    expect(result).toBeNull();
  });
});
```

---

### Database Test Best Practices

1. **Use TEST_DATABASE_URL**: Separate test database
2. **Transaction Rollback**: Clean up after tests
3. **Idempotent Setup**: Tests can run in any order
4. **Seed Minimal Data**: Only what's needed for the test

---

## E2E Tests (Playwright)

### Purpose
Test **user workflows** end-to-end in a browser.

### Characteristics
- **Slowest**: 2-10s per test
- **Real browser**: Chromium, Firefox, WebKit
- **Full stack**: Database → API → UI
- **User perspective**: Clicks, forms, navigation

---

### Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Invoice Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/invoices');
  });

  test('should create a new invoice', async ({ page }) => {
    // Click "New Invoice" button
    await page.click('button:has-text("New Invoice")');

    // Fill form
    await page.fill('input[name="customerName"]', 'Acme Corp');
    await page.fill('input[name="amount"]', '1000.00');

    // Submit
    await page.click('button:has-text("Save")');

    // Verify success message
    await expect(page.locator('text=Invoice created')).toBeVisible();

    // Verify invoice in list
    await expect(page.locator('text=Acme Corp')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("New Invoice")');

    // Try to submit without filling form
    await page.click('button:has-text("Save")');

    // Verify validation error
    await expect(page.locator('text=Customer is required')).toBeVisible();
  });
});
```

---

### Playwright Config

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './apps/web/e2e/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],

  webServer: {
    command: 'pnpm --filter web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Fixtures & Factories

### Purpose
Reusable test data, mocks, and setup utilities.

---

### Factory Pattern

```typescript
// packages/<package>/src/__tests__/fixtures/factories.ts

import { v4 as uuidv4 } from 'uuid';
import type { Item } from '../../types';

export const createMockItem = (overrides: Partial<Item> = {}): Item => ({
  orgId: 'test-org',
  id: uuidv4(),
  itemCode: 'ITM-001',
  itemName: 'Test Item',
  unitPrice: 1000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  customData: {},
  ...overrides,
});

export const createMockItems = (count: number): Item[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockItem({
      itemCode: `ITM-${String(i + 1).padStart(3, '0')}`,
      itemName: `Test Item ${i + 1}`,
    })
  );
};
```

---

### Mock Database

```typescript
// packages/<package>/src/__tests__/fixtures/mock-database.ts

import { vi } from 'vitest';

export const createMockDb = (data: Record<string, any[]> = {}) => ({
  query: {
    items: {
      findFirst: vi.fn((opts) => {
        // Simple query mock
        return data.items?.[0] ?? null;
      }),
      findMany: vi.fn(() => data.items ?? []),
    },
    taxRates: {
      findFirst: vi.fn(() => data.taxRates?.[0] ?? null),
    },
  },
  insert: vi.fn(() => ({ values: vi.fn(), returning: vi.fn() })),
  update: vi.fn(() => ({ set: vi.fn(), where: vi.fn() })),
  delete: vi.fn(() => ({ where: vi.fn() })),
});
```

---

## Best Practices

### 1. Test Naming

**Pattern**: `should [expected behavior] when [condition]`

```typescript
// ✅ Good
it('should calculate tax correctly when rate is 6%', ...);
it('should throw error when tax rate is not found', ...);

// ❌ Bad
it('test 1', ...);
it('calculates tax', ...);
```

---

### 2. Arrange-Act-Assert (AAA)

```typescript
it('should allocate cost proportionally', () => {
  // Arrange: Set up test data
  const totalCost = 1000;
  const lines = [{ id: 'line-1', qty: 3 }, { id: 'line-2', qty: 7 }];

  // Act: Execute the function
  const result = allocateByQty(totalCost, lines);

  // Assert: Verify the result
  expect(result.get('line-1')).toBe(300);
  expect(result.get('line-2')).toBe(700);
});
```

---

### 3. Test Independence

```typescript
// ✅ Good - Each test is independent
describe('Item Service', () => {
  beforeEach(async () => {
    // Clean state before each test
    await db.delete(items).where(eq(items.orgId, 'test-org'));
  });

  it('test 1', async () => { ... });
  it('test 2', async () => { ... });
});

// ❌ Bad - Tests depend on execution order
describe('Item Service', () => {
  it('create item', async () => {
    // Creates item
  });

  it('find item', async () => {
    // Depends on previous test creating item
  });
});
```

---

### 4. Mock Only What You Need

```typescript
// ✅ Good - Mock only database
const mockDb = {
  query: {
    taxRates: {
      findFirst: vi.fn().mockResolvedValue({ rate: 6 }),
    },
  },
};

// ❌ Bad - Over-mocking
vi.mock('afenda-database', () => ({ ... })); // Too broad
```

---

### 5. Test Edge Cases

```typescript
describe('allocateByQty', () => {
  it('should allocate normally', () => { ... });
  it('should handle zero quantity', () => { ... });
  it('should handle single line', () => { ... });
  it('should handle rounding remainder', () => { ... });
  it('should handle negative total (error)', () => { ... });
});
```

---

## Running Tests

### All Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With UI
pnpm test:ui
```

---

### With Coverage

```bash
# Generate coverage
pnpm test:coverage

# Coverage with UI
pnpm test:coverage:ui

# View coverage report
open coverage/index.html
```

---

### Package-Specific

```bash
# Run tests for one package
pnpm --filter afenda-accounting test

# Watch mode for one package
pnpm --filter afenda-inventory test:watch
```

---

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific browser
pnpm test:e2e --project=chromium

# Debug mode
pnpm test:e2e --debug
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests with coverage
        run: pnpm test:coverage
        env:
          TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Debugging Tests

### VS Code

1. Install Vitest extension
2. Use "Debug Test" CodeLens above test
3. Set breakpoints in test or source code
4. Run debugger

---

### CLI

```bash
# Run specific test file
pnpm test path/to/test.test.ts

# Run tests matching pattern
pnpm test --grep "should allocate"

# Verbose output
pnpm test --reporter=verbose

# Run single test
pnpm test --grep "should allocate cost proportionally"
```

---

## Performance Guidelines

### Test Speed Targets

- **Unit tests**: < 100ms each
- **Integration tests**: < 5s each
- **E2E tests**: < 10s each
- **Total test suite**: < 2 minutes

---

### Optimization Tips

1. **Parallelize**: Vitest runs tests in parallel by default
2. **Mock expensive operations**: Database queries, API calls
3. **Use `beforeAll` for shared setup**: Reduce setup/teardown overhead
4. **Isolate slow tests**: Move to integration suite
5. **Use test snapshots sparingly**: They can become brittle

---

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Testing Implementation Details

```typescript
// ❌ BAD - Tests internal implementation
it('should call private method', () => {
  const service = new TaxService(db);
  expect(service['privateMethod']).toHaveBeenCalled();
});
```

**Solution**: Test public API and observable behavior.

---

### ❌ Anti-Pattern 2: Over-Mocking

```typescript
// ❌ BAD - Mocks everything, tests nothing
vi.mock('afenda-database');
vi.mock('afenda-canon');
vi.mock('drizzle-orm');
```

**Solution**: Mock only external dependencies, test real logic.

---

### ❌ Anti-Pattern 3: Flaky Tests

```typescript
// ❌ BAD - Non-deterministic test
it('should complete within 1 second', async () => {
  const start = Date.now();
  await someAsyncFunction();
  expect(Date.now() - start).toBeLessThan(1000); // Flaky!
});
```

**Solution**: Avoid time-based assertions, use mocks.

---

## References

- [docs/TESTING.md](../../../docs/TESTING.md) - Detailed testing guide
- [vitest.config.ts](../../../vitest.config.ts) - Root test configuration
- [playwright.config.ts](../../../playwright.config.ts) - E2E test configuration
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

---

## Quick Reference

### Vitest Imports
```typescript
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';
```

### Mock Functions
```typescript
vi.fn()                    // Create mock function
vi.mock('module')           // Mock module
vi.spyOn(obj, 'method')    // Spy on method
vi.clearAllMocks()         // Clear all mocks
```

### Assertions
```typescript
expect(x).toBe(y)           // Strict equality
expect(x).toEqual(y)        // Deep equality
expect(x).toMatchObject(y)  // Partial match
expect(fn).toThrow()        // Function throws
expect(fn).toHaveBeenCalled() // Mock was called
```

### Async Tests
```typescript
it('async test', async () => {
  const result = await asyncFunction();
  expect(result).toBe('value');
});
```
