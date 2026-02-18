#!/usr/bin/env tsx
/**
 * Migrate to Catalog Protocol
 * 
 * Automatically updates all package.json files to use catalog: protocol
 * for dependencies that exist in pnpm-workspace.yaml catalog
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

// Packages that should keep explicit versions
const KEEP_EXPLICIT = new Set([
  '@neondatabase/auth',
  '@neondatabase/neon-js',
]);

// Workspace packages
const WORKSPACE_PACKAGES = new Set([
  'afenda-canon',
  'afenda-crud',
  'afenda-database',
  'afenda-logger',
  'afenda-search',
  'afenda-workflow',
  'afenda-advisory',
  'afenda-migration',
  'afenda-ui',
  'afenda-observability',
  'afenda-eslint-config',
  'afenda-typescript-config',
  'afenda-vitest-config',
]);

function loadCatalog(): Set<string> {
  const workspaceFile = join(process.cwd(), 'pnpm-workspace.yaml');
  const content = readFileSync(workspaceFile, 'utf-8');

  const catalog = new Set<string>();

  // Find the catalog section
  const lines = content.split('\n');
  let inCatalog = false;

  for (const line of lines) {
    // Start of catalog section
    if (line.match(/^catalog:\s*$/)) {
      inCatalog = true;
      continue;
    }

    // End of catalog section (next top-level key or end of file)
    if (inCatalog && line.match(/^[a-zA-Z]/)) {
      break;
    }

    // Extract catalog entries (indented lines with key: value)
    if (inCatalog && line.match(/^\s+/)) {
      const match = line.match(/^\s+['"]?([^:'"]+)['"]?:/);
      if (match) {
        catalog.add(match[1]);
      }
    }
  }

  return catalog;
}

function findPackageJsonFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', 'build', '.next', '.turbo', 'coverage'].includes(entry)) {
        findPackageJsonFiles(fullPath, files);
      }
    } else if (entry === 'package.json') {
      files.push(fullPath);
    }
  }

  return files;
}

function migratePackageJson(filePath: string, catalog: Set<string>): number {
  const content = readFileSync(filePath, 'utf-8');
  const pkg: PackageJson = JSON.parse(content);

  // Skip root package.json
  if (!pkg.name || pkg.name === 'afenda-monorepo') {
    return 0;
  }

  let changeCount = 0;

  // Migrate dependencies
  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      // Skip workspace packages
      if (WORKSPACE_PACKAGES.has(dep)) {
        if (!version.startsWith('workspace:')) {
          pkg.dependencies[dep] = 'workspace:*';
          changeCount++;
        }
        continue;
      }

      // Skip explicitly allowed packages
      if (KEEP_EXPLICIT.has(dep)) {
        continue;
      }

      // Skip if already using catalog or workspace
      if (version.startsWith('catalog:') || version.startsWith('workspace:')) {
        continue;
      }

      // Migrate to catalog if in catalog
      if (catalog.has(dep)) {
        pkg.dependencies[dep] = 'catalog:';
        changeCount++;
      }
    }
  }

  // Migrate devDependencies
  if (pkg.devDependencies) {
    for (const [dep, version] of Object.entries(pkg.devDependencies)) {
      // Skip workspace packages
      if (WORKSPACE_PACKAGES.has(dep)) {
        if (!version.startsWith('workspace:')) {
          pkg.devDependencies[dep] = 'workspace:*';
          changeCount++;
        }
        continue;
      }

      // Skip explicitly allowed packages
      if (KEEP_EXPLICIT.has(dep)) {
        continue;
      }

      // Skip if already using catalog or workspace
      if (version.startsWith('catalog:') || version.startsWith('workspace:')) {
        continue;
      }

      // Migrate to catalog if in catalog
      if (catalog.has(dep)) {
        pkg.devDependencies[dep] = 'catalog:';
        changeCount++;
      }
    }
  }

  // Write back if changes were made
  if (changeCount > 0) {
    // Preserve formatting by using 2-space indent
    const newContent = JSON.stringify(pkg, null, 2) + '\n';
    writeFileSync(filePath, newContent, 'utf-8');
  }

  return changeCount;
}

function main() {
  console.log('🔄 Migrating packages to catalog protocol...\n');

  const catalog = loadCatalog();
  console.log(`📚 Loaded ${catalog.size} entries from catalog\n`);

  const rootDir = join(process.cwd());
  const packageJsonFiles = findPackageJsonFiles(rootDir);

  let totalChanges = 0;
  const changedPackages: string[] = [];

  for (const file of packageJsonFiles) {
    const changes = migratePackageJson(file, catalog);
    if (changes > 0) {
      totalChanges += changes;
      const pkg = JSON.parse(readFileSync(file, 'utf-8'));
      changedPackages.push(`${pkg.name} (${changes} changes)`);
    }
  }

  if (totalChanges === 0) {
    console.log('✅ All packages already use catalog protocol!\n');
    process.exit(0);
  }

  console.log('✅ Migration complete!\n');
  console.log(`📦 Updated ${changedPackages.length} packages:`);
  for (const pkg of changedPackages) {
    console.log(`  - ${pkg}`);
  }
  console.log(`\n📊 Total changes: ${totalChanges}\n`);
  console.log('💡 Next steps:');
  console.log('  1. Run: pnpm install');
  console.log('  2. Run: pnpm validate:catalog');
  console.log('  3. Test builds: pnpm build\n');
}

main();
