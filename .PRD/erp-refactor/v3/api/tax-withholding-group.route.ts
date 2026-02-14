// CRUD API handlers for Tax Withholding Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxWithholdingGroup } from '../db/schema.js';
import { TaxWithholdingGroupSchema, TaxWithholdingGroupInsertSchema } from '../types/tax-withholding-group.js';

export const ROUTE_PREFIX = '/tax-withholding-group';

/**
 * List Tax Withholding Group records.
 */
export async function listTaxWithholdingGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxWithholdingGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Withholding Group by ID.
 */
export async function getTaxWithholdingGroup(db: any, id: string) {
  const rows = await db.select().from(taxWithholdingGroup).where(eq(taxWithholdingGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Withholding Group.
 */
export async function createTaxWithholdingGroup(db: any, data: unknown) {
  const parsed = TaxWithholdingGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxWithholdingGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Withholding Group.
 */
export async function updateTaxWithholdingGroup(db: any, id: string, data: unknown) {
  const parsed = TaxWithholdingGroupInsertSchema.partial().parse(data);
  await db.update(taxWithholdingGroup).set({ ...parsed, modified: new Date() }).where(eq(taxWithholdingGroup.id, id));
  return getTaxWithholdingGroup(db, id);
}

/**
 * Delete a Tax Withholding Group by ID.
 */
export async function deleteTaxWithholdingGroup(db: any, id: string) {
  await db.delete(taxWithholdingGroup).where(eq(taxWithholdingGroup.id, id));
  return { deleted: true, id };
}
