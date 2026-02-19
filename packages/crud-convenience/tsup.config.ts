import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'afenda-canon',
    'afenda-database',
    'afenda-logger',
    'afenda-accounting',
    'afenda-crm',
    'afenda-crud',
    'afenda-intercompany',
    'afenda-inventory',
    'drizzle-orm',
  ],
});
