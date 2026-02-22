import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/*/vitest.config.ts',
      'tools/*/vitest.config.ts',
      'business-domain/*/*/vitest.config.ts',
    ],
    exclude: [
      'ARCHIVE',
      'node_modules',
      '.next',
      '.git',
      '.**',  // Exclude all dot-prefixed directories
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
        perFile: true,
      },
      exclude: [
        '**/node_modules/**',
        '**/.turbo/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/ARCHIVE/**',
        '**/.next/**',
        '**/e2e/**',
        '**/*.config.{ts,js,mjs,cjs}',
        '**/*.d.ts',
        '**/.**/**',  // Exclude all dot-prefixed directories
      ],
      skipFull: false,
    },
  },
});
