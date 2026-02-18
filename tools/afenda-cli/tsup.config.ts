import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/cli.ts',
    discover: 'src/discovery/scan.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
  splitting: false,
  tsconfig: './tsconfig.build.json',
  external: ['afenda-canon'],
});
