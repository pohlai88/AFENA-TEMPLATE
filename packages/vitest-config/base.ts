/**
 * Shared Vitest base configuration for the Afena monorepo.
 *
 * Consumed via `mergeConfig` in per-package vitest.config.ts files.
 * Do NOT use this directly — use a preset from `./presets/`.
 */
export const baseConfig = {
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.next', 'build'],
    testTimeout: 10_000,
    hookTimeout: 10_000,
    passWithNoTests: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
};
