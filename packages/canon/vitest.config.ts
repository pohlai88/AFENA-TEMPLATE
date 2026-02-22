import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'afenda-canon',
    globals: true,
    pool: 'threads',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 5000,
  },
});
