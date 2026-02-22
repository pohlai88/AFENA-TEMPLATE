/**
 * Dependency Graph API
 * GET /api/tools/dependency-graph
 *
 * Returns workspace package dependencies as nodes and edges for visualization
 */

import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface GraphNode {
  id: string;
  data: {
    label: string;
  };
  position: { x: number; y: number };
  type?: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    totalPackages: number;
    totalDependencies: number;
    internalDependencies: number;
    externalDependencies: number;
  };
}

/**
 * Load all workspace packages
 */
function loadWorkspacePackages(workspaceRoot: string): Map<string, PackageJson> {
  const packages = new Map<string, PackageJson>();

  // Load packages from packages/* directories
  const packagesDir = path.join(workspaceRoot, 'packages');

  if (!fs.existsSync(packagesDir)) {
    return packages;
  }

  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent: fs.Dirent) => dirent.isDirectory())
    .map((dirent: fs.Dirent) => dirent.name);

  packageDirs.forEach((dir: string) => {
    const pkgPath = path.join(packagesDir, dir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        packages.set(pkg.name, pkg);
      } catch (error) {
        console.error(`Failed to load ${pkgPath}:`, error);
      }
    }
  });

  // Load apps from apps/* directories
  const appsDir = path.join(workspaceRoot, 'apps');

  if (fs.existsSync(appsDir)) {
    const appDirs = fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter((dirent: fs.Dirent) => dirent.isDirectory())
      .map((dirent: fs.Dirent) => dirent.name);

    appDirs.forEach((dir: string) => {
      const pkgPath = path.join(appsDir, dir, 'package.json');

      if (fs.existsSync(pkgPath)) {
        try {
          const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          packages.set(pkg.name, pkg);
        } catch (error) {
          console.error(`Failed to load ${pkgPath}:`, error);
        }
      }
    });
  }

  return packages;
}

/**
 * Build dependency graph from workspace packages
 */
function buildDependencyGraph(packages: Map<string, PackageJson>): DependencyGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const packageNames = new Set(packages.keys());

  let internalDeps = 0;
  let externalDeps = 0;
  let nodeIndex = 0;

  // Calculate layout positions (simple circular layout)
  const radius = 300;
  const packageArray = Array.from(packages.entries());
  const angleStep = (2 * Math.PI) / packageArray.length;

  packages.forEach((pkg, pkgName) => {
    // Add node
    const angle = nodeIndex * angleStep;
    const x = 400 + radius * Math.cos(angle);
    const y = 400 + radius * Math.sin(angle);

    nodes.push({
      id: pkgName,
      data: {
        label: pkgName.replace('afenda-', ''),
      },
      position: { x, y },
      type: pkgName.startsWith('afenda-') ? 'default' : 'output',
    });

    // Add edges for dependencies
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    Object.keys(allDeps).forEach((depName) => {
      if (packageNames.has(depName)) {
        // Internal dependency (within workspace)
        edges.push({
          id: `${pkgName}-${depName}`,
          source: pkgName,
          target: depName,
          type: 'default',
        });
        internalDeps++;
      } else {
        // External dependency (npm packages)
        externalDeps++;
      }
    });

    nodeIndex++;
  });

  return {
    nodes,
    edges,
    stats: {
      totalPackages: packages.size,
      totalDependencies: internalDeps + externalDeps,
      internalDependencies: internalDeps,
      externalDependencies: externalDeps,
    },
  };
}

export async function GET() {
  try {
    // Get workspace root (assuming we're in apps/web)
    const workspaceRoot = path.resolve(process.cwd(), '../..');

    // Load all workspace packages
    const packages = loadWorkspacePackages(workspaceRoot);

    if (packages.size === 0) {
      return NextResponse.json({
        nodes: [],
        edges: [],
        stats: {
          totalPackages: 0,
          totalDependencies: 0,
          internalDependencies: 0,
          externalDependencies: 0,
        },
      });
    }

    // Build dependency graph
    const graph = buildDependencyGraph(packages);

    return NextResponse.json(graph);
  } catch (error) {
    console.error('Dependency graph generation failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate dependency graph',
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
