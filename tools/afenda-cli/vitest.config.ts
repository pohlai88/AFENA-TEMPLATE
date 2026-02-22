import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@afenda/cli',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 10_000,
    coverage: {
      provider: 'v8',
      include: ['src/core/**/*.ts', 'src/project/**/*.ts', 'src/proposal/**/*.ts', 'src/readme/**/*.ts'],
      exclude: ['**/*.test.ts', '**/__tests__/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
