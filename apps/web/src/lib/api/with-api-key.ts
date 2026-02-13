import { NextRequest, NextResponse } from 'next/server';

import { db, apiKeys, sql, eq, and, isNull } from 'afena-database';
import { runWithContext } from 'afena-logger';

import type { AuthSession } from './with-auth';
import type { RequestContext } from 'afena-logger';

/**
 * Validate an API key from the Authorization header.
 *
 * Expected format: `Authorization: Bearer afk_<key>`
 *
 * The key is hashed with SHA-256 and compared against stored hashes.
 * Returns the AuthSession-compatible context if valid, null otherwise.
 */
async function validateApiKey(request: NextRequest): Promise<AuthSession | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const rawKey = authHeader.slice(7).trim();
  if (!rawKey.startsWith('afk_')) return null;

  // Hash the key with SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const keyHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Look up the key in the database (bypasses RLS — uses admin context)
  const rows = await db
    .select()
    .from(apiKeys)
    .where(
      and(
        eq(apiKeys.keyHash, keyHash),
        isNull(apiKeys.revokedAt),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  // Check expiry
  if (row.expiresAt && row.expiresAt < new Date()) return null;

  // Update last_used_at (fire-and-forget) — infrastructure, not domain data
  // eslint-disable-next-line no-restricted-syntax -- infrastructure update, not domain data
  db.update(apiKeys)
    .set({ lastUsedAt: sql`now()` })
    .where(eq(apiKeys.id, row.id))
    .then(() => { })
    .catch(() => { });

  return {
    userId: row.createdBy,
    orgId: row.orgId,
    email: '',
    name: `API Key: ${row.label}`,
  };
}

/**
 * Wrap an API route handler with API key auth + standard envelope.
 *
 * Accepts `Authorization: Bearer afk_<key>` header.
 * Falls through to null if no API key is present (allows chaining with withAuth).
 *
 * Usage:
 * ```ts
 * export const GET = withApiKey(async (req, session) => {
 *   const data = await fetchSomething();
 *   return { ok: true, data };
 * });
 * ```
 */
export function withApiKey<T = unknown>(
  handler: (
    request: NextRequest,
    session: AuthSession,
  ) => Promise<{ ok: true; data: T } | { ok: false; code: string; message: string; status?: number }>,
) {
  return async function routeHandler(request: NextRequest): Promise<NextResponse> {
    const requestId = crypto.randomUUID();

    const session = await validateApiKey(request);
    if (!session) {
      return NextResponse.json(
        {
          ok: false as const,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' },
          meta: { requestId },
        },
        { status: 401 },
      );
    }

    const alsContext: RequestContext = {
      request_id: requestId,
      org_id: session.orgId,
      actor_id: session.userId,
      actor_type: 'service',
      service: 'web',
    };

    return runWithContext(alsContext, async () => {
      try {
        const result = await handler(request, session);

        if (result.ok) {
          return NextResponse.json({
            ok: true as const,
            data: result.data,
            meta: { requestId },
          });
        }

        return NextResponse.json(
          {
            ok: false as const,
            error: { code: result.code, message: result.message },
            meta: { requestId },
          },
          { status: result.status ?? 400 },
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Internal server error';
        return NextResponse.json(
          {
            ok: false as const,
            error: { code: 'INTERNAL_ERROR', message },
            meta: { requestId },
          },
          { status: 500 },
        );
      }
    });
  };
}
