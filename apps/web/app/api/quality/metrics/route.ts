import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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
