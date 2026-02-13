// CRUD API handlers for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { contractTemplateFulfilmentTerms } from '../db/schema.js';
import { ContractTemplateFulfilmentTermsSchema, ContractTemplateFulfilmentTermsInsertSchema } from '../types/contract-template-fulfilment-terms.js';

export const ROUTE_PREFIX = '/contract-template-fulfilment-terms';

/**
 * List Contract Template Fulfilment Terms records.
 */
export async function listContractTemplateFulfilmentTerms(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(contractTemplateFulfilmentTerms).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Contract Template Fulfilment Terms by ID.
 */
export async function getContractTemplateFulfilmentTerms(db: any, id: string) {
  const rows = await db.select().from(contractTemplateFulfilmentTerms).where(eq(contractTemplateFulfilmentTerms.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Contract Template Fulfilment Terms.
 */
export async function createContractTemplateFulfilmentTerms(db: any, data: unknown) {
  const parsed = ContractTemplateFulfilmentTermsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(contractTemplateFulfilmentTerms).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Contract Template Fulfilment Terms.
 */
export async function updateContractTemplateFulfilmentTerms(db: any, id: string, data: unknown) {
  const parsed = ContractTemplateFulfilmentTermsInsertSchema.partial().parse(data);
  await db.update(contractTemplateFulfilmentTerms).set({ ...parsed, modified: new Date() }).where(eq(contractTemplateFulfilmentTerms.id, id));
  return getContractTemplateFulfilmentTerms(db, id);
}

/**
 * Delete a Contract Template Fulfilment Terms by ID.
 */
export async function deleteContractTemplateFulfilmentTerms(db: any, id: string) {
  await db.delete(contractTemplateFulfilmentTerms).where(eq(contractTemplateFulfilmentTerms.id, id));
  return { deleted: true, id };
}
