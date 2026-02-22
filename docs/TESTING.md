# Testing Guide

## Test Structure

All packages in the monorepo follow a consistent testing structure:

```
packages/<package-name>/
  src/
    __tests__/
      unit/           # Unit tests (isolated, fast, no external dependencies)
      integration/    # Integration tests (database, API calls, etc.)
      fixtures/       # Test data, mocks, and shared test utilities
```

## Running Tests

### All Tests

```bash
pnpm test                 # Run all tests
pnpm test:watch          # Run tests in watch mode
pnpm test:ui             # Run tests with Vitest UI
```

### With Coverage

```bash
pnpm test:coverage       # Run tests with coverage
pnpm test:coverage:ui    # Run tests with coverage UI
```

### Package-Specific Tests

```bash
pnpm --filter <package-name> test
pnpm --filter afenda-logger test
pnpm --filter afenda-database test
```

## Coverage Thresholds

The project enforces strict coverage thresholds:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

Coverage reports are generated in the `coverage/` directory.

## Writing Tests

### Unit Tests (`__tests__/unit/`)

**Purpose**: Test individual functions/classes in isolation

**Characteristics**:

- Fast execution (< 100ms per test)
- No external dependencies (database, API, filesystem)
- Use mocks/stubs for dependencies
- Test pure logic and business rules

**Example**:

```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from '../../validation';

describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Integration Tests (`__tests__/integration/`)

**Purpose**: Test interactions between components/systems

**Characteristics**:

- Slower execution (100ms - 5s per test)
- May use real external dependencies (test database, etc.)
- Test end-to-end flows within a package
- Use `TEST_DATABASE_URL` for database tests

**Example**:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDbClient } from '../../client';

describe('Database Queries (Integration)', () => {
  let db: ReturnType<typeof getDbClient>;

  beforeAll(async () => {
    db = getDbClient(process.env.TEST_DATABASE_URL);
  });

  afterAll(async () => {
    await db.end();
  });

  it('should insert and query user', async () => {
    const user = await db.insert(...);
    expect(user).toMatchObject({ email: 'test@example.com' });
  });
});
```

### Test Fixtures (`__tests__/fixtures/`)

**Purpose**: Shared test data, mocks, and utilities

**Characteristics**:

- Reusable across multiple tests
- Mock objects, test data, helper functions
- Factory functions for creating test entities

**Example**:

```typescript
// fixtures/test-data.ts
export const createMockUser = (overrides = {}) => ({
  id: 'test-id',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

export const mockDatabase = {
  users: [createMockUser()],
};
```

## Best Practices

### 1. Test Naming

- Use descriptive test names: `should [expected behavior] when [condition]`
- Group related tests with `describe` blocks
- Use `it` for individual test cases

### 2. Arrange-Act-Assert Pattern

```typescript
it('should calculate total price', () => {
  // Arrange: Set up test data
  const cart = { items: [{ price: 10 }, { price: 20 }] };

  // Act: Execute the function
  const total = calculateTotal(cart);

  // Assert: Verify the result
  expect(total).toBe(30);
});
```

### 3. Isolation

- Each test should be independent
- Use `beforeEach`/`afterEach` for setup/teardown
- Don't rely on test execution order

### 4. Coverage vs. Quality

- Aim for meaningful tests, not just coverage numbers
- Test edge cases and error conditions
- Test public APIs, not implementation details

### 5. Mock External Dependencies

- Mock external APIs, databases, file I/O in unit tests
- Use `vi.mock()` for module mocking
- Use `vi.fn()` for function mocking

### 6. Environment Variables

- Use `.env.example` as template for test environment
- Set `NODE_ENV=test` for test runs
- Use `TEST_DATABASE_URL` for database tests (separate from production)

## CI/CD Integration

Tests run automatically on:

- Every push to `main` branch
- Every pull request
- Pre-commit hooks (optional)

### CI Test Workflow

1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Run tests with coverage (`pnpm test:coverage`)
3. Upload coverage to Codecov
4. Post coverage summary on PR
5. Enforce coverage thresholds (fail if below 80%)

## Debugging Tests

### VS Code

1. Install Vitest extension
2. Use `Debug Test` CodeLens in test files
3. Set breakpoints in your tests

### CLI

```bash
# Run specific test file
pnpm test path/to/test.test.ts

# Run tests matching pattern
pnpm test --grep "should validate"

# Run with verbose output
pnpm test --reporter=verbose

# Run in UI mode for interactive debugging
pnpm test:ui
```

## Performance

### Test Speed Guidelines

- **Unit tests**: < 100ms each
- **Integration tests**: < 5s each
- **Total test suite**: < 2 minutes

If tests are slow:

1. Check for unnecessary async operations
2. Use mocks instead of real dependencies
3. Parallelize independent tests (Vitest does this by default)
4. Move slow tests to integration suite

## Migration from Jest

If migrating from Jest:

- Replace `jest.mock()` with `vi.mock()`
- Replace `jest.fn()` with `vi.fn()`
- Replace `jest.spyOn()` with `vi.spyOn()`
- Most other APIs are compatible

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test-Driven Development Guide](https://testdriven.io/test-driven-development/)

---

**Questions?** Check the [main README](../../README.md) or ask in the team Slack channel.
