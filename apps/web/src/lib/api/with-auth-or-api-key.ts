import { NextRequest, NextResponse } from 'next/server';

import { db, apiKeys, sql, eq, and, isNull } from 'afena-database';
import { runWithContext } from 'afena-logger';

import { auth } from '@/lib/auth/server';

import type { AuthSession } from './with-auth';
import type { RequestContext } from 'afena-logger';

/**
 * Validate an API key from the Authorization header.
 * Returns AuthSession if valid, null otherwise.
 */
async function tryApiKey(request: NextRequest): Promise<AuthSession | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer afk_')) return null;

  const rawKey = authHeader.slice(7).trim();

  const encoder = new TextEncoder();
  const data = encoder.encode(rawKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const keyHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt && row.expiresAt < new Date()) return null;

  // Update last_used_at (fire-and-forget) — infrastructure, not domain data
   
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
 * Try session auth. Returns AuthSession if valid, null otherwise.
 */
async function trySession(): Promise<AuthSession | null> {
  const { data: sessionData } = await auth.getSession();
  if (!sessionData?.user) return null;

  const dbResult = await db.execute(sql`select auth.org_id() as org_id`);
  const rows = (dbResult as Record<string, unknown>).rows as { org_id: string | null }[];
  const orgId = rows?.[0]?.org_id ?? '';

  return {
    userId: sessionData.user.id,
    orgId,
    email: sessionData.user.email ?? '',
    name: sessionData.user.name ?? sessionData.user.email ?? '',
  };
}

/**
 * Wrap an API route handler with dual auth: session cookie OR API key.
 *
 * Tries API key first (if `Authorization: Bearer afk_...` present),
 * then falls back to session cookie auth.
 *
 * Usage:
 * ```ts
 * export const GET = withAuthOrApiKey(async (req, session) => {
 *   return { ok: true, data: await fetchSomething() };
 * });
 * ```
 */
export function withAuthOrApiKey<T = unknown>(
  handler: (
    request: NextRequest,
    session: AuthSession,
  ) => Promise<
    | { ok: true; data: T; meta?: { totalCount?: number; nextCursor?: string } }
    | { ok: false; code: string; message: string; status?: number }
  >,
) {
  return async function routeHandler(request: NextRequest): Promise<NextResponse> {
    const requestId = crypto.randomUUID();

    // Try API key first, then session
    const session = (await tryApiKey(request)) ?? (await trySession());

    if (!session) {
      return NextResponse.json(
        {
          ok: false as const,
          error: { code: 'UNAUTHORIZED', message: 'No valid session or API key' },
          meta: { requestId },
        },
        { status: 401 },
      );
    }

    const actorType = request.headers.get('authorization')?.startsWith('Bearer afk_')
      ? 'service'
      : 'user';

    const alsContext: RequestContext = {
      request_id: requestId,
      org_id: session.orgId,
      actor_id: session.userId,
      actor_type: actorType,
      service: 'web',
    };

    return runWithContext(alsContext, async () => {
      try {
        const result = await handler(request, session);

        if (result.ok) {
          return NextResponse.json({
            ok: true as const,
            data: result.data,
            meta: { requestId, ...result.meta },
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
