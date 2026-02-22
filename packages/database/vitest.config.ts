import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'afenda-database',
    include: ['src/__tests__/**/*.test.ts'],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
