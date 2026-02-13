import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json',
  external: [
    'drizzle-orm',
    'drizzle-orm/neon-http',
    'drizzle-orm/neon',
    '@neondatabase/serverless',
    'afena-database',
    'afena-canon',
    'afena-logger',
  ],
});
