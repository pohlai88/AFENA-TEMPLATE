import { db, sql } from 'afenda-database';
import { cache } from 'react';


import { auth } from '@/lib/auth/server';

/**
 * Sealed org context contract — the only place that reads auth claims for shell.
 * Wrapped in React.cache() for request-level deduplication.
 */
export interface OrgContext {
  org: { id: string; slug: string; name: string };
  actor: { userId: string; email: string; roles: string[]; orgRole: string };
  nav?: { canViewSettings: boolean };
}

export const getOrgContext = cache(async (slug: string): Promise<OrgContext | null> => {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const userId = session.user.id;
  const email = session.user.email ?? '';

  const result = await db.execute<{
    org_id: string;
    org_name: string;
    org_slug: string;
    role: string | null;
  }>(sql`
    SELECT
      o."id" AS org_id,
      o."name" AS org_name,
      o."slug" AS org_slug,
      m."role" AS role
    FROM neon_auth.organization o
    LEFT JOIN neon_auth.member m
      ON m."organizationId" = o."id"
      AND m."userId" = ${userId}::uuid
    WHERE o."slug" = ${slug}
    LIMIT 1
  `);

  const row = result.rows[0];
  if (!row) return null;

  const orgRole = row.role ?? 'viewer';

  return {
    org: {
      id: row.org_id,
      slug: row.org_slug,
      name: row.org_name,
    },
    actor: {
      userId,
      email,
      roles: [orgRole],
      orgRole,
    },
    nav: {
      canViewSettings: orgRole === 'owner' || orgRole === 'admin',
    },
  };
});
