/**
 * Stats collector — LOC, file count per package.
 * Counts TypeScript/JavaScript source files and lines of code.
 */

import { readFileSync } from 'fs';
import fg from 'fast-glob';

export interface PackageStats {
  name: string;
  path: string;
  fileCount: number;
  loc: number;
  testFileCount: number;
  testLoc: number;
}

export interface RepoStats {
  packages: PackageStats[];
  totalFiles: number;
  totalLoc: number;
  totalTestFiles: number;
  totalTestLoc: number;
}

/**
 * Collect LOC and file count stats per workspace package.
 */
export async function collectStats(repoRoot: string): Promise<RepoStats> {
  const packages: PackageStats[] = [];

  const packageDirs = await fg(
    [
      'apps/*',
      'packages/*',
      'tools/*',
    ],
    { cwd: repoRoot, onlyDirectories: true },
  );

  for (const dir of packageDirs) {
    const srcFiles = await fg(
      ['**/*.{ts,tsx,js,jsx}'],
      {
        cwd: `${repoRoot}/${dir}`,
        absolute: true,
        ignore: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.next/**',
          '**/*.config.*',
          '**/*.d.ts',
        ],
      },
    );

    let loc = 0;
    let testLoc = 0;
    let testFileCount = 0;

    for (const file of srcFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n').length;
      const relFile = file.replace(/\\/g, '/');
      const isTest = relFile.includes('.test.') || relFile.includes('.spec.') || relFile.includes('__tests__');

      if (isTest) {
        testLoc += lines;
        testFileCount++;
      } else {
        loc += lines;
      }
    }

    packages.push({
      name: dir,
      path: dir,
      fileCount: srcFiles.length - testFileCount,
      loc,
      testFileCount,
      testLoc,
    });
  }

  return {
    packages,
    totalFiles: packages.reduce((s, p) => s + p.fileCount, 0),
    totalLoc: packages.reduce((s, p) => s + p.loc, 0),
    totalTestFiles: packages.reduce((s, p) => s + p.testFileCount, 0),
    totalTestLoc: packages.reduce((s, p) => s + p.testLoc, 0),
  };
}
