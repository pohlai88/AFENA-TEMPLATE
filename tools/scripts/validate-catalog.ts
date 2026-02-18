#!/usr/bin/env tsx
/**
 * Validate Catalog Usage
 * 
 * Ensures all dependencies in workspace packages use catalog: protocol
 * Exceptions: workspace:*, peerDependencies, and allowlisted packages
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node:path';

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface Violation {
  package: string;
  depType: 'dependencies' | 'devDependencies';
  dependency: string;
  version: string;
}

// Packages that are allowed to have explicit versions
const ALLOWED_EXPLICIT_VERSIONS = new Set([
  '@neondatabase/auth', // Beta version pinning required
  '@neondatabase/neon-js', // Beta version pinning required
  'recharts', // Specific version for compatibility
]);

// Packages that should always use workspace protocol
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

function findPackageJsonFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build, .next, etc.
      if (!['node_modules', 'dist', 'build', '.next', '.turbo', 'coverage'].includes(entry)) {
        findPackageJsonFiles(fullPath, files);
      }
    } else if (entry === 'package.json') {
      files.push(fullPath);
    }
  }

  return files;
}

function validatePackageJson(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(filePath, 'utf-8');
  const pkg: PackageJson = JSON.parse(content);

  // Skip root package.json
  if (!pkg.name || pkg.name === 'afenda-monorepo') {
    return violations;
  }

  // Check dependencies
  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      // Skip workspace packages (must use workspace:)
      if (WORKSPACE_PACKAGES.has(dep)) {
        if (!version.startsWith('workspace:')) {
          violations.push({
            package: pkg.name,
            depType: 'dependencies',
            dependency: dep,
            version: `${version} (should be workspace:*)`,
          });
        }
        continue;
      }

      // Skip allowed explicit versions
      if (ALLOWED_EXPLICIT_VERSIONS.has(dep)) {
        continue;
      }

      // Check if using catalog protocol
      if (!version.startsWith('catalog:') && !version.startsWith('workspace:')) {
        violations.push({
          package: pkg.name,
          depType: 'dependencies',
          dependency: dep,
          version,
        });
      }
    }
  }

  // Check devDependencies
  if (pkg.devDependencies) {
    for (const [dep, version] of Object.entries(pkg.devDependencies)) {
      // Skip workspace packages
      if (WORKSPACE_PACKAGES.has(dep)) {
        if (!version.startsWith('workspace:')) {
          violations.push({
            package: pkg.name,
            depType: 'devDependencies',
            dependency: dep,
            version: `${version} (should be workspace:*)`,
          });
        }
        continue;
      }

      // Skip allowed explicit versions
      if (ALLOWED_EXPLICIT_VERSIONS.has(dep)) {
        continue;
      }

      // Check if using catalog protocol
      if (!version.startsWith('catalog:') && !version.startsWith('workspace:')) {
        violations.push({
          package: pkg.name,
          depType: 'devDependencies',
          dependency: dep,
          version,
        });
      }
    }
  }

  // Note: peerDependencies are allowed to have explicit versions
  // They define compatibility ranges, not installed versions

  return violations;
}

function main() {
  const rootDir = join(process.cwd());
  const packageJsonFiles = findPackageJsonFiles(rootDir);

  console.log(`🔍 Scanning ${packageJsonFiles.length} package.json files...\n`);

  const allViolations: Violation[] = [];

  for (const file of packageJsonFiles) {
    const violations = validatePackageJson(file);
    allViolations.push(...violations);
  }

  if (allViolations.length === 0) {
    console.log('✅ All dependencies use catalog: or workspace: protocol!\n');
    process.exit(0);
  }

  console.error('❌ Found dependencies not using catalog protocol:\n');

  // Group by package
  const byPackage = new Map<string, Violation[]>();
  for (const violation of allViolations) {
    if (!byPackage.has(violation.package)) {
      byPackage.set(violation.package, []);
    }
    byPackage.get(violation.package)!.push(violation);
  }

  for (const [pkg, violations] of byPackage) {
    console.error(`\n📦 ${pkg}:`);
    for (const v of violations) {
      console.error(`  - ${v.dependency}@${v.version} (${v.depType})`);
    }
  }

  console.error(`\n❌ Total violations: ${allViolations.length}\n`);
  console.error('💡 Fix by adding to pnpm-workspace.yaml catalog and using "catalog:" in package.json\n');
  console.error('Example:');
  console.error('  pnpm-workspace.yaml:');
  console.error('    catalog:');
  console.error('      lodash: ^4.17.21\n');
  console.error('  package.json:');
  console.error('    "dependencies": {');
  console.error('      "lodash": "catalog:"');
  console.error('    }\n');

  process.exit(1);
}

main();
