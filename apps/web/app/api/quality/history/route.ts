import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { db, desc, eq } from 'afenda-database';
import { qualitySnapshots, qualityPackageMetrics } from 'afenda-database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 30;
  const days = Number(searchParams.get('days')) || 30;

  // Try database first
  try {
    const snapshots = await db
      .select()
      .from(qualitySnapshots)
      .orderBy(desc(qualitySnapshots.createdAt))
      .limit(Math.min(limit, 100)); // Cap at 100

    if (snapshots.length > 0) {
      const history = await Promise.all(
        snapshots.map(async (snapshot) => {
          // Fetch package metrics for this snapshot
          let packages: any[] = [];
          try {
            const packageMetrics = await db
              .select()
              .from(qualityPackageMetrics)
              .where(eq(qualityPackageMetrics.snapshotId, snapshot.id))
              .limit(10);

            packages = packageMetrics.map((pkg) => ({
              packageName: pkg.packageName,
              coverage: Number(pkg.coverage) || 0,
              lines: pkg.lineCount || 0,
              complexity: Number(pkg.complexityAvg) || 0,
            }));
          } catch (err) {
            // Package metrics might not exist yet
            packages = [];
          }

          return {
            timestamp: snapshot.createdAt.toISOString(),
            coverage: {
              lines: Number(snapshot.coverageLines) || 0,
              functions: Number(snapshot.coverageFunctions) || 0,
              branches: Number(snapshot.coverageBranches) || 0,
              statements: Number(snapshot.coverageStatements) || 0,
            },
            build: {
              duration: snapshot.buildTimeMs || 0,
              cacheHitRate: 0, // Not tracked in database yet
              bundleSize: snapshot.bundleSizeBytes || 0,
            },
            codeQuality: {
              typeErrors: snapshot.typeErrors || 0,
              lintWarnings: snapshot.lintWarnings || 0,
              lintErrors: snapshot.lintErrors || 0,
              todoCount: (snapshot.metadata as any)?.codeStats?.todoCount || 0,
              filesCount: (snapshot.metadata as any)?.codeStats?.filesCount || 0,
              linesOfCode: (snapshot.metadata as any)?.codeStats?.linesOfCode || 0,
            },
            git: {
              sha: snapshot.gitSha,
              branch: snapshot.gitBranch,
              author: snapshot.gitAuthor || '',
              message: snapshot.gitCommitMessage || '',
            },
            packages,
          };
        }),
      );

      return NextResponse.json(history.reverse()); // Oldest first for charts
    }
  } catch (error) {
    console.warn('Failed to fetch from database, falling back to file:', error);
  }

  // Fallback to file-based history
  const historyPath = join(process.cwd(), '..', '..', '.quality-metrics', 'history.jsonl');

  if (!existsSync(historyPath)) {
    return NextResponse.json(
      {
        error: 'History not found',
        message: 'No metrics history available',
      },
      { status: 404 },
    );
  }

  try {
    const lines = readFileSync(historyPath, 'utf-8')
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    // Return last N data points
    const recent = lines.slice(-limit);

    return NextResponse.json(recent);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to read history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
