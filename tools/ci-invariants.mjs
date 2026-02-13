#!/usr/bin/env node

/**
 * CI Invariant Checks — Phase C Enterprise Gates
 *
 * INV-E1: No 'use client' in page.tsx / layout.tsx
 * INV-E2: No console.* in apps/web (except config files)
 * INV-E3: No hardcoded hex/rgb colors in apps/web TSX
 * INV-E4: No ad-hoc action buttons (must use ResolvedActions)
 *
 * Usage: node tools/ci-invariants.mjs
 * Exit code 0 = pass, 1 = fail
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const WEB_DIR = join(ROOT, 'apps', 'web');

let failures = 0;

function walk(dir, extensions, excludes = []) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (excludes.some((e) => full.includes(e))) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue;
      results.push(...walk(full, extensions, excludes));
    } else if (extensions.includes(extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

function fail(rule, file, line, message) {
  const rel = relative(ROOT, file);
  console.error(`  FAIL [${rule}] ${rel}:${line} — ${message}`);
  failures++;
}

// ── INV-E1: No 'use client' in page.tsx / layout.tsx ────────

console.log('\n── INV-E1: No "use client" in page.tsx / layout.tsx ──');

const pageLayoutFiles = walk(WEB_DIR, ['.tsx', '.ts']).filter((f) => {
  const name = f.split(/[\\/]/).pop();
  return name === 'page.tsx' || name === 'layout.tsx';
});

for (const file of pageLayoutFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (lines[i].includes("'use client'") || lines[i].includes('"use client"')) {
      fail('E1', file, i + 1, `"use client" directive in ${file.split(/[\\/]/).pop()}`);
    }
  }
}

// ── INV-E2: No console.* in apps/web ────────────────────────

console.log('── INV-E2: No console.* in apps/web ──');

const sourceFiles = walk(WEB_DIR, ['.tsx', '.ts'], ['node_modules', '.next', 'dist']);

for (const file of sourceFiles) {
  const name = file.split(/[\\/]/).pop();
  if (name.endsWith('.config.ts') || name.endsWith('.config.js') || name.endsWith('.config.mjs')) continue;
  if (name === 'next-env.d.ts') continue;
  if (name === 'client-logger.ts') continue;

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\bconsole\.(log|warn|error|info|debug)\b/.test(line)) {
      // Skip comments
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
      fail('E2', file, i + 1, 'console.* call in production code');
    }
  }
}

// ── INV-E3: No hardcoded hex/rgb colors in TSX ─────────────

console.log('── INV-E3: No hardcoded hex/rgb colors in TSX ──');

const tsxFiles = walk(WEB_DIR, ['.tsx'], ['node_modules', '.next', 'dist']);

for (const file of tsxFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
    // Match hex colors (#fff, #ffffff, #rrggbbaa) in style props or className
    if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !line.includes('import') && !line.includes('from')) {
      // Exclude common non-color hex patterns (e.g. crypto hashes, IDs)
      if (/style\s*=|color:|background:|border:/.test(line)) {
        fail('E3', file, i + 1, 'Hardcoded hex color — use Tailwind tokens');
      }
    }
    if (/rgb\(|rgba\(|hsl\(|hsla\(/.test(line) && /style\s*=/.test(line)) {
      fail('E3', file, i + 1, 'Hardcoded rgb/hsl color — use Tailwind tokens');
    }
  }
}

// ── INV-E4: No ad-hoc action buttons ────────────────────────

console.log('── INV-E4: No ad-hoc action verbs in UI ──');

const AD_HOC_PATTERNS = [
  /kind\s*=\s*["']approve["']/,
  /kind\s*=\s*["']reject["']/,
  /kind\s*=\s*["']submit["']/,
  /kind\s*=\s*["']cancel["']/,
  /kind\s*=\s*["']restore["']/,
];

const clientFiles = walk(WEB_DIR, ['.tsx']).filter((f) => f.includes('_client'));

for (const file of clientFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of AD_HOC_PATTERNS) {
      if (pattern.test(lines[i])) {
        fail('E4', file, i + 1, 'Ad-hoc action verb in client component — use ResolvedActions');
      }
    }
  }
}

// ── Summary ─────────────────────────────────────────────────

console.log('');
if (failures === 0) {
  console.log('✅ All CI invariants passed.');
  process.exit(0);
} else {
  console.error(`❌ ${failures} invariant violation(s) found.`);
  process.exit(1);
}
