/**
 * Coverage Heatmap API
 * GET /api/quality/coverage-heatmap
 *
 * Returns package-level coverage data for heatmap visualization
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Not implemented', message: 'Quality snapshots schema not yet provisioned' },
    { status: 503 },
  );
}
