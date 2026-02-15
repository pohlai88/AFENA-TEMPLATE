import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Performance optimizations
    pool: 'threads', // Better performance for larger projects
    fileParallelism: true, // Enable parallel file processing
    isolate: true, // Keep isolation for reliability (can be disabled for performance if needed)

    // Test configuration
    globals: true, // Use global test functions (test, expect, etc.)
    environment: 'node', // Node environment for backend tests
    passWithNoTests: true, // Don't fail if no tests found

    // Timeout configuration
    testTimeout: 10000, // 10 seconds default timeout
    hookTimeout: 10000, // 10 seconds for hooks

    // Projects configuration
    projects: [
      'packages/*',
      'tools/afena-cli',
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      include: [
        'packages/*/src/**/*.ts',
        'tools/*/src/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/*.config.*',
        '**/setup/**',
        '**/index.ts',
        '**/*.d.ts',
        '**/node_modules/**',
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
    },

    // Reporters
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },

    // Load apps/web/.env so integration tests get DATABASE_URL (single source)
    setupFiles: ['./vitest.setup.ts'],
  },

  // Vite configuration
  resolve: {
    alias: {
      // Add any path aliases if needed
    },
  },

  // Define global constants
  define: {
    // Add any global constants needed for tests
  },
});
