/**
 * Unit test preset — fast, no DB required.
 *
 * - pool: 'threads' — Worker threads, ~30% faster startup than forks
 * - testTimeout: 5s — unit tests should be fast
 * - globals: true — no import { describe, it } needed
 * - unstubEnvs / unstubGlobals — auto-cleanup between tests
 *
 * NOTE: setupFiles is NOT included here because vitest resolves setup file
 * paths relative to the project root, not the config package. Each package
 * that needs the DB mock should add it in their own vitest.config.ts:
 *   setupFiles: ['afena-vitest-config/setup/mock-database']
 */
export const unitPreset = {
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.next', 'build'],
    testTimeout: 5_000,
    hookTimeout: 10_000,
    passWithNoTests: true,
    restoreMocks: false,
    unstubEnvs: true,
    unstubGlobals: true,
    pool: 'threads' as const,
    isolate: true,
  },
};
