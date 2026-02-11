import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json',
  external: ['@neondatabase/serverless', 'drizzle-orm'],
});
