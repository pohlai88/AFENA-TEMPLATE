import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    discover: 'src/discover.ts',
  },
  format: ['cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
  splitting: false,
  shims: true,
});
