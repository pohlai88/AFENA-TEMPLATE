#!/usr/bin/env node
/**
 * Measure database package build time (including DTS).
 * Run from repo root: node packages/database/scripts/measure-build-time.mjs
 * Or: pnpm --filter afenda-database exec node scripts/measure-build-time.mjs
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');

const start = Date.now();
const result = spawnSync('pnpm', ['run', 'build'], {
  cwd: pkgRoot,
  stdio: 'inherit',
});
const elapsed = Date.now() - start;

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`\n⏱️  Build completed in ${(elapsed / 1000).toFixed(1)}s`);
console.log('   (DTS generation is typically the slowest phase)');
console.log('   Future optimization: split schema exports by domain for faster incremental builds');
