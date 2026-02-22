import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 30;

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
