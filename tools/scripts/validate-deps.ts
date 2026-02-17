#!/usr/bin/env node
/**
 * Dependency Validation Script
 *
 * Validates package dependencies against architectural layer rules.
 * Ensures no circular dependencies and enforces dependency direction.
 *
 * Usage: pnpm run validate:deps
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════

type LayerNumber = 0 | 1 | 2 | 3;

interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

type DependencyGraph = Record<string, string[]>;

// ═══════════════════════════════════════════════════════
// Layer Definitions (from GOVERNANCE.md)
// ═══════════════════════════════════════════════════════

const LAYERS: Record<LayerNumber, string[]> = {
  0: ['eslint-config', 'typescript-config'],
  1: ['canon', 'database', 'logger', 'ui'],
  2: [
    'accounting',
    'inventory',
    'crm',
    'intercompany',
    'workflow',
    'advisory',
    'search',
    'migration',
    'procurement',
    'purchasing',
    'receiving',
    'payables',
    'sales',
    'shipping',
    'receivables',
    'warehouse',
  ],
  3: ['crud'],
};

const LAYER_NAMES: Record<LayerNumber, string> = {
  0: 'Configuration',
  1: 'Foundation',
  2: 'Domain Services',
  3: 'Application',
};

// Build reverse lookup
const PACKAGE_TO_LAYER: Record<string, LayerNumber> = {};
for (const [layer, packages] of Object.entries(LAYERS)) {
  for (const pkg of packages) {
    PACKAGE_TO_LAYER[pkg] = parseInt(layer) as LayerNumber;
  }
}

// ═══════════════════════════════════════════════════════
// Dependency Rules
// ═══════════════════════════════════════════════════════

const DEPENDENCY_RULES: Record<LayerNumber, LayerNumber[]> = {
  0: [], // Config: no workspace deps
  1: [], // Foundation: no workspace deps (except config via devDeps)
  2: [1], // Domain: can depend on Foundation only
  3: [1, 2], // Application: can depend on Foundation + Domain
};

// Exception: logger can be used by all layers
const LOGGER_EXCEPTION = 'logger';

// Exception: advisory can access database directly for analytics
const DOCUMENTED_EXCEPTIONS: Record<string, string[]> = {
  'advisory': ['database'],
  // ERP domain packages - Phase 1 (TODO: refactor to use events for cross-domain communication)
  'procurement': ['workflow', 'crm'],
  'purchasing': ['workflow', 'procurement'],
  'receiving': ['inventory', 'purchasing'],
  'payables': ['workflow', 'receiving'],
  'sales': ['workflow', 'inventory', 'crm'],
  'shipping': ['sales'],
  'receivables': ['workflow', 'sales', 'crm'],
  'warehouse': ['inventory', 'sales'],
};

// ═══════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════

function resolvePackageName(dependency: string): string | null {
  // Convert workspace deps like "afenda-canon" or "@afenda/eslint-config" to package name
  if (dependency.startsWith('afenda-')) {
    return dependency.replace('afenda-', '');
  }
  if (dependency.startsWith('@afenda/')) {
    return dependency.replace('@afenda/', '');
  }
  return null; // External dependency
}

function getPackageJsonPath(packageName: string): string {
  const packagesDir = join(__dirname, '..', '..', 'packages');
  return join(packagesDir, packageName, 'package.json');
}

function readPackageJson(packageName: string): PackageJson | null {
  const path = getPackageJsonPath(packageName);
  if (!existsSync(path)) {
    return null;
  }
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content) as PackageJson;
}

function getWorkspaceDependencies(packageJson: PackageJson): string[] {
  const deps: string[] = [];

  // Check dependencies
  if (packageJson.dependencies) {
    for (const dep of Object.keys(packageJson.dependencies)) {
      if (dep.startsWith('afenda-') || dep.startsWith('@afenda/')) {
        deps.push(dep);
      }
    }
  }

  return deps;
}

// ═══════════════════════════════════════════════════════
// Validation Functions
// ═══════════════════════════════════════════════════════

function validateLayerDependencies(packageName: string, layer: LayerNumber, dependencies: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const allowedLayers = DEPENDENCY_RULES[layer] || [];

  for (const dep of dependencies) {
    const depName = resolvePackageName(dep);
    if (!depName) continue; // External dependency, skip

    const depLayer = PACKAGE_TO_LAYER[depName];

    if (depLayer === undefined) {
      warnings.push(`  ⚠️  Unknown package: ${dep} (not in layer definitions)`);
      continue;
    }

    // Check logger exception
    if (depName === LOGGER_EXCEPTION) {
      continue; // Logger allowed everywhere
    }

    // Check documented exceptions
    if (DOCUMENTED_EXCEPTIONS[packageName]?.includes(depName)) {
      continue; // Documented exception
    }

    // Check if dependency layer is allowed
    if (!allowedLayers.includes(depLayer)) {
      errors.push(
        `  ❌ Invalid dependency: ${packageName} (Layer ${layer}: ${LAYER_NAMES[layer]}) cannot depend on ${depName} (Layer ${depLayer}: ${LAYER_NAMES[depLayer]})`
      );
    }
  }

  return { errors, warnings };
}

function detectCircularDependencies(graph: DependencyGraph): string[] {
  const errors: string[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string, path: string[] = []): void {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      const cycle = [...path.slice(cycleStart), node];
      errors.push(`  ❌ Circular dependency: ${cycle.join(' → ')}`);
      return;
    }

    if (visited.has(node)) {
      return; // Already processed
    }

    visited.add(node);
    recursionStack.add(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      dfs(neighbor, [...path, node]);
    }

    recursionStack.delete(node);
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return errors;
}

// ═══════════════════════════════════════════════════════
// Main Validation
// ═══════════════════════════════════════════════════════

function main(): void {
  console.log('🔍 Validating package dependencies...\n');

  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const dependencyGraph: DependencyGraph = {};

  // Validate each package
  for (const [layer, packages] of Object.entries(LAYERS)) {
    const layerNum = parseInt(layer) as LayerNumber;
    console.log(`📦 Layer ${layer}: ${LAYER_NAMES[layerNum]}`);

    for (const packageName of packages) {
      const packageJson = readPackageJson(packageName);

      if (!packageJson) {
        allWarnings.push(`  ⚠️  Package not found: ${packageName}`);
        continue;
      }

      const deps = getWorkspaceDependencies(packageJson);

      // Build dependency graph for circular detection
      const depNames = deps.map(resolvePackageName).filter((name): name is string => name !== null);
      dependencyGraph[packageName] = depNames;

      // Validate layer rules
      const { errors, warnings } = validateLayerDependencies(
        packageName,
        layerNum,
        deps
      );

      if (errors.length > 0) {
        console.log(`  ❌ ${packageName}`);
        errors.forEach((e) => console.log(e));
        allErrors.push(...errors);
      } else if (deps.length > 0) {
        console.log(`  ✅ ${packageName} (${deps.length} workspace deps)`);
      } else {
        console.log(`  ✅ ${packageName} (no workspace deps)`);
      }

      if (warnings.length > 0) {
        warnings.forEach((w) => console.log(w));
        allWarnings.push(...warnings);
      }
    }

    console.log('');
  }

  // Check for circular dependencies
  console.log('🔄 Checking for circular dependencies...\n');
  const circularErrors = detectCircularDependencies(dependencyGraph);

  if (circularErrors.length > 0) {
    console.log('❌ Circular dependencies detected:');
    circularErrors.forEach((e) => console.log(e));
    allErrors.push(...circularErrors);
  } else {
    console.log('✅ No circular dependencies found');
  }

  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════');
  console.log('Summary:');
  console.log(`  Total Errors: ${allErrors.length}`);
  console.log(`  Total Warnings: ${allWarnings.length}`);
  console.log('═══════════════════════════════════════════════════');

  if (allErrors.length > 0) {
    console.log('\n❌ Validation FAILED');
    process.exit(1);
  }

  if (allWarnings.length > 0) {
    console.log('\n⚠️  Validation passed with warnings');
    process.exit(0);
  }

  console.log('\n✅ Validation PASSED');
  process.exit(0);
}

main();
