import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole } from 'drizzle-orm/neon';

/**
 * Tenant isolation — EVERY domain table.
 *
 * Generates:
 *   INSERT WITH CHECK (auth.org_id() = org_id)
 *   SELECT USING       (auth.org_id() = org_id)
 *   UPDATE USING+CHECK  (auth.org_id() = org_id)
 *   DELETE USING        (auth.org_id() = org_id)
 *
 * The `(select ...)` wrapper enables Postgres to cache the RLS predicate
 * per-statement instead of re-evaluating per-row.
 *
 * [Hardening #4: WITH CHECK confirmed on INSERT/UPDATE]
 */
export const tenantPolicy = (table: { orgId: any }) =>
  crudPolicy({
    role: authenticatedRole,
    read: sql`(select auth.org_id() = ${table.orgId})`,
    modify: sql`(select auth.org_id() = ${table.orgId})`,
  });

/**
 * Owner access within org — OPT-IN per table only.
 *
 * READ:   org member + (row owner OR admin/owner role)
 * MODIFY: org member + row owner only (admins cannot modify others' rows)
 *
 * [Hardening #5: auth.org_role() only on tables that truly need it]
 */
export const ownerPolicy = (table: { orgId: any; userId: any }) =>
  crudPolicy({
    role: authenticatedRole,
    read: sql`(select auth.org_id() = ${table.orgId} AND (auth.user_id() = ${table.userId} OR auth.org_role() IN ('owner','admin')))`,
    modify: sql`(select auth.org_id() = ${table.orgId} AND auth.user_id() = ${table.userId})`,
  });
