/**
 * Codebase manifest emitter — generates .afenda/codebase.manifest.json
 * with structural metadata: package graph, schema catalog, and stats.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import type { PackageGraph } from '../collectors/package-graph';
import type { SchemaCatalog } from '../collectors/schema-catalog';
import type { RepoStats } from '../collectors/stats';

export interface CodebaseManifest {
  version: '1.0';
  generatedAt: string;
  packageGraph: PackageGraph;
  schemaCatalog: {
    tableCount: number;
    totalColumns: number;
    tables: {
      name: string;
      file: string;
      columnCount: number;
      hasRls: boolean;
      hasOrgId: boolean;
    }[];
  };
  stats: {
    totalFiles: number;
    totalLoc: number;
    totalTestFiles: number;
    totalTestLoc: number;
    packages: {
      name: string;
      fileCount: number;
      loc: number;
      testFileCount: number;
      testLoc: number;
    }[];
  };
}

/**
 * Generate the codebase manifest from collected data.
 */
export function generateManifest(
  packageGraph: PackageGraph,
  schemaCatalog: SchemaCatalog,
  repoStats: RepoStats,
): CodebaseManifest {
  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    packageGraph,
    schemaCatalog: {
      tableCount: schemaCatalog.tables.length,
      totalColumns: schemaCatalog.totalColumns,
      tables: schemaCatalog.tables.map((t) => ({
        name: t.tableName,
        file: t.file,
        columnCount: t.columns.length,
        hasRls: t.hasRls,
        hasOrgId: t.hasOrgId,
      })),
    },
    stats: {
      totalFiles: repoStats.totalFiles,
      totalLoc: repoStats.totalLoc,
      totalTestFiles: repoStats.totalTestFiles,
      totalTestLoc: repoStats.totalTestLoc,
      packages: repoStats.packages.map((p) => ({
        name: p.name,
        fileCount: p.fileCount,
        loc: p.loc,
        testFileCount: p.testFileCount,
        testLoc: p.testLoc,
      })),
    },
  };
}

/**
 * Write the manifest to .afenda/codebase.manifest.json.
 */
export function writeManifest(repoRoot: string, manifest: CodebaseManifest): void {
  const outPath = join(repoRoot, '.afenda', 'codebase.manifest.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)  }\n`, 'utf-8');
}
