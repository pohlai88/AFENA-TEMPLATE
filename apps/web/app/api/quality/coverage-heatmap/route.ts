/**
 * Coverage Heatmap API
 * GET /api/quality/coverage-heatmap
 *
 * Returns package-level coverage data for heatmap visualization
 */

import { NextResponse } from 'next/server';

// Database imports (optional)
let db: any = null;
let qualitySnapshots: any = null;
let qualityPackageMetrics: any = null;
let desc: any = null;

try {
  const dbModule = await import('afenda-database');
  db = dbModule.db;
  qualitySnapshots = dbModule.qualitySnapshots;
  qualityPackageMetrics = dbModule.qualityPackageMetrics;
  const drizzle = await import('drizzle-orm');
  desc = drizzle.desc;
} catch (error) {
  // Database not available
  console.log('Database not available for coverage heatmap');
}

interface PackageCoverage {
  name: string;
  lines: number;
  functions: number;
  statements: number;
  branches: number;
  overall: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface CoverageHeatmapData {
  packages: PackageCoverage[];
  timestamp: string;
  averages: {
    lines: number;
    functions: number;
    statements: number;
    branches: number;
  };
}

/**
 * Determine coverage status based on overall coverage
 */
function getCoverageStatus(coverage: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (coverage >= 90) return 'excellent';
  if (coverage >= 80) return 'good';
  if (coverage >= 60) return 'fair';
  return 'poor';
}

/**
 * Calculate overall coverage from individual metrics
 */
function calculateOverall(
  lines: number,
  functions: number,
  statements: number,
  branches: number,
): number {
  return (lines + functions + statements + branches) / 4;
}

export async function GET() {
  try {
    if (!db || !qualitySnapshots || !qualityPackageMetrics || !process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'Set DATABASE_URL to enable coverage heatmap',
        },
        { status: 503 },
      );
    }

    // Get latest snapshot
    const latestSnapshot = await db
      .select()
      .from(qualitySnapshots)
      .orderBy(desc(qualitySnapshots.createdAt))
      .limit(1);

    if (!latestSnapshot || latestSnapshot.length === 0) {
      return NextResponse.json({
        packages: [],
        timestamp: new Date().toISOString(),
        averages: { lines: 0, functions: 0, statements: 0, branches: 0 },
      });
    }

    const snapshot = latestSnapshot[0];

    // Get package metrics for this snapshot
    const packageMetrics = await db
      .select()
      .from(qualityPackageMetrics)
      .where(({ snapshotId }: any, { eq }: any) => eq(snapshotId, snapshot.id));

    // Transform into heatmap format
    const packages: PackageCoverage[] = packageMetrics.map((pkg: any) => {
      const overall = calculateOverall(
        pkg.coverageLines || 0,
        pkg.coverageFunctions || 0,
        pkg.coverageStatements || 0,
        pkg.coverageBranches || 0,
      );

      return {
        name: pkg.packageName.replace('afenda-', ''),
        lines: pkg.coverageLines || 0,
        functions: pkg.coverageFunctions || 0,
        statements: pkg.coverageStatements || 0,
        branches: pkg.coverageBranches || 0,
        overall,
        status: getCoverageStatus(overall),
      };
    });

    // Calculate averages
    const averages = {
      lines: packages.reduce((sum, p) => sum + p.lines, 0) / packages.length || 0,
      functions: packages.reduce((sum, p) => sum + p.functions, 0) / packages.length || 0,
      statements: packages.reduce((sum, p) => sum + p.statements, 0) / packages.length || 0,
      branches: packages.reduce((sum, p) => sum + p.branches, 0) / packages.length || 0,
    };

    return NextResponse.json({
      packages,
      timestamp: snapshot.createdAt.toISOString(),
      averages,
    });
  } catch (error) {
    console.error('Coverage heatmap generation failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate coverage heatmap',
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
