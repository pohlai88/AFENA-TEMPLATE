import { NextRequest, NextResponse } from 'next/server';

import { checkRateLimit } from 'afenda-crud';
import { db, sql } from 'afenda-database';
import { runWithContext } from 'afenda-logger';

import { auth } from '@/lib/auth/server';

import type { RequestContext } from 'afenda-logger';

/**
 * Authenticated session info passed to route handlers.
 */
export interface AuthSession {
  userId: string;
  orgId: string;
  email: string;
  name: string;
}

/**
 * Standard API error response shape.
 */
interface ApiErrorResponse {
  ok: false;
  error: { code: string; message: string };
  meta: { requestId: string };
}

/**
 * Standard API success response shape.
 */
interface ApiSuccessResponse<T = unknown> {
  ok: true;
  data: T;
  meta: { requestId: string };
}

type ApiJsonResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Wrap an API route handler with auth guard + standard envelope.
 *
 * Usage:
 * ```ts
 * export const GET = withAuth(async (req, session) => {
 *   const data = await fetchSomething();
 *   return { ok: true, data };
 * });
 * ```
 */
export function withAuth<T = unknown>(
  handler: (
    request: NextRequest,
    session: AuthSession,
  ) => Promise<{ ok: true; data: T } | { ok: false; code: string; message: string; status?: number }>,
) {
  return async function routeHandler(request: NextRequest): Promise<NextResponse<ApiJsonResponse<T>>> {
    const requestId = crypto.randomUUID();

    // Auth check
    const { data: sessionData } = await auth.getSession();
    if (!sessionData?.user) {
      return NextResponse.json(
        {
          ok: false as const,
          error: { code: 'UNAUTHORIZED', message: 'No active session' },
          meta: { requestId },
        },
        { status: 401 },
      );
    }

    // Resolve org context from DB session
    const dbResult = await db.execute(
      sql`select auth.org_id() as org_id`,
    );
    const rows = (dbResult as Record<string, unknown>).rows as { org_id: string | null }[];
    const orgId = rows?.[0]?.org_id ?? '';

    const session: AuthSession = {
      userId: sessionData.user.id,
      orgId,
      email: sessionData.user.email ?? '',
      name: sessionData.user.name ?? sessionData.user.email ?? '',
    };

    // Rate limit check (kernel invariant — INVARIANT-RL-01)
    if (orgId) {
      const rl = checkRateLimit(orgId, 'api');
      if (!rl.allowed) {
        return NextResponse.json(
          {
            ok: false as const,
            error: { code: 'RATE_LIMITED', message: `Rate limit exceeded (resets in ${rl.resetMs}ms)` },
            meta: { requestId },
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(rl.resetMs / 1000)),
              'X-RateLimit-Limit': String(rl.limit),
              'X-RateLimit-Remaining': '0',
            },
          },
        );
      }
    }

    // Establish ALS context so all downstream code can access requestId, orgId, etc.
    const alsContext: RequestContext = {
      request_id: requestId,
      org_id: orgId,
      actor_id: session.userId,
      actor_type: 'user',
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
