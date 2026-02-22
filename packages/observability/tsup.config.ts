import { defineConfig } from 'tsup';

// Avoid EPERM on Windows when clean removes files that are still open
const isWin = process.platform === 'win32';

export default defineConfig({
  clean: !isWin,
  entry: {
    index: 'src/index.ts',
    tracing: 'src/tracing.ts',
    metrics: 'src/metrics.ts',
    health: 'src/health.ts',
    sentry: 'src/sentry.ts',
    correlation: 'src/correlation.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  external: ['afenda-logger'],
});
