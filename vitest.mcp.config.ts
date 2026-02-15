import { defineConfig, mergeConfig } from 'vitest/config';

import rootConfig from './vitest.config';

/**
 * MCP-specific Vitest config for AI tooling (@djankies/vitest-mcp).
 * 
 * Merges with root config but overrides reporters for structured JSON output.
 * Coverage goes to separate directory to avoid polluting main coverage.
 * 
 * This config has highest priority for vitest-mcp server.
 * Keeps normal dev/CI behavior in vitest.config.ts unchanged.
 * 
 * See: https://github.com/djankies/vitest-mcp
 */
export default mergeConfig(
  rootConfig,
  defineConfig({
    test: {
      reporters: ['json'],
      coverage: {
        reportsDirectory: './coverage-mcp',
      },
    },
  })
);
