import { defineConfig } from 'vitest/config';

/**
 * Root Vitest config for AFENDA-NEXUS monorepo.
 * 
 * IMPORTANT: In workspace/projects mode, root config only affects:
 * - reporters (global)
 * - coverage (global)
 * - outputFile (global)
 * 
 * Runner knobs (pool, isolate, setupFiles, exclude, etc.) must be in presets
 * or per-project configs. They do NOT affect workspace projects when placed here.
 * 
 * See: https://vitest.dev/guide/projects
 */
export default defineConfig({
  test: {
    // Projects configuration
    projects: ['packages/*', 'tools/afena-cli'],

    // Reporters (root-only config)
    // GitHub Actions reporter auto-enables only with default reporter
    // Must add explicitly when using custom reporters
    reporters: process.env.GITHUB_ACTIONS === 'true'
      ? ['default', 'github-actions', 'junit']
      : ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },

    // Coverage configuration (root-only config)
    coverage: {
      provider: 'v8',
      include: [
        'packages/*/src/**/*.{js,jsx,ts,tsx}',
        'tools/*/src/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/*.config.*',
        '**/setup/**',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/coverage/**',
        '**/coverage-mcp/**',
      ],
      reporter: ['text-summary', 'lcov', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
