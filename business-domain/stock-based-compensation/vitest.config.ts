import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@afenda/canon': resolve(__dirname, '../../packages/canon/src'),
      '@afenda/logger': resolve(__dirname, '../../packages/logger/src'),
      '@afenda/database': resolve(__dirname, '../../packages/database/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    mockReset: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.test.ts',
        'src/**/__tests__/',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
