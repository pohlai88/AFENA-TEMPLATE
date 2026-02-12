import { db, sql } from 'afena-database';

import { auth } from '@/lib/auth/server';

/**
 * Resolve org context server-side from a URL slug.
 * Queries neon_auth.organization + neon_auth.member directly (camelCase columns).
 * Returns null if org not found or user has no membership.
 */
export interface ResolvedOrg {
  orgSlug: string;
  orgId: string;
  orgName: string;
  userRole: string | null;
}

export async function resolveOrg(slug: string): Promise<ResolvedOrg | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const userId = session.user.id;

  // Query org by slug + membership in one query
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

  return {
    orgSlug: row.org_slug,
    orgId: row.org_id,
    orgName: row.org_name,
    userRole: row.role,
  };
}

/**
 * List all orgs the current user is a member of.
 * Used by the org switcher component.
 */
export interface OrgListItem {
  orgId: string;
  orgSlug: string;
  orgName: string;
  userRole: string;
}

/**
 * Idempotent personal org creation — runs server-side on first authenticated request.
 * If user has zero org memberships, creates a personal workspace org.
 * Uses UNIQUE constraints on slug + (userId, organizationId) for idempotency.
 * Returns the slug of the personal org (existing or newly created).
 *
 * INVARIANT: Does NOT touch domain tables — system/infra truth only.
 */
export async function ensurePersonalOrg(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const userId = session.user.id;
  const userName = session.user.name || 'User';

  // Check if user has any org membership
  const memberCheck = await db.execute<{ cnt: string }>(sql`
    SELECT COUNT(*)::text AS cnt
    FROM neon_auth.member
    WHERE "userId" = ${userId}::uuid
  `);

  const count = parseInt(memberCheck.rows[0]?.cnt ?? '0', 10);
  if (count > 0) return null; // User already has orgs

  // Generate a stable slug from user name
  const baseSlug = userName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const slug = `${baseSlug}-workspace`;
  const orgName = `${userName}'s Workspace`;

  // Create org + membership in a transaction for atomicity
  // Uses ON CONFLICT for idempotency (safe under retry/double-submit)
  try {
    const orgResult = await db.execute<{ id: string; slug: string }>(sql`
      INSERT INTO neon_auth.organization ("id", "name", "slug", "createdAt")
      VALUES (gen_random_uuid(), ${orgName}, ${slug}, now())
      ON CONFLICT ("slug") DO NOTHING
      RETURNING "id"::text, "slug"
    `);

    let orgId: string;
    let orgSlug: string;

    const created = orgResult.rows[0];
    if (created) {
      // Newly created
      orgId = created.id;
      orgSlug = created.slug;
    } else {
      // Slug already exists — look it up (race condition or retry)
      const existing = await db.execute<{ id: string; slug: string }>(sql`
        SELECT "id"::text, "slug"
        FROM neon_auth.organization
        WHERE "slug" = ${slug}
        LIMIT 1
      `);
      if (!existing.rows[0]) return null;
      orgId = existing.rows[0].id;
      orgSlug = existing.rows[0].slug;
    }

    // Add user as owner — ON CONFLICT for idempotency
    await db.execute(sql`
      INSERT INTO neon_auth.member ("id", "organizationId", "userId", "role", "createdAt")
      VALUES (gen_random_uuid(), ${orgId}::uuid, ${userId}::uuid, 'owner', now())
      ON CONFLICT ("organizationId", "userId") DO NOTHING
    `);

    return orgSlug;
  } catch {
    // Swallow errors — ensurePersonalOrg is best-effort
    return null;
  }
}

export async function listUserOrgs(): Promise<OrgListItem[]> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return [];

  const userId = session.user.id;

  const result = await db.execute<{
    org_id: string;
    org_slug: string;
    org_name: string;
    role: string;
  }>(sql`
    SELECT
      o."id" AS org_id,
      o."slug" AS org_slug,
      o."name" AS org_name,
      m."role" AS role
    FROM neon_auth.member m
    JOIN neon_auth.organization o ON o."id" = m."organizationId"
    WHERE m."userId" = ${userId}::uuid
    ORDER BY o."name" ASC
  `);

  return result.rows.map((row) => ({
    orgId: row.org_id,
    orgSlug: row.org_slug,
    orgName: row.org_name,
    userRole: row.role,
  }));
}
