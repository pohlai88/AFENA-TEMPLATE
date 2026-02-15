import { contacts, pickWritable } from 'afena-database';
import { eq, and, sql } from 'drizzle-orm';

import type { MutationContext } from '../context';
import type { EntityHandler, HandlerResult } from './types';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export const CAPABILITIES = [
  'contacts.create',
  'contacts.update',
  'contacts.delete',
  'contacts.restore',
] as const;

/** GAP-DB-007 / SAN-01: Schema-derived allowlist. */
function pickAllowed(input: Record<string, unknown>): Record<string, unknown> {
  return pickWritable(contacts, input) as Record<string, unknown>;
}

/** Convert a Drizzle row to a plain record for snapshots. */
function toRecord(row: Record<string, unknown>): Record<string, unknown> {
  return { ...row };
}

export const contactsHandler: EntityHandler = {
  async create(
    tx: NeonHttpDatabase,
    input: Record<string, unknown>,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const allowed = pickAllowed(input);

    const [row] = await tx
      .insert(contacts)
      .values({
        ...(allowed as any),
        createdBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
      })
      .returning();

    if (!row) throw new Error('Insert returned no rows');

    return {
      entityId: row.id,
      before: null,
      after: toRecord(row as unknown as Record<string, unknown>),
      versionBefore: null,
      versionAfter: 1,
    };
  },

  async update(
    tx: NeonHttpDatabase,
    entityId: string,
    input: Record<string, unknown>,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    // Before-snapshot
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const allowed = pickAllowed(input);

    const [afterRow] = await tx
      .update(contacts)
      .set({
        ...(allowed as any),
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async delete(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    // Before-snapshot
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        isDeleted: true,
        deletedAt: sql`now()`,
        deletedBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async restore(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    // Before-snapshot — must be deleted
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (!beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async submit(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        docStatus: 'submitted',
        submittedAt: sql`now()`,
        submittedBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async cancel(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        docStatus: 'cancelled',
        cancelledAt: sql`now()`,
        cancelledBy: ctx.actor.userId,
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async approve(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        docStatus: 'active',
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },

  async reject(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult> {
    const [beforeRow] = await tx
      .select()
      .from(contacts)
      .where(eq(contacts.id, entityId))
      .limit(1);

    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');

    const [afterRow] = await tx
      .update(contacts)
      .set({
        docStatus: 'draft',
        submittedAt: null,
        submittedBy: null,
        updatedBy: ctx.actor.userId,
        version: sql`${contacts.version} + 1`,
      })
      .where(
        and(
          eq(contacts.id, entityId),
          eq(contacts.version, expectedVersion),
        ),
      )
      .returning();

    if (!afterRow) throw new Error('CONFLICT_VERSION');

    return {
      entityId,
      before: toRecord(beforeRow as unknown as Record<string, unknown>),
      after: toRecord(afterRow as unknown as Record<string, unknown>),
      versionBefore: expectedVersion,
      versionAfter: afterRow.version,
    };
  },
};
