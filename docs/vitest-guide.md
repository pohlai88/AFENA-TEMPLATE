# Vitest Configuration Guide

This guide explains the Vitest setup and best practices configured for the Afena monorepo.

## 📋 Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [Performance Optimizations](#performance-optimizations)
3. [Debugging](#debugging)
4. [Profiling](#profiling)
5. [Coverage](#coverage)
6. [Scripts](#scripts)

## Configuration Overview

### Main Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Performance optimizations
    pool: 'threads',           // Better performance for larger projects
    fileParallelism: true,     // Enable parallel file processing
    isolate: true,             // Keep isolation for reliability
    
    // Test configuration
    globals: true,             // Use global test functions
    environment: 'node',       // Node environment for backend tests
    passWithNoTests: true,     // Don't fail if no tests found
    
    // Timeouts
    testTimeout: 10000,        // 10 seconds default timeout
    hookTimeout: 10000,        // 10 seconds for hooks
    
    // Projects for monorepo
    projects: [
      'packages/*',
      'tools/afena-cli',
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    
    // Reporters
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },
  },
});
```

## Performance Optimizations

### 1. Pool Selection

- **`threads`**: Better performance for larger projects (default)
- **`forks`**: Better compatibility, slightly slower
- **`vmThreads`**: VM contexts with workers (cannot disable isolation)

### 2. Parallelism

```bash
# Enable/disable file parallelism
vitest --no-file-parallelism  # Disable for faster startup
vitest --file-parallelism    # Enable (default)
```

### 3. Isolation

```bash
# Disable isolation for better performance (if tests don't have side effects)
vitest --no-isolate
```

### 4. Sharding

For large test suites on multiple machines:

```bash
# Split into shards
vitest run --reporter=blob --shard=1/3  # Machine 1
vitest run --reporter=blob --shard=2/3  # Machine 2
vitest run --reporter=blob --shard=3/3  # Machine 3

# Merge results
vitest run --merge-reports
```

## Debugging

### VS Code Debug Configurations

1. **Debug Current Test**: Press F5 on a test file
2. **Debug Watch Mode**: Debug with hot reload
3. **Browser Mode**: Debug in browser environment

### Debugging Tips

- Use `--test-timeout=0` when debugging to prevent timeouts
- Use `--no-file-parallelism` for consistent execution order
- Set breakpoints directly in test files

## Profiling

### Available Scripts

```bash
# Profile test runner and main thread
pnpm test:profile

# Profile specific components
pnpm test:profile:runner    # Test runner performance
pnpm test:profile:main      # Main thread performance
pnpm test:profile:coverage  # Coverage generation performance
```

### Manual Profiling

```bash
# CPU profiling
node --cpu-prof --cpu-prof-dir=./profile ./node_modules/vitest/vitest.mjs run

# Heap profiling
node --heap-prof --heap-prof-dir=./profile ./node_modules/vitest/vitest.mjs run

# File transform debugging
VITEST_DEBUG_DUMP=true vitest run

# Coverage profiling
DEBUG=vitest:coverage vitest run --coverage
```

## Coverage

### Configuration

- Provider: `v8` (faster than Istanbul)
- Thresholds: 70% for all metrics
- Reports: HTML, LCOV, text summary

### Exclusions

- Test files (`**/__tests__/**`)
- Build outputs (`**/dist/**`)
- Config files (`**/*.config.*`)
- Type definitions (`**/*.d.ts`)

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm test` | Run all tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:ui` | Open Vitest UI interface |
| `pnpm test:profile` | Profile performance |

## VS Code Integration

### Features

- Test explorer sidebar
- Inline test results
- Gutter indicators for test status
- Code lenses for running tests
- Debug configurations

### Settings

- Auto-open peek view on failures
- Show all tests in explorer
- Enable code lenses
- Custom command mappings

## Best Practices

1. **Test Organization**
   - Keep tests close to source files
   - Use descriptive test names
   - Group related tests with `describe`

2. **Performance**
   - Use `threads` pool for better performance
   - Enable file parallelism
   - Consider sharding for large suites

3. **Debugging**
   - Use appropriate debug configurations
   - Disable timeouts when debugging
   - Use browser mode for DOM tests

4. **Coverage**
   - Set meaningful thresholds
   - Exclude non-source files
   - Review uncovered code paths

5. **CI/CD**
   - Use JUnit reporter for CI integration
   - Upload coverage reports
   - Fail build on threshold drops

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase `testTimeout` in config
   - Use `--test-timeout=0` when debugging

2. **Slow test runs**
   - Try different pool (`threads` vs `forks`)
   - Consider disabling isolation
   - Use sharding for parallel execution

3. **Memory issues**
   - Use heap profiling to identify leaks
   - Reduce file parallelism
   - Check for test isolation issues

4. **Coverage is slow**
   - Use `DEBUG=vitest:coverage` to identify slow files
   - Exclude large files from coverage
   - Consider v8 provider for better performance

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [API Reference](https://vitest.dev/api/)
- [Guide](https://vitest.dev/guide/)
- [Config Options](https://vitest.dev/config/)
