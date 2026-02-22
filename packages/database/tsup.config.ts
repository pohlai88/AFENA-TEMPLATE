import { defineConfig } from 'tsup';

// Avoid EPERM on Windows when clean removes files that are still open
const isWin = process.platform === 'win32';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: !isWin,
  tsconfig: './tsconfig.build.json',
  external: ['@neondatabase/serverless', 'drizzle-orm'],
});
