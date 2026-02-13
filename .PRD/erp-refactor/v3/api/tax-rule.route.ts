// CRUD API handlers for Tax Rule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxRule } from '../db/schema.js';
import { TaxRuleSchema, TaxRuleInsertSchema } from '../types/tax-rule.js';

export const ROUTE_PREFIX = '/tax-rule';

/**
 * List Tax Rule records.
 */
export async function listTaxRule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxRule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Rule by ID.
 */
export async function getTaxRule(db: any, id: string) {
  const rows = await db.select().from(taxRule).where(eq(taxRule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Rule.
 */
export async function createTaxRule(db: any, data: unknown) {
  const parsed = TaxRuleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxRule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Rule.
 */
export async function updateTaxRule(db: any, id: string, data: unknown) {
  const parsed = TaxRuleInsertSchema.partial().parse(data);
  await db.update(taxRule).set({ ...parsed, modified: new Date() }).where(eq(taxRule.id, id));
  return getTaxRule(db, id);
}

/**
 * Delete a Tax Rule by ID.
 */
export async function deleteTaxRule(db: any, id: string) {
  await db.delete(taxRule).where(eq(taxRule.id, id));
  return { deleted: true, id };
}
