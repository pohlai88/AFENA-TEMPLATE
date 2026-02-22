/**
 * applyEntity — Generic entity write for the v1.1 handler pipeline (Phase 5)
 *
 * Extracted from the former companies.ts / contacts.ts verb methods into a
 * single kernel function that operates on any registered entity type via
 * `getTableForEntityType()`.  This is what `commitPlan()` calls when
 * dispatching to a v1.1 handler (i.e. `createBaseHandler()` or any handler
 * with `__v11: true` and no custom entity write override).
 *
 * Supported verbs: create | update | delete | restore
 * (submit / approve / reject / cancel / amend are workflow verbs and still
 *  require custom handler implementations via v1.0 or v1.1 commit hooks.)
 *
 * Column contracts (BaseEntity):
 *   - All tables must have: id, version, createdBy, updatedBy
 *   - Soft-delete tables must also have: isDeleted, deletedAt, deletedBy
 *
 * @see handlers/base-handler.ts — createBaseHandler()
 * @see INTEGRATION_PLAN.md §5.3 — commit/apply-entity.ts
 */

import { getTableForEntityType, pickWritable } from 'afenda-database';
import { and, eq, sql } from 'drizzle-orm';

import type { MutationContext } from '../context';
import type { HandlerResult } from '../handlers/types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toRecord(row: Record<string, unknown>): Record<string, unknown> {
  return { ...row };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic entity write
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Perform the standard entity write for a v1.1 handler inside an open Drizzle
 * transaction.  Dispatches by `verb` and applies the BaseEntity column contracts
 * (version bumping, soft-delete stamps, actor stamping).
 *
 * Throws:
 *   `NOT_FOUND`           — row missing or soft-deleted (for update/delete/restore)
 *   `CONFLICT_VERSION`    — optimistic-lock mismatch
 *   `Insert returned no rows` — create succeeded but `.returning()` was empty
 *
 * @param tx            - Open Drizzle transaction (from withMutationTransaction)
 * @param entityType    - Registry key e.g. 'companies', 'invoices'
 * @param verb          - 'create' | 'update' | 'delete' | 'restore'
 * @param entityId      - Required for update / delete / restore; undefined for create
 * @param sanitizedInput - Field-policy-filtered input (from buildMutationPlan)
 * @param expectedVer   - Required for update / delete / restore; undefined for create
 * @param ctx           - MutationContext for actor stamps
 */
export async function applyEntity(
  tx: any,
  entityType: string,
  verb: string,
  entityId: string | undefined,
  sanitizedInput: Record<string, unknown>,
  expectedVer: number | undefined,
  ctx: MutationContext,
): Promise<HandlerResult> {
  const table = getTableForEntityType(entityType) as any;
  if (!table) throw new Error(`No table registered for entity type: ${entityType}`);

  switch (verb) {
    case 'create': {
      const allowed = pickWritable(table, sanitizedInput) as any;
      const [row] = await tx
        .insert(table)
        .values({
          ...allowed,
          createdBy: ctx.actor.userId,
          updatedBy: ctx.actor.userId,
        })
        .returning();
      if (!row) throw new Error('Insert returned no rows');
      return {
        entityId: row.id,
        before: null,
        after: toRecord(row as Record<string, unknown>),
        versionBefore: null,
        versionAfter: 1,
      };
    }

    case 'update': {
      const [beforeRow] = await tx
        .select()
        .from(table)
        .where(eq(table.id, entityId))
        .limit(1);
      if (!beforeRow) throw new Error('NOT_FOUND');
      if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
      if (beforeRow.version !== expectedVer) throw new Error('CONFLICT_VERSION');
      const allowed = pickWritable(table, sanitizedInput) as any;
      const [afterRow] = await tx
        .update(table)
        .set({
          ...allowed,
          updatedBy: ctx.actor.userId,
          version: sql`${table.version} + 1`,
        })
        .where(and(eq(table.id, entityId), eq(table.version, expectedVer)))
        .returning();
      if (!afterRow) throw new Error('CONFLICT_VERSION');
      return {
        entityId: entityId as string,
        before: toRecord(beforeRow as Record<string, unknown>),
        after: toRecord(afterRow as Record<string, unknown>),
        versionBefore: expectedVer as number,
        versionAfter: afterRow.version,
      };
    }

    case 'delete': {
      const [beforeRow] = await tx
        .select()
        .from(table)
        .where(eq(table.id, entityId))
        .limit(1);
      if (!beforeRow) throw new Error('NOT_FOUND');
      if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
      if (beforeRow.version !== expectedVer) throw new Error('CONFLICT_VERSION');
      const [afterRow] = await tx
        .update(table)
        .set({
          isDeleted: true,
          deletedAt: sql`now()`,
          deletedBy: ctx.actor.userId,
          updatedBy: ctx.actor.userId,
          version: sql`${table.version} + 1`,
        })
        .where(and(eq(table.id, entityId), eq(table.version, expectedVer)))
        .returning();
      if (!afterRow) throw new Error('CONFLICT_VERSION');
      return {
        entityId: entityId as string,
        before: toRecord(beforeRow as Record<string, unknown>),
        after: toRecord(afterRow as Record<string, unknown>),
        versionBefore: expectedVer as number,
        versionAfter: afterRow.version,
      };
    }

    case 'restore': {
      const [beforeRow] = await tx
        .select()
        .from(table)
        .where(eq(table.id, entityId))
        .limit(1);
      if (!beforeRow) throw new Error('NOT_FOUND');
      if (!beforeRow.isDeleted) throw new Error('NOT_FOUND');
      if (beforeRow.version !== expectedVer) throw new Error('CONFLICT_VERSION');
      const [afterRow] = await tx
        .update(table)
        .set({
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedBy: ctx.actor.userId,
          version: sql`${table.version} + 1`,
        })
        .where(and(eq(table.id, entityId), eq(table.version, expectedVer)))
        .returning();
      if (!afterRow) throw new Error('CONFLICT_VERSION');
      return {
        entityId: entityId as string,
        before: toRecord(beforeRow as Record<string, unknown>),
        after: toRecord(afterRow as Record<string, unknown>),
        versionBefore: expectedVer as number,
        versionAfter: afterRow.version,
      };
    }

    default:
      throw new Error(
        `applyEntity: verb '${verb}' is not a standard CRUD verb. ` +
        `Use a custom handler for workflow verbs (submit, approve, reject, …).`,
      );
  }
}
