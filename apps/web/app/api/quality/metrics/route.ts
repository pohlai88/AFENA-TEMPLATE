import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { db } from 'afenda-database';
import { qualitySnapshots } from 'afenda-database';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface QualityMetrics {
  timestamp: string;
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  build: {
    duration: number;
    cacheHitRate: number;
    bundleSize: number;
  };
  codeQuality: {
    typeErrors: number;
    lintWarnings: number;
    lintErrors: number;
    todoCount: number;
    filesCount: number;
    linesOfCode: number;
  };
  git: {
    commitCount: number;
    contributors: number;
    lastCommitDate: string;
    filesChanged: number;
  };
}

export async function GET() {
  // Try database first
  try {
    const [snapshot] = await db
      .select()
      .from(qualitySnapshots)
      .orderBy(desc(qualitySnapshots.createdAt))
      .limit(1);

    if (snapshot) {
      // Transform database format to API format
      const metrics: QualityMetrics = {
        timestamp: snapshot.createdAt.toISOString(),
        coverage: {
          lines: Number(snapshot.coverageLines) || 0,
          functions: Number(snapshot.coverageFunctions) || 0,
          branches: Number(snapshot.coverageBranches) || 0,
          statements: Number(snapshot.coverageStatements) || 0,
        },
        build: {
          duration: snapshot.buildTimeMs || 0,
          cacheHitRate: 0, // Not tracked yet
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
          commitCount: 0, // Not tracked in snapshot
          contributors: 0, // Not tracked in snapshot
          lastCommitDate: snapshot.createdAt.toISOString(),
          filesChanged: 0, // Not tracked in snapshot
        },
      };

      return NextResponse.json(metrics);
    }
  } catch (error) {
    console.warn('Failed to fetch from database, falling back to file:', error);
  }

  // Fallback to file-based metrics
  const metricsPath = join(process.cwd(), '..', '..', '.quality-metrics', 'latest.json');

  if (!existsSync(metricsPath)) {
    return NextResponse.json(
      {
        error: 'Metrics not found',
        message: 'Run `pnpm --filter quality-metrics collect` to generate metrics',
      },
      { status: 404 },
    );
  }

  try {
    const metrics: QualityMetrics = JSON.parse(readFileSync(metricsPath, 'utf-8'));
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to read metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
