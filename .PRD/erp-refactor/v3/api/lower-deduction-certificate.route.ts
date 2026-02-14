// CRUD API handlers for Lower Deduction Certificate
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { lowerDeductionCertificate } from '../db/schema.js';
import { LowerDeductionCertificateSchema, LowerDeductionCertificateInsertSchema } from '../types/lower-deduction-certificate.js';

export const ROUTE_PREFIX = '/lower-deduction-certificate';

/**
 * List Lower Deduction Certificate records.
 */
export async function listLowerDeductionCertificate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(lowerDeductionCertificate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Lower Deduction Certificate by ID.
 */
export async function getLowerDeductionCertificate(db: any, id: string) {
  const rows = await db.select().from(lowerDeductionCertificate).where(eq(lowerDeductionCertificate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Lower Deduction Certificate.
 */
export async function createLowerDeductionCertificate(db: any, data: unknown) {
  const parsed = LowerDeductionCertificateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(lowerDeductionCertificate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Lower Deduction Certificate.
 */
export async function updateLowerDeductionCertificate(db: any, id: string, data: unknown) {
  const parsed = LowerDeductionCertificateInsertSchema.partial().parse(data);
  await db.update(lowerDeductionCertificate).set({ ...parsed, modified: new Date() }).where(eq(lowerDeductionCertificate.id, id));
  return getLowerDeductionCertificate(db, id);
}

/**
 * Delete a Lower Deduction Certificate by ID.
 */
export async function deleteLowerDeductionCertificate(db: any, id: string) {
  await db.delete(lowerDeductionCertificate).where(eq(lowerDeductionCertificate.id, id));
  return { deleted: true, id };
}
