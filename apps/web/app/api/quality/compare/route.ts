import { NextResponse } from 'next/server';
import { db, desc, eq } from 'afenda-database';
import { qualitySnapshots } from 'afenda-database';

export const dynamic = 'force-dynamic';

interface ComparisonResult {
  current: {
    sha: string;
    branch: string;
    timestamp: string;
    coverage: {
      lines: number;
      functions: number;
      statements: number;
      branches: number;
    };
    quality: {
      typeErrors: number;
      lintErrors: number;
      lintWarnings: number;
    };
  };
  baseline: {
    sha: string;
    branch: string;
    timestamp: string;
    coverage: {
      lines: number;
      functions: number;
      statements: number;
      branches: number;
    };
    quality: {
      typeErrors: number;
      lintErrors: number;
      lintWarnings: number;
    };
  } | null;
  diff: {
    coverage: {
      lines: number;
      functions: number;
      statements: number;
      branches: number;
    };
    quality: {
      typeErrors: number;
      lintErrors: number;
      lintWarnings: number;
    };
  } | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sha = searchParams.get('sha');
  const baseBranch = searchParams.get('base') || 'main';

  if (!sha) {
    return NextResponse.json({ error: 'Missing sha parameter' }, { status: 400 });
  }

  try {
    // Get current snapshot
    const [current] = await db
      .select()
      .from(qualitySnapshots)
      .where(eq(qualitySnapshots.gitSha, sha))
      .orderBy(desc(qualitySnapshots.createdAt))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: 'Snapshot not found for SHA' }, { status: 404 });
    }

    // Get baseline snapshot
    const [baseline] = await db
      .select()
      .from(qualitySnapshots)
      .where(eq(qualitySnapshots.gitBranch, baseBranch))
      .orderBy(desc(qualitySnapshots.createdAt))
      .limit(1);

    const currentData = {
      sha: current.gitSha,
      branch: current.gitBranch,
      timestamp: current.createdAt.toISOString(),
      coverage: {
        lines: Number(current.coverageLines) || 0,
        functions: Number(current.coverageFunctions) || 0,
        statements: Number(current.coverageStatements) || 0,
        branches: Number(current.coverageBranches) || 0,
      },
      quality: {
        typeErrors: current.typeErrors || 0,
        lintErrors: current.lintErrors || 0,
        lintWarnings: current.lintWarnings || 0,
      },
    };

    const baselineData = baseline
      ? {
          sha: baseline.gitSha,
          branch: baseline.gitBranch,
          timestamp: baseline.createdAt.toISOString(),
          coverage: {
            lines: Number(baseline.coverageLines) || 0,
            functions: Number(baseline.coverageFunctions) || 0,
            statements: Number(baseline.coverageStatements) || 0,
            branches: Number(baseline.coverageBranches) || 0,
          },
          quality: {
            typeErrors: baseline.typeErrors || 0,
            lintErrors: baseline.lintErrors || 0,
            lintWarnings: baseline.lintWarnings || 0,
          },
        }
      : null;

    const diff = baselineData
      ? {
          coverage: {
            lines: currentData.coverage.lines - baselineData.coverage.lines,
            functions: currentData.coverage.functions - baselineData.coverage.functions,
            statements: currentData.coverage.statements - baselineData.coverage.statements,
            branches: currentData.coverage.branches - baselineData.coverage.branches,
          },
          quality: {
            typeErrors: currentData.quality.typeErrors - baselineData.quality.typeErrors,
            lintErrors: currentData.quality.lintErrors - baselineData.quality.lintErrors,
            lintWarnings: currentData.quality.lintWarnings - baselineData.quality.lintWarnings,
          },
        }
      : null;

    const result: ComparisonResult = {
      current: currentData,
      baseline: baselineData,
      diff,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to compare metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
