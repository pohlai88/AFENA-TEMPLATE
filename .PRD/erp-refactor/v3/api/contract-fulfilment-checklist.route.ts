// CRUD API handlers for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { contractFulfilmentChecklist } from '../db/schema.js';
import { ContractFulfilmentChecklistSchema, ContractFulfilmentChecklistInsertSchema } from '../types/contract-fulfilment-checklist.js';

export const ROUTE_PREFIX = '/contract-fulfilment-checklist';

/**
 * List Contract Fulfilment Checklist records.
 */
export async function listContractFulfilmentChecklist(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(contractFulfilmentChecklist).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Contract Fulfilment Checklist by ID.
 */
export async function getContractFulfilmentChecklist(db: any, id: string) {
  const rows = await db.select().from(contractFulfilmentChecklist).where(eq(contractFulfilmentChecklist.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Contract Fulfilment Checklist.
 */
export async function createContractFulfilmentChecklist(db: any, data: unknown) {
  const parsed = ContractFulfilmentChecklistInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(contractFulfilmentChecklist).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Contract Fulfilment Checklist.
 */
export async function updateContractFulfilmentChecklist(db: any, id: string, data: unknown) {
  const parsed = ContractFulfilmentChecklistInsertSchema.partial().parse(data);
  await db.update(contractFulfilmentChecklist).set({ ...parsed, modified: new Date() }).where(eq(contractFulfilmentChecklist.id, id));
  return getContractFulfilmentChecklist(db, id);
}

/**
 * Delete a Contract Fulfilment Checklist by ID.
 */
export async function deleteContractFulfilmentChecklist(db: any, id: string) {
  await db.delete(contractFulfilmentChecklist).where(eq(contractFulfilmentChecklist.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Contract Fulfilment Checklist (set docstatus = 1).
 */
export async function submitContractFulfilmentChecklist(db: any, id: string) {
  await db.update(contractFulfilmentChecklist).set({ docstatus: 1, modified: new Date() }).where(eq(contractFulfilmentChecklist.id, id));
  return getContractFulfilmentChecklist(db, id);
}

/**
 * Cancel a Contract Fulfilment Checklist (set docstatus = 2).
 */
export async function cancelContractFulfilmentChecklist(db: any, id: string) {
  await db.update(contractFulfilmentChecklist).set({ docstatus: 2, modified: new Date() }).where(eq(contractFulfilmentChecklist.id, id));
  return getContractFulfilmentChecklist(db, id);
}
