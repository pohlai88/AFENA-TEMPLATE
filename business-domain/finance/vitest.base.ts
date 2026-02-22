/**
 * Shared Vitest base config for all finance domain packages.
 *
 * Loads environment variables from the monorepo root `.env` so that
 * DATABASE_URL (and other secrets) are available to integration tests
 * without hardcoding them in source.
 *
 * Usage in each package's vitest.config.ts:
 * ```ts
 * import { createFinanceConfig } from '../vitest.base';
 * export default createFinanceConfig(__dirname, 'afenda-accounting');
 * ```
 */
import dotenv from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const MONOREPO_ROOT = resolve(__dirname, '../..');

const parsed = dotenv.config({ path: resolve(MONOREPO_ROOT, '.env') }).parsed ?? {};

/**
 * Creates a Vitest config for a finance domain package.
 *
 * @param packageDir - `__dirname` of the calling vitest.config.ts
 * @param name       - Vitest project name (e.g. 'afenda-accounting')
 */
export function createFinanceConfig(packageDir: string, name: string) {
  return defineConfig({
    resolve: {
      alias: {
        'afenda-canon': resolve(MONOREPO_ROOT, 'packages/canon/src/index.ts'),
        'afenda-database': resolve(MONOREPO_ROOT, 'packages/database/src/index.ts'),
      },
    },
    test: {
      name,
      globals: true,
      pool: 'threads',
      include: ['src/**/__tests__/**/*.test.ts'],
      exclude: ['node_modules', 'dist'],
      testTimeout: 10_000,
      passWithNoTests: true,
      env: parsed,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/__tests__/**',
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/**/index.ts',
          'src/**/queries/**',
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 75,
          statements: 80,
        },
      },
    },
  });
}
