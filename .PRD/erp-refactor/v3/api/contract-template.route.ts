// CRUD API handlers for Contract Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { contractTemplate } from '../db/schema.js';
import { ContractTemplateSchema, ContractTemplateInsertSchema } from '../types/contract-template.js';

export const ROUTE_PREFIX = '/contract-template';

/**
 * List Contract Template records.
 */
export async function listContractTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(contractTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Contract Template by ID.
 */
export async function getContractTemplate(db: any, id: string) {
  const rows = await db.select().from(contractTemplate).where(eq(contractTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Contract Template.
 */
export async function createContractTemplate(db: any, data: unknown) {
  const parsed = ContractTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(contractTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Contract Template.
 */
export async function updateContractTemplate(db: any, id: string, data: unknown) {
  const parsed = ContractTemplateInsertSchema.partial().parse(data);
  await db.update(contractTemplate).set({ ...parsed, modified: new Date() }).where(eq(contractTemplate.id, id));
  return getContractTemplate(db, id);
}

/**
 * Delete a Contract Template by ID.
 */
export async function deleteContractTemplate(db: any, id: string) {
  await db.delete(contractTemplate).where(eq(contractTemplate.id, id));
  return { deleted: true, id };
}
