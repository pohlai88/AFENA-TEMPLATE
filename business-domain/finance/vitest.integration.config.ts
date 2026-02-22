import dotenv from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const MONOREPO_ROOT = resolve(__dirname, '../..');

const parsed = dotenv.config({ path: resolve(MONOREPO_ROOT, '.env') }).parsed ?? {};

// AGENT.md §5: db.ts throws at import if DATABASE_URL is absent.
// Provide a stub so the module loads; tests skip via describeIntegration guard.
if (!parsed['DATABASE_URL']) {
  parsed['DATABASE_URL'] = 'postgresql://stub:stub@localhost:5432/stub';
}

/**
 * Vitest config for finance domain integration tests.
 *
 * Run with: pnpm vitest run --config business-domain/finance/vitest.integration.config.ts
 *
 * When DATABASE_URL is a real connection string (from .env), tests run against the DB.
 * When DATABASE_URL is the stub, tests are skipped via describeIntegration().
 */
export default defineConfig({
  resolve: {
    alias: {
      'afenda-canon': resolve(MONOREPO_ROOT, 'packages/canon/src/index.ts'),
      'afenda-database': resolve(MONOREPO_ROOT, 'packages/database/src/index.ts'),
      'afenda-logger': resolve(MONOREPO_ROOT, 'packages/logger/src/index.ts'),
    },
  },
  test: {
    name: 'finance-integration',
    globals: true,
    pool: 'forks',
    include: ['**/src/__tests__/**/*.integration.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 30_000,
    passWithNoTests: true,
    env: parsed,
    setupFiles: [],
  },
});
