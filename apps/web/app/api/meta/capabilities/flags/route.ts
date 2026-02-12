import { NextRequest } from 'next/server';

import { withAuth } from '@/lib/api/with-auth';
import {
  getAllCapabilityFlags,
  setCapabilityFlag,
} from '@/lib/capabilities/feature-flags';

export const CAPABILITIES = ['admin.views.manage'] as const;

/**
 * GET /api/meta/capabilities/flags
 *
 * Returns all capability flags with their enabled/disabled state.
 * Requires admin auth.
 */
export const GET = withAuth(() => {
  const flags = getAllCapabilityFlags();
  return Promise.resolve({ ok: true as const, data: flags });
});

/**
 * POST /api/meta/capabilities/flags
 *
 * Toggle a capability flag. Body: { key: string, enabled: boolean }
 * Requires admin auth.
 */
export const POST = withAuth(async (request: NextRequest) => {
  const body = (await request.json()) as { key: string; enabled: boolean };
  const { key, enabled } = body;

  if (!key || typeof enabled !== 'boolean') {
    return {
      ok: false as const,
      code: 'VALIDATION_FAILED',
      message: 'Body must include { key: string, enabled: boolean }',
    };
  }

  try {
    setCapabilityFlag(key, enabled);
    return { ok: true as const, data: { key, enabled } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false as const, code: 'VALIDATION_FAILED', message };
  }
});
