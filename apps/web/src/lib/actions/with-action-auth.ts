'use server';

import { headers } from 'next/headers';

import { db, sql } from 'afena-database';
import { runWithContext } from 'afena-logger';

import { auth } from '@/lib/auth/server';
import { invalidateEntity } from '@/lib/cache/tags';
import { errorEnvelope, okEnvelope } from '@/lib/http/envelope';
import { toLoggerContext } from '@/lib/http/request-context';

import type { InvalidationTarget } from '@/lib/cache/tags';
import type { BffRequestContext } from '@/lib/http/request-context';
import type { ApiResponse, ErrorCode } from 'afena-canon';
import type { MutationContext } from 'afena-crud';

/**
 * Context passed to action handlers inside `withActionAuth`.
 */
export interface ActionContext {
  userId: string;
  orgId: string;
  orgSlug: string;
  roles: string[];
  email: string;
  name: string;
  requestId: string;
  ip: string | null;
  userAgent: string | null;
}

/**
 * Result shape returned by action handlers.
 * If `invalidate` is provided, `withActionAuth` calls `invalidateEntity()` automatically.
 */
export interface ActionResult<T = unknown> {
  data: T;
  invalidate?: InvalidationTarget;
}

/**
 * Server action gateway — parallel to `withAuth()` for route handlers.
 *
 * Always:
 *   - Establishes ALS via `runWithContext()` with full RequestContext
 *   - Validates session auth
 *   - Resolves org context from DB
 *   - Wraps in try/catch → maps to canon error codes
 *   - Includes ALS requestId in response meta
 *   - Binds logger fields (action logs auto-scoped)
 *   - Calls `invalidateEntity()` after successful mutation if handler returns `invalidate`
 */
export async function withActionAuth<T>(
  handler: (ctx: ActionContext) => Promise<ActionResult<T>>,
): Promise<ApiResponse<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ApiResponse generic constraint
  type AnyApiResponse = ApiResponse<any>;
  const requestId = crypto.randomUUID();

  // Auth check
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return errorEnvelope('POLICY_DENIED' as ErrorCode, 'No active session', requestId) as AnyApiResponse;
  }

  // Resolve org context
  const dbResult = await db.execute(
    sql`select auth.org_id() as org_id, auth.org_role() as role`,
  );
  const rows = (dbResult as Record<string, unknown>).rows as {
    org_id: string | null;
    role: string | null;
  }[];
  const orgId = rows?.[0]?.org_id ?? '';
  const role = rows?.[0]?.role ?? '';

  if (!orgId) {
    return errorEnvelope('MISSING_ORG_ID' as ErrorCode, 'No organization context', requestId) as AnyApiResponse;
  }

  // Read request metadata from headers
  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const userAgent = hdrs.get('user-agent');
  const path = hdrs.get('x-invoke-path') ?? hdrs.get('next-url') ?? '';

  // Build BFF context for ALS
  const bffCtx: BffRequestContext = {
    requestId,
    orgId,
    actorId: session.user.id,
    actorType: 'user',
    authMode: 'session',
    ip,
    userAgent,
    path,
    method: 'ACTION',
    tier: 'bff',
  };

  const loggerCtx = toLoggerContext(bffCtx);

  return runWithContext(loggerCtx, async (): Promise<ApiResponse<T>> => {
    try {
      const actionCtx: ActionContext = {
        userId: session.user.id,
        orgId,
        orgSlug: orgId,
        roles: role ? [role] : [],
        email: session.user.email ?? '',
        name: session.user.name ?? session.user.email ?? '',
        requestId,
        ip,
        userAgent,
      };

      const result = await handler(actionCtx);

      // Automatic cache invalidation
      if (result.invalidate) {
        invalidateEntity(orgId, result.invalidate.entityType, result.invalidate.entityId);
      }

      return okEnvelope(result.data, requestId);
    } catch (e) {
      if (e instanceof Error && 'code' in e) {
        const code = (e as { code: string }).code as ErrorCode;
        return errorEnvelope(code, e.message, requestId) as ApiResponse<T>;
      }
      const message = e instanceof Error ? e.message : 'Unexpected error';
      return errorEnvelope('INTERNAL_ERROR' as ErrorCode, message, requestId) as ApiResponse<T>;
    }
  });
}

/**
 * Lightweight variant of `withActionAuth` for actions that delegate to the kernel
 * and already receive an `ApiResponse`. Establishes ALS + auth + cache invalidation
 * but passes the kernel response through unchanged (no re-wrapping).
 *
 * Use this when the handler calls `generateEntityActions()` or `mutate()` directly.
 */
export async function withActionAuthPassthrough(
  handler: (ctx: ActionContext) => Promise<{
    result: ApiResponse;
    invalidate?: InvalidationTarget;
  }>,
): Promise<ApiResponse> {
  const requestId = crypto.randomUUID();

  // Auth check
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return errorEnvelope('POLICY_DENIED' as ErrorCode, 'No active session', requestId);
  }

  // Resolve org context
  const dbResult = await db.execute(
    sql`select auth.org_id() as org_id, auth.org_role() as role`,
  );
  const rows = (dbResult as Record<string, unknown>).rows as {
    org_id: string | null;
    role: string | null;
  }[];
  const orgId = rows?.[0]?.org_id ?? '';
  const role = rows?.[0]?.role ?? '';

  if (!orgId) {
    return errorEnvelope('MISSING_ORG_ID' as ErrorCode, 'No organization context', requestId);
  }

  // Read request metadata from headers
  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const userAgent = hdrs.get('user-agent');
  const path = hdrs.get('x-invoke-path') ?? hdrs.get('next-url') ?? '';

  const bffCtx: BffRequestContext = {
    requestId,
    orgId,
    actorId: session.user.id,
    actorType: 'user',
    authMode: 'session',
    ip,
    userAgent,
    path,
    method: 'ACTION',
    tier: 'bff',
  };

  const loggerCtx = toLoggerContext(bffCtx);

  return runWithContext(loggerCtx, async () => {
    try {
      const actionCtx: ActionContext = {
        userId: session.user.id,
        orgId,
        orgSlug: orgId,
        roles: role ? [role] : [],
        email: session.user.email ?? '',
        name: session.user.name ?? session.user.email ?? '',
        requestId,
        ip,
        userAgent,
      };

      const { result, invalidate } = await handler(actionCtx);

      // Automatic cache invalidation
      if (invalidate && result.ok) {
        invalidateEntity(orgId, invalidate.entityType, invalidate.entityId);
      }

      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unexpected error';
      return errorEnvelope('INTERNAL_ERROR' as ErrorCode, message, requestId);
    }
  });
}

/**
 * Build a MutationContext from an ActionContext.
 * Used by action handlers that need to call kernel `mutate()`.
 */
export async function toMutationContext(ctx: ActionContext): Promise<MutationContext> {
  // Server Actions require async, so we await Promise.resolve
  return Promise.resolve({
    requestId: ctx.requestId,
    actor: {
      userId: ctx.userId,
      orgId: ctx.orgId,
      roles: ctx.roles,
      email: ctx.email,
      name: ctx.name,
    },
    ...(ctx.ip ? { ip: ctx.ip } : {}),
    ...(ctx.userAgent ? { userAgent: ctx.userAgent } : {}),
    channel: 'web_ui',
  });
}
