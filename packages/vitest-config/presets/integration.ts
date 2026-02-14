/**
 * Integration test preset — real DB, full isolation.
 *
 * - pool: 'forks' — child processes, better isolation for native PG driver
 * - isolate: true — each test file gets clean state
 * - testTimeout: 30s — DB operations can be slow
 * - globals: true — no import { describe, it } needed
 * - restoreMocks / unstubEnvs / unstubGlobals — auto-cleanup between tests
 * - NO mock-database setup — uses real DATABASE_URL
 */
export const integrationPreset = {
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.next', 'build'],
    testTimeout: 30_000,
    hookTimeout: 10_000,
    passWithNoTests: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    pool: 'forks' as const,
    isolate: true,
  },
};
