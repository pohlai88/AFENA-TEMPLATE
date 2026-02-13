'use server';

import { db, sql } from 'afena-database';
import { getRequestId } from 'afena-logger';

import { auth } from '@/lib/auth/server';

import type { MutationContext } from 'afena-crud';

/**
 * Build MutationContext from the current server-side session.
 * Shared across all entity server actions.
 *
 * If an ALS context exists (e.g. from withAuth), reuses its requestId.
 * Otherwise generates a new one and establishes an ALS scope.
 */
export async function buildContext(): Promise<MutationContext> {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    throw new Error('Unauthorized — no active session');
  }

  const result = await db.execute(
    sql`select auth.org_id() as org_id, auth.org_role() as role`,
  );
  const rows = (result as Record<string, unknown>).rows as { org_id: string | null; role: string | null }[];
  const orgId = rows?.[0]?.org_id ?? '';
  const role = rows?.[0]?.role ?? '';

  // Reuse ALS requestId if available, otherwise generate a new one
  const requestId = getRequestId() ?? crypto.randomUUID();

  return {
    actor: {
      userId: session.user.id,
      orgId,
      roles: role ? [role] : [],
      email: session.user.email ?? '',
      name: session.user.name ?? session.user.email ?? '',
    },
    requestId,
    channel: 'web_ui',
  };
}

