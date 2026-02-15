# Vitest Testing Reference

Code examples, patterns, and advanced techniques for AFENDA-NEXUS testing.

---

## Test File Structure

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { functionToTest } from '../module';

describe('module name', () => {
  describe('functionToTest', () => {
    it('should handle normal case', () => {
      const result = functionToTest('input');
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      const result = functionToTest('');
      expect(result).toBe('default');
    });

    it('should throw on invalid input', () => {
      expect(() => functionToTest(null)).toThrow('Invalid input');
    });
  });
});
```

### Integration Test Template

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

const DATABASE_URL = process.env.DATABASE_URL;
const describeIf = DATABASE_URL ? describe : describe.skip;

let pgClient: any;
let cleanup: (() => Promise<void>)[] = [];

describeIf('integration test suite', () => {
  beforeAll(async () => {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: DATABASE_URL });
    pgClient = await pool.connect();
  });

  afterAll(async () => {
    if (pgClient) pgClient.release();
  });

  beforeEach(async () => {
    await pgClient.query('BEGIN');
  });

  afterEach(async () => {
    await pgClient.query('ROLLBACK');
    // Run any additional cleanup
    for (const fn of cleanup) await fn();
    cleanup = [];
  });

  it('test with database', async () => {
    const result = await pgClient.query('SELECT 1 as value');
    expect(result.rows[0].value).toBe(1);
  });
});
```

---

## Assertion Patterns

### Basic Assertions

```typescript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Strict deep equality (no undefined)

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeGreaterThanOrEqual(5);
expect(value).toBeLessThan(10);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(0.3, 5);  // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');
expect(string).toHaveLength(10);

// Arrays/Objects
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key');
expect(object).toHaveProperty('key', 'value');
expect(object).toMatchObject({ key: 'value' });

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
expect(() => fn()).toThrow(ErrorClass);
expect(async () => await fn()).rejects.toThrow();

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

### Custom Assertions

```typescript
// Type guard assertion
function assertOk<T>(result: ApiResponse): asserts result is { ok: true; data: T } {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error('Expected ok result');
}

// Usage
const result = await someFunction();
assertOk(result);
// TypeScript now knows result.data exists
console.log(result.data);

// Array ordering assertion
function assertOrderingDescCreatedAtDescId(
  rows: Array<{ createdAt: Date; id: string }>
) {
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1];
    const curr = rows[i];
    const ok =
      curr.createdAt.getTime() < prev.createdAt.getTime() ||
      (curr.createdAt.getTime() === prev.createdAt.getTime() && curr.id < prev.id);
    expect(ok).toBe(true);
  }
}

// No overlaps assertion
function assertNoOverlaps(a: Set<string>, b: Set<string>) {
  for (const id of b) {
    expect(a.has(id)).toBe(false);
  }
}
```

---

## Mocking Patterns

### Module Mocking

```typescript
import { vi } from 'vitest';

// Mock entire module
vi.mock('afena-logger', () => ({
  getLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Partial mock (keep some real implementations)
vi.mock('afena-database', async () => {
  const actual = await vi.importActual('afena-database');
  return {
    ...actual,
    db: {
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Mock with factory
vi.mock('afena-crud', () => {
  const mockMutate = vi.fn();
  return {
    mutate: mockMutate,
    readEntity: vi.fn(),
    listEntities: vi.fn(),
  };
});
```

### Function Mocking

```typescript
import { vi } from 'vitest';

// Create mock function
const mockFn = vi.fn();

// With return value
const mockFn = vi.fn().mockReturnValue('value');

// With resolved promise
const mockFn = vi.fn().mockResolvedValue('value');

// With rejected promise
const mockFn = vi.fn().mockRejectedValue(new Error('error'));

// With implementation
const mockFn = vi.fn((x) => x * 2);

// Different return values per call
const mockFn = vi
  .fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg');
expect(mockFn).toHaveReturnedWith('value');
```

### Spy Pattern

```typescript
import { vi } from 'vitest';

// Spy on object method
const obj = {
  method: (x: number) => x * 2,
};

const spy = vi.spyOn(obj, 'method');

obj.method(5);
expect(spy).toHaveBeenCalledWith(5);
expect(spy).toHaveReturnedWith(10);

// Restore original
spy.mockRestore();
```

### Timer Mocking

```typescript
import { vi } from 'vitest';

// Enable fake timers
vi.useFakeTimers();

// Advance time
vi.advanceTimersByTime(1000);  // 1 second
vi.runAllTimers();             // Run all pending timers
vi.runOnlyPendingTimers();     // Run only currently pending

// Restore real timers
vi.useRealTimers();

// Example
it('debounces function calls', () => {
  vi.useFakeTimers();
  const fn = vi.fn();
  const debounced = debounce(fn, 1000);

  debounced();
  debounced();
  debounced();

  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});
```

---

## Async Testing

### Promise Testing

```typescript
// Using async/await
it('async test', async () => {
  const result = await asyncFunction();
  expect(result).toBe('value');
});

// Using resolves/rejects
it('resolves to value', async () => {
  await expect(asyncFunction()).resolves.toBe('value');
});

it('rejects with error', async () => {
  await expect(asyncFunction()).rejects.toThrow('error');
});

// Testing promise chains
it('chains promises', async () => {
  const result = await promise
    .then((x) => x * 2)
    .then((x) => x + 1);
  expect(result).toBe(11);
});
```

### Concurrent Tests

```typescript
import { describe, it } from 'vitest';

// Run tests in parallel
describe.concurrent('parallel tests', () => {
  it('test 1', async () => {
    await slowOperation();
    expect(true).toBe(true);
  });

  it('test 2', async () => {
    await slowOperation();
    expect(true).toBe(true);
  });
});

// Limit concurrency
describe.concurrent('limited concurrency', { concurrent: 2 }, () => {
  // Only 2 tests run at a time
});
```

### Retry Pattern

```typescript
import { it } from 'vitest';

// Retry flaky test
it('flaky test', async () => {
  const result = await flakyOperation();
  expect(result).toBe('success');
}, { retry: 3 });  // Retry up to 3 times
```

---

## Snapshot Testing

### Basic Snapshots

```typescript
import { expect, it } from 'vitest';

it('matches snapshot', () => {
  const data = generateComplexObject();
  expect(data).toMatchSnapshot();
});

// Inline snapshot (stored in test file)
it('inline snapshot', () => {
  expect({ foo: 'bar' }).toMatchInlineSnapshot(`
    {
      "foo": "bar",
    }
  `);
});

// Update snapshots: pnpm test -u
```

### Property Matchers

```typescript
it('snapshot with dynamic values', () => {
  const data = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    name: 'test',
  };

  expect(data).toMatchSnapshot({
    id: expect.any(String),
    createdAt: expect.any(Date),
  });
});
```

---

## Test Lifecycle Hooks

### Setup and Teardown

```typescript
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Run once before all tests
beforeAll(async () => {
  await setupDatabase();
});

// Run once after all tests
afterAll(async () => {
  await teardownDatabase();
});

// Run before each test
beforeEach(() => {
  resetState();
});

// Run after each test
afterEach(() => {
  cleanup();
});

// Async hooks
beforeEach(async () => {
  await asyncSetup();
});
```

### Cleanup Pattern

```typescript
import { afterEach } from 'vitest';

let cleanupFns: (() => Promise<void>)[] = [];

afterEach(async () => {
  for (const fn of cleanupFns) {
    await fn();
  }
  cleanupFns = [];
});

it('test with cleanup', async () => {
  const resource = await createResource();
  cleanupFns.push(async () => await resource.destroy());

  // Test implementation...
});
```

---

## Database Testing Patterns

### Transaction Isolation

```typescript
import { beforeEach, afterEach } from 'vitest';

let pgClient: any;

beforeEach(async () => {
  await pgClient.query('BEGIN');
});

afterEach(async () => {
  await pgClient.query('ROLLBACK');
});

it('test with transaction', async () => {
  await pgClient.query('INSERT INTO users (name) VALUES ($1)', ['test']);
  const result = await pgClient.query('SELECT * FROM users WHERE name = $1', ['test']);
  expect(result.rows).toHaveLength(1);
  // Automatically rolled back after test
});
```

### Tenant Context

```typescript
async function setTenantContext(orgId: string, userId: string) {
  await pgClient.query(
    `SET LOCAL request.jwt.claims = '${JSON.stringify({ org_id: orgId, sub: userId })}'`
  );
}

it('test with tenant context', async () => {
  await pgClient.query('BEGIN');
  await setTenantContext('org-123', 'user-456');

  // RLS policies now apply
  const result = await pgClient.query('SELECT * FROM contacts');
  expect(result.rows).toEqual([]);  // No data for this org yet

  await pgClient.query('ROLLBACK');
});
```

### Seed Data Pattern

```typescript
async function seedTestData(orgId: string) {
  const contacts = [];
  for (let i = 0; i < 10; i++) {
    const result = await pgClient.query(
      `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
       VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')
       RETURNING *`,
      [orgId, `Contact ${i}`]
    );
    contacts.push(result.rows[0]);
  }
  return contacts;
}

it('test with seed data', async () => {
  await pgClient.query('BEGIN');
  await setTenantContext('test-org', 'test-user');

  const contacts = await seedTestData('test-org');
  expect(contacts).toHaveLength(10);

  // Test implementation...

  await pgClient.query('ROLLBACK');
});
```

---

## Performance Testing

### Benchmark Tests

```typescript
import { bench, describe } from 'vitest';

describe('performance', () => {
  bench('fast operation', () => {
    fastFunction();
  });

  bench('slow operation', () => {
    slowFunction();
  }, { time: 1000 });  // Run for 1 second

  bench('async operation', async () => {
    await asyncFunction();
  });
});

// Run benchmarks: pnpm test --run --benchmark
```

### Timeout Configuration

```typescript
import { it } from 'vitest';

// Per-test timeout
it('slow test', async () => {
  await verySlowOperation();
}, 60_000);  // 60 second timeout

// Suite-level timeout
describe('slow suite', { timeout: 30_000 }, () => {
  it('test 1', async () => {
    await slowOperation();
  });
});
```

---

## Error Testing

### Error Boundary Testing

```typescript
it('handles errors gracefully', async () => {
  const result = await functionThatMayFail();

  if (!result.ok) {
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('VALIDATION_FAILED');
    expect(result.error.message).toContain('Invalid input');
    return;
  }

  // Success path
  expect(result.data).toBeDefined();
});
```

### Error Classification

```typescript
it('classifies errors correctly', async () => {
  try {
    await operation();
    expect.fail('Should have thrown');
  } catch (error) {
    if (error instanceof ValidationError) {
      expect(error.code).toBe('VALIDATION_FAILED');
    } else if (error instanceof DatabaseError) {
      expect(error.code).toBe('DATABASE_ERROR');
    } else {
      throw error;  // Unexpected error type
    }
  }
});
```

---

## Coverage Optimization

### Exclude Patterns

```typescript
// vitest.config.ts
coverage: {
  exclude: [
    '**/__tests__/**',       // Test files
    '**/dist/**',            // Build output
    '**/*.config.*',         // Config files
    '**/setup/**',           // Test setup
    '**/*.d.ts',             // Type definitions
    '**/node_modules/**',    // Dependencies
    '**/coverage/**',        // Coverage reports
    '**/coverage-mcp/**',    // MCP coverage
    '**/*.test.ts',          // Test files (redundant but explicit)
    '**/*.spec.ts',          // Spec files
    '**/mocks/**',           // Mock files
    '**/__mocks__/**',       // Mock directories
  ],
}
```

### Include Patterns

```typescript
// vitest.config.ts
coverage: {
  include: [
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    'tools/*/src/**/*.{js,jsx,ts,tsx}',
    '!packages/*/src/**/*.test.{ts,tsx}',
    '!packages/*/src/**/*.spec.{ts,tsx}',
  ],
}
```

### Coverage Thresholds

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Per-file thresholds
    'packages/crud/src/mutate.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
```

---

## Advanced Patterns

### Parameterized Tests

```typescript
import { it } from 'vitest';

const testCases = [
  { input: 'hello', expected: 'HELLO' },
  { input: 'world', expected: 'WORLD' },
  { input: '', expected: '' },
  { input: '123', expected: '123' },
];

testCases.forEach(({ input, expected }) => {
  it(`converts "${input}" to "${expected}"`, () => {
    expect(toUpperCase(input)).toBe(expected);
  });
});

// Or use it.each
it.each([
  ['hello', 'HELLO'],
  ['world', 'WORLD'],
  ['', ''],
])('converts %s to %s', (input, expected) => {
  expect(toUpperCase(input)).toBe(expected);
});
```

### Test Factories

```typescript
function createTestUser(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides,
  };
}

it('test with factory', () => {
  const user = createTestUser({ name: 'Custom Name' });
  expect(user.name).toBe('Custom Name');
  expect(user.email).toBe('test@example.com');
});
```

### Test Builders

```typescript
class UserBuilder {
  private user: Partial<User> = {};

  withId(id: string) {
    this.user.id = id;
    return this;
  }

  withName(name: string) {
    this.user.name = name;
    return this;
  }

  withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  build(): User {
    return {
      id: this.user.id ?? crypto.randomUUID(),
      name: this.user.name ?? 'Test User',
      email: this.user.email ?? 'test@example.com',
      createdAt: this.user.createdAt ?? new Date(),
    };
  }
}

it('test with builder', () => {
  const user = new UserBuilder()
    .withName('John')
    .withEmail('john@example.com')
    .build();

  expect(user.name).toBe('John');
});
```

---

## Debugging Tests

### Debug Mode

```bash
# Run with debugger
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# VS Code launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run"],
  "console": "integratedTerminal"
}
```

### Console Logging

```typescript
import { it } from 'vitest';

it('debug test', () => {
  const value = complexCalculation();
  console.log('Debug value:', value);  // Shows in test output
  expect(value).toBe(expected);
});
```

### Test-Only Mode

```typescript
import { it } from 'vitest';

// Run only this test
it.only('focused test', () => {
  expect(true).toBe(true);
});

// Skip this test
it.skip('skipped test', () => {
  expect(true).toBe(true);
});

// Run if condition is true
it.skipIf(process.env.CI)('local only', () => {
  expect(true).toBe(true);
});
```

---

## Additional Resources

- **Vitest API:** [vitest.dev/api](https://vitest.dev/api/)
- **Expect API:** [vitest.dev/api/expect](https://vitest.dev/api/expect.html)
- **Vi API (Mocking):** [vitest.dev/api/vi](https://vitest.dev/api/vi.html)
- **Test Context:** [vitest.dev/guide/test-context](https://vitest.dev/guide/test-context.html)
- **In-Source Testing:** [vitest.dev/guide/in-source](https://vitest.dev/guide/in-source.html)
