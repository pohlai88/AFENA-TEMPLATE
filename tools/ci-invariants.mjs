#!/usr/bin/env node

/**
 * CI Invariant Checks — Phase C Enterprise Gates
 *
 * INV-E1: No 'use client' in page.tsx / layout.tsx
 * INV-E2: No console.* in apps/web (except config files)
 * INV-E3: No hardcoded hex/rgb colors in apps/web TSX
 * INV-E4: No ad-hoc action buttons (must use ResolvedActions)
 * INV-E5: No direct CRUD imports in apps/web (boundary enforcement)
 * INV-E6: Server actions must use withActionAuth() gateway
 * INV-E7: Kernel Boundary Rule (no direct SQL/Drizzle/table imports)
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
  // Skip node-palette.tsx - it's a color palette visualization that legitimately uses hex colors
  if (file.includes('node-palette.tsx')) continue;

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

// ── INV-E5: No direct CRUD imports in apps/web ─────────────────

console.log('── INV-E5: No direct CRUD imports in apps/web (boundary enforcement) ──');

const webSourceFiles = walk(WEB_DIR, ['.ts', '.tsx'], ['node_modules', '.next', 'dist']);

for (const file of webSourceFiles) {
  // Skip kernel packages themselves and legitimate files
  if (file.includes('packages/')) continue;
  if (file.includes('with-action-auth.ts')) continue; // Needs MutationContext type
  if (file.includes('context.ts')) continue; // Legacy, will be removed
  if (file.includes('entity-actions.ts')) continue; // Kernel wrapper, allowed
  if (file.includes('api/storage/metadata/route.ts')) continue; // Uses meterStorageBytes
  if (file.includes('api/webhooks/')) continue; // Webhooks are cross-cutting infrastructure
  if (file.includes('lib/api/with-auth.ts')) continue; // API middleware needs db for auth

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    // Check for direct CRUD imports that bypass kernel
    // Allow: mutate, readEntity, listEntities, MutationContext, loadFieldDefs, meterStorageBytes, verifyWebhookSignature, checkRateLimit
    if (/from\s+['"]afena-crud['"]/.test(line)) {
      const allowedImports = ['mutate', 'readEntity', 'listEntities', 'MutationContext', 'loadFieldDefs', 'meterStorageBytes', 'verifyWebhookSignature', 'checkRateLimit'];
      const importMatch = line.match(/import\s*{([^}]*)}/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(s => s.trim().split(' as ')[0]);
        const hasDisallowed = imports.some(imp => !allowedImports.includes(imp));
        if (hasDisallowed) {
          fail('E5', file, i + 1, 'Direct CRUD import — use mutate() kernel or app/actions wrappers');
        }
      }
    }
  }
}

// ── INV-E6: Server actions must use withActionAuth() gateway ─────

console.log('── INV-E6: Server actions must use withActionAuth() gateway ──');

const serverActionFiles = walk(WEB_DIR, ['.ts', '.tsx'], ['node_modules', '.next', 'dist'])
  .filter(f => f.includes('server-actions') || (f.includes('_server') && f.endsWith('.ts')));

for (const file of serverActionFiles) {
  // Skip the gateway file itself
  if (file.includes('with-action-auth.ts')) continue;

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  // Check if it's a server action file
  const hasUseServer = content.includes("'use server'");
  if (!hasUseServer) continue;

  // Check for manual auth patterns
  const hasManualAuth = content.includes('auth.getSession()') || content.includes('randomUUID()');

  // Check if it uses withActionAuth or withActionAuthPassthrough
  const usesGateway = content.includes('withActionAuth') || content.includes('withActionAuthPassthrough');

  if (hasManualAuth && !usesGateway) {
    fail('E6', file, 1, 'Server action uses manual auth — wrap with withActionAuth() or withActionAuthPassthrough()');
  }
}

// ── INV-E7: Kernel Boundary Rule (no direct SQL/Drizzle/table) ──

console.log('── INV-E7: Kernel Boundary Rule (no direct SQL/Drizzle/table imports) ──');

for (const file of webSourceFiles) {
  // Skip allowlisted files and directories
  if (file.includes('packages/')) continue; // Kernel packages can import anything
  if (file.includes('with-action-auth.ts')) continue; // Needs db for auth context
  if (file.includes('context.ts')) continue; // Legacy, will be removed
  if (file.includes('entity-actions.ts')) continue; // Kernel wrapper, needs db for readEntity/listEntities
  if (file.includes('api/storage/metadata/route.ts')) continue; // r2Files is cross-cutting infrastructure
  if (file.includes('api/webhooks/')) continue; // Webhooks are cross-cutting infrastructure
  if (file.includes('api/views/')) continue; // Views are cross-cutting infrastructure
  if (file.includes('api/custom-fields/')) continue; // Uses loadFieldDefs from crud
  if (file.includes('lib/actions/')) continue; // Action layer needs db for auth context
  if (file.includes('lib/api/')) continue; // API middleware needs db for auth
  if (file.includes('lib/org.ts')) continue; // Org utilities need raw SQL
  if (file.includes('_server/')) continue; // Server components often need db
  if (file.includes('app/actions/')) continue; // Action wrappers need db

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    // Check for direct Drizzle table imports (not just db import)
    if (/from\s+['"][^'"]*schema[^'"]*['"]/.test(line)) {
      // Allow specific utility imports but not table imports
      if (/\b(eq|and|or|sql|desc|asc|table|schema)\b/.test(line)) {
        fail('E7', file, i + 1, 'Direct Drizzle table/schema import — use kernel mutate()');
      }
    }

    // Check for direct SQL client imports (not allowed)
    if (/from\s+['"]@vercel\/postgres['"]|from\s+['"]postgres['"]/.test(line)) {
      fail('E7', file, i + 1, 'Direct SQL client import — use kernel mutate()');
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
