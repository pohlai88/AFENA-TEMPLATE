import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tracing: 'src/tracing.ts',
    metrics: 'src/metrics.ts',
    health: 'src/health.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['afenda-logger'],
});
