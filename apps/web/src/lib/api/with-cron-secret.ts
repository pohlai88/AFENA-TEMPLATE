import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate CRON_SECRET for internal/cron endpoints.
 * Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
 *
 * Returns 401 if missing or invalid.
 */
export function requireCronSecret(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing CRON_SECRET' } },
      { status: 401 },
    );
  }

  return null;
}
