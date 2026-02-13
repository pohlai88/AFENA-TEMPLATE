import { companies } from 'afena-database';
import { eq, and, sql } from 'drizzle-orm';

import type { MutationContext } from '../context';
import type { EntityHandler, HandlerResult } from './types';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export const CAPABILITIES = [
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.restore',
] as const;

/**
 * K-11: Companies allowlist — only these fields are accepted from input.
 */
function pickAllowed(input: Record<string, unknown>): Record<string, unknown> {
  const ALLOWED = ['name', 'legalName', 'registrationNo', 'taxId', 'baseCurrency', 'fiscalYearStart', 'address'] as const;
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in input) result[key] = input[key];
  }
  return result;
}

function toRecord(row: Record<string, unknown>): Record<string, unknown> {
  return { ...row };
}

export const companiesHandler: EntityHandler = {
  async create(tx: NeonHttpDatabase, input: Record<string, unknown>, ctx: MutationContext): Promise<HandlerResult> {
    const allowed = pickAllowed(input);
    const [row] = await tx.insert(companies).values({
      ...(allowed as any),
      createdBy: ctx.actor.userId,
      updatedBy: ctx.actor.userId,
    }).returning();
    if (!row) throw new Error('Insert returned no rows');
    return { entityId: row.id, before: null, after: toRecord(row as unknown as Record<string, unknown>), versionBefore: null, versionAfter: 1 };
  },

  async update(tx: NeonHttpDatabase, entityId: string, input: Record<string, unknown>, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(companies).where(eq(companies.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const allowed = pickAllowed(input);
    const [afterRow] = await tx.update(companies).set({
      ...(allowed as any),
      updatedBy: ctx.actor.userId,
      version: sql`${companies.version} + 1`,
    }).where(and(eq(companies.id, entityId), eq(companies.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },

  async delete(tx: NeonHttpDatabase, entityId: string, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(companies).where(eq(companies.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const [afterRow] = await tx.update(companies).set({
      isDeleted: true, deletedAt: sql`now()`, deletedBy: ctx.actor.userId, updatedBy: ctx.actor.userId,
      version: sql`${companies.version} + 1`,
    }).where(and(eq(companies.id, entityId), eq(companies.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },

  async restore(tx: NeonHttpDatabase, entityId: string, expectedVersion: number, ctx: MutationContext): Promise<HandlerResult> {
    const [beforeRow] = await tx.select().from(companies).where(eq(companies.id, entityId)).limit(1);
    if (!beforeRow) throw new Error('NOT_FOUND');
    if (!beforeRow.isDeleted) throw new Error('NOT_FOUND');
    if (beforeRow.version !== expectedVersion) throw new Error('CONFLICT_VERSION');
    const [afterRow] = await tx.update(companies).set({
      isDeleted: false, deletedAt: null, deletedBy: null, updatedBy: ctx.actor.userId,
      version: sql`${companies.version} + 1`,
    }).where(and(eq(companies.id, entityId), eq(companies.version, expectedVersion))).returning();
    if (!afterRow) throw new Error('CONFLICT_VERSION');
    return { entityId, before: toRecord(beforeRow as unknown as Record<string, unknown>), after: toRecord(afterRow as unknown as Record<string, unknown>), versionBefore: expectedVersion, versionAfter: afterRow.version };
  },
};
