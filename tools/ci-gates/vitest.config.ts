import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'afenda-canon': resolve(__dirname, '../../packages/canon/src/index.ts'),
      'afenda-crud': resolve(__dirname, '../../packages/crud/src/index.ts'),
      'afenda-database': resolve(__dirname, '../../packages/database/src/index.ts'),
    },
  },
  test: {
    globals: false,
    environment: 'node',
    root: __dirname,
    include: ['*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});
