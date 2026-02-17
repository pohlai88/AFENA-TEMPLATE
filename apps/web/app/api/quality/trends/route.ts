import { NextResponse } from 'next/server';
import { db, sql, gte } from 'afenda-database';
import { qualitySnapshots } from 'afenda-database';

export const dynamic = 'force-dynamic';

interface TrendData {
  date: string;
  coverage: number;
  buildTime: number;
  typeErrors: number;
  lintErrors: number;
  bundleSize: number;
  cacheHitRate: number;
}

interface SnapshotAggregate {
  date: string;
  avgCoverageLines: string;
  avgTypeErrors: number;
  avgLintErrors: number;
  avgBuildTime: number;
  avgBundleSize: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get('days')) || 7;

  try {
    // Get snapshots from last N days
    const since = new Date();
    since.setDate(since.getDate() - days);

    const snapshots = await db
      .select({
        date: sql<string>`DATE(${qualitySnapshots.createdAt})`,
        avgCoverageLines: sql<string>`AVG(${qualitySnapshots.coverageLines})`,
        avgTypeErrors: sql<number>`AVG(${qualitySnapshots.typeErrors})`,
        avgLintErrors: sql<number>`AVG(${qualitySnapshots.lintErrors})`,
        avgBuildTime: sql<number>`AVG(${qualitySnapshots.buildTimeMs})`,
        avgBundleSize: sql<number>`AVG(${qualitySnapshots.bundleSizeBytes})`,
      })
      .from(qualitySnapshots)
      .where(gte(qualitySnapshots.createdAt, since))
      .groupBy(sql`DATE(${qualitySnapshots.createdAt})`)
      .orderBy(sql`DATE(${qualitySnapshots.createdAt})`);

    const trends: TrendData[] = snapshots.map((snapshot: SnapshotAggregate) => ({
      date: snapshot.date,
      coverage: Number(snapshot.avgCoverageLines) || 0,
      typeErrors: Math.round(snapshot.avgTypeErrors || 0),
      lintErrors: Math.round(snapshot.avgLintErrors || 0),
      buildTime: Math.round(snapshot.avgBuildTime || 0),
      bundleSize: Math.round((snapshot.avgBundleSize || 0) / (1024 * 1024)), // Convert to MB
      cacheHitRate: 0, // TODO: Add cache hit rate tracking
    }));

    return NextResponse.json(trends);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch trends',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
