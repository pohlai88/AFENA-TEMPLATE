#!/usr/bin/env node
/**
 * CI UI Gates — ERP Architecture UI enforcement
 *
 * Enforces governance spec: packages/ui/erp-architecture.ui.md
 * Implements: UI-ARCH-01, UI-RSC-01, UI-NAV-01, UI-TOKEN-01, UI-A11Y-01
 *
 * UI-ARCH-01: erp-architecture.ui.md exists; ui.architecture.md links to it
 * UI-RSC-01:  No 'use client' in layout.tsx or page.tsx under (app)/org/[slug]/**
 * UI-NAV-01:  @entity-gen:nav-items exists in nav-config file
 * UI-TOKEN-01: No hardcoded colors (#hex, rgb(), hsl() except semantic hsl(var(...)))
 * UI-A11Y-01: Shell renders <nav>/role="navigation" and <main>/role="main"
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const _rawRoot = new URL('.', import.meta.url).pathname;
const ROOT = resolve(process.platform === 'win32' ? _rawRoot.slice(1) : _rawRoot, '..');
const APPS_WEB = join(ROOT, 'apps', 'web');
const PACKAGES_UI = join(ROOT, 'packages', 'ui');
const ARCH_ROOT = join(ROOT, '.architecture');

let violations = 0;

function fail(gate, message, file, line) {
  console.warn(`\x1b[31m✗ ${gate}\x1b[0m ${message}`);
  if (file) console.warn(`  at ${file}${line ? ':' + line : ''}`);
  violations++;
}

function pass(gate, message) {
  console.log(`\x1b[32m✓ ${gate}\x1b[0m ${message}`);
}

function relPath(file) {
  return file.replace(ROOT + (process.platform === 'win32' ? '\\' : '/'), '').replace(/\\/g, '/');
}

function walk(dir, ext, filter) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...walk(full, ext, filter));
      } else if (full.endsWith(ext) && (!filter || filter(full))) {
        results.push(full);
      }
    }
  } catch {
    // directory may not exist
  }
  return results;
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// ── UI-ARCH-01: Doc exists and is linked ────────────────────────────────────

function checkArch01() {
  const erpDoc = join(PACKAGES_UI, 'erp-architecture.ui.md');
  const uiArch = join(ARCH_ROOT, 'ui.architecture.md');

  if (!existsSync(erpDoc)) {
    fail('UI-ARCH-01', 'packages/ui/erp-architecture.ui.md must exist', relPath(erpDoc));
    return;
  }

  if (!existsSync(uiArch)) {
    fail('UI-ARCH-01', '.architecture/ui.architecture.md must exist and link to erp-architecture.ui.md', relPath(uiArch));
    return;
  }

  const uiArchContent = readFile(uiArch);
  if (!uiArchContent.includes('erp-architecture.ui.md')) {
    fail('UI-ARCH-01', '.architecture/ui.architecture.md must link to erp-architecture.ui.md', relPath(uiArch));
    return;
  }

  pass('UI-ARCH-01', 'erp-architecture.ui.md exists and is linked from ui.architecture.md');
}

// ── UI-RSC-01: No 'use client' in layout.tsx or page.tsx under org routes ────

function checkRsc01() {
  const orgRoot = join(APPS_WEB, 'app', '(app)', 'org', '[slug]');
  const files = walk(orgRoot, '.tsx', (f) => {
    const name = f.split(/[/\\]/).pop();
    return name === 'layout.tsx' || name === 'page.tsx';
  });

  let failed = 0;
  for (const file of files) {
    const content = readFile(file);
    if (content.includes("'use client'") || content.includes('"use client"')) {
      const lineNum = content.split('\n').findIndex((l) => l.includes('use client')) + 1;
      fail('UI-RSC-01', 'layout.tsx or page.tsx must not contain "use client"', relPath(file), lineNum);
      failed++;
    }
  }
  if (failed === 0) {
    pass('UI-RSC-01', 'No "use client" in org layout/page files');
  }
}

// ── UI-NAV-01: @entity-gen:nav-items exists in nav-config ────────────────────

function checkNav01() {
  const navConfig = join(APPS_WEB, 'app', '(app)', 'org', '[slug]', '_components', 'nav-config.ts');
  if (!existsSync(navConfig)) {
    fail('UI-NAV-01', 'nav-config.ts must exist in org/[slug]/_components', relPath(navConfig));
    return;
  }

  const content = readFile(navConfig);
  if (!content.includes('@entity-gen:nav-items')) {
    fail('UI-NAV-01', 'nav-config.ts must contain @entity-gen:nav-items marker', relPath(navConfig));
    return;
  }

  pass('UI-NAV-01', '@entity-gen:nav-items present in nav-config.ts');
}

// ── UI-TOKEN-01: No hardcoded colors (excludes hsl(var(...)) and allowlist) ───

const COLOR_PATTERNS = [
  { re: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g, name: 'hex', excludeLine: null },
  { re: /rgb\s*\(/g, name: 'rgb()', excludeLine: (line) => /rgb\s*\(\s*var\s*\(/.test(line) },
  { re: /hsl\s*\(/g, name: 'hsl()', excludeLine: (line) => /hsl\s*\(\s*var\s*\(/.test(line) },
];

const TOKEN_ALLOWLIST = [
  /tailwind\.config/,
  /tailwindengine\.json/,
  /globals\.css/,
  /engine\/generate\.ts/,
  /lib\/color\.ts/, // JSDoc example only
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  // Data viz / diagram: chart colors, node palettes (migrate to tokens when possible)
  /app\/api\/badges\//, // SVG badge generation (shields.io convention)
  /app\/tools\/analytics/,
  /quality-dashboard-enhanced/,
  /chart\.tsx$/, // Recharts overrides
  /node-palette\.tsx$/,
  /workflow-node\.tsx$/,
  /flow-types\.ts$/,
];

function isTokenAllowlisted(path) {
  const rel = path.replace(ROOT, '').replace(/\\/g, '/');
  return TOKEN_ALLOWLIST.some((p) => p.test(rel));
}

function checkToken01() {
  const dirs = [join(APPS_WEB, 'app'), join(APPS_WEB, 'src'), join(PACKAGES_UI, 'src')];
  const exts = ['.tsx', '.ts', '.css'];
  let failed = 0;

  for (const dir of dirs) {
    for (const ext of exts) {
      const files = walk(dir, ext);
      for (const file of files) {
        if (isTokenAllowlisted(file)) continue;
        const content = readFile(file);
        const lines = content.split('\n');
        outer: for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();
          if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
          for (const { re, name, excludeLine } of COLOR_PATTERNS) {
            const regex = new RegExp(re.source, re.flags);
            if (regex.test(line) && (!excludeLine || !excludeLine(line))) {
              fail('UI-TOKEN-01', `Hardcoded ${name} color (use semantic tokens)`, relPath(file), i + 1);
              failed++;
              break outer;
            }
          }
        }
      }
    }
  }
  if (failed === 0) {
    pass('UI-TOKEN-01', 'No hardcoded colors in apps/web or packages/ui');
  }
}

// ── UI-A11Y-01: Shell has nav and main landmarks ──────────────────────────────

function checkA11y01() {
  const sidebarPath = join(PACKAGES_UI, 'src', 'components', 'sidebar.tsx');
  const appSidebarPath = join(APPS_WEB, 'app', '(app)', 'org', '[slug]', '_components', 'app-sidebar_client.tsx');
  const layoutPath = join(APPS_WEB, 'app', '(app)', 'org', '[slug]', 'layout.tsx');

  const navSources = [sidebarPath, appSidebarPath].filter(existsSync);
  const navHasLandmark = navSources.some((p) => {
    const c = readFile(p);
    return /role\s*=\s*["']navigation["']/.test(c) || /<nav\b/.test(c);
  });

  const layoutContent = readFile(layoutPath);
  const mainHasLandmark = /<main\b/.test(layoutContent) || /role\s*=\s*["']main["']/.test(layoutContent);

  let a11yFailed = 0;
  if (!navHasLandmark) {
    fail('UI-A11Y-01', 'Sidebar must render <nav> or role="navigation"', 'packages/ui sidebar or AppSidebar');
    a11yFailed++;
  }
  if (!mainHasLandmark) {
    fail('UI-A11Y-01', 'Layout must render <main> or role="main"', relPath(layoutPath));
    a11yFailed++;
  }
  if (a11yFailed === 0) {
    pass('UI-A11Y-01', 'Shell renders <nav> and <main> landmarks');
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log('\nUI Architecture Gates (erp-architecture.ui.md)\n');
checkArch01();
checkRsc01();
checkNav01();
checkToken01();
checkA11y01();

console.log('');
if (violations > 0) {
  console.warn(`\x1b[31m${violations} violation(s)\x1b[0m`);
  process.exit(1);
} else {
  console.log('All UI gates passed.\n');
  process.exit(0);
}
