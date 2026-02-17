import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['afenda-canon', 'afenda-database', 'afenda-logger', 'drizzle-orm'],
  tsconfig: './tsconfig.build.json',
});
