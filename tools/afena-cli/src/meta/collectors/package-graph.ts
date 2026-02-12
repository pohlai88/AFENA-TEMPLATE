/**
 * Package graph collector — pnpm workspace → DAG.
 * Reads pnpm-workspace.yaml and each package.json to build a dependency graph.
 */

import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import fg from 'fast-glob';

export interface PackageNode {
  name: string;
  path: string;
  version: string;
  private: boolean;
  dependencies: string[];
  devDependencies: string[];
}

export interface PackageGraph {
  nodes: PackageNode[];
  edges: { from: string; to: string; dev: boolean }[];
}

/**
 * Build the package dependency graph from the pnpm workspace.
 */
export async function collectPackageGraph(repoRoot: string): Promise<PackageGraph> {
  const nodes: PackageNode[] = [];
  const edges: { from: string; to: string; dev: boolean }[] = [];

  // Find all package.json files in workspace packages
  const packageJsonPaths = await fg(
    [
      'apps/*/package.json',
      'packages/*/package.json',
      'tools/*/package.json',
    ],
    { cwd: repoRoot, absolute: true },
  );

  // Also include root package.json
  const rootPkgPath = join(repoRoot, 'package.json');
  if (existsSync(rootPkgPath)) {
    packageJsonPaths.unshift(rootPkgPath);
  }

  const workspaceNames = new Set<string>();

  // First pass: collect all package names
  for (const pkgPath of packageJsonPaths) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.name) workspaceNames.add(pkg.name);
    } catch {
      // Skip malformed package.json
    }
  }

  // Second pass: build nodes and edges
  for (const pkgPath of packageJsonPaths) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const relPath = pkgPath
        .replace(/\\/g, '/')
        .replace(repoRoot.replace(/\\/g, '/') + '/', '')
        .replace('/package.json', '');

      const deps = Object.keys(pkg.dependencies ?? {});
      const devDeps = Object.keys(pkg.devDependencies ?? {});

      // Filter to workspace-internal deps only
      const internalDeps = deps.filter((d) => workspaceNames.has(d));
      const internalDevDeps = devDeps.filter((d) => workspaceNames.has(d));

      nodes.push({
        name: pkg.name ?? basename(relPath),
        path: relPath,
        version: pkg.version ?? '0.0.0',
        private: pkg.private ?? false,
        dependencies: internalDeps,
        devDependencies: internalDevDeps,
      });

      for (const dep of internalDeps) {
        edges.push({ from: pkg.name, to: dep, dev: false });
      }
      for (const dep of internalDevDeps) {
        edges.push({ from: pkg.name, to: dep, dev: true });
      }
    } catch {
      // Skip malformed package.json
    }
  }

  return { nodes, edges };
}
