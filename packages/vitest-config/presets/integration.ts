import { configDefaults } from 'vitest/config';

/**
 * Integration test preset — real DB, full isolation.
 *
 * - pool: 'forks' — child processes, better isolation for native PG driver
 * - isolate: true — each test file gets clean state
 * - testTimeout: 30s — DB operations can be slow
 * - globals: true — no import { describe, it } needed
 * - restoreMocks / unstubEnvs / unstubGlobals — auto-cleanup between tests
 * - setupFiles: load apps/web/.env (DATABASE_URL) — path relative to project
 * - exclude: configDefaults + extensions (Vitest v4 guidance)
 */
export const integrationPreset = {
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [
      ...configDefaults.exclude,
      'node_modules',
      'dist',
      '.next',
      'build',
      '**/coverage/**',
      '**/coverage-mcp/**',
      '**/playwright-report/**',
      '**/.next/**',
    ],
    testTimeout: 30_000,
    hookTimeout: 10_000,
    passWithNoTests: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    pool: 'forks' as const,
    fileParallelism: true,
    isolate: true,
    setupFiles: ['../../vitest.setup.ts'],
  },
};
