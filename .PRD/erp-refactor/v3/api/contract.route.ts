// CRUD API handlers for Contract
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { contract } from '../db/schema.js';
import { ContractSchema, ContractInsertSchema } from '../types/contract.js';

export const ROUTE_PREFIX = '/contract';

/**
 * List Contract records.
 */
export async function listContract(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(contract).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Contract by ID.
 */
export async function getContract(db: any, id: string) {
  const rows = await db.select().from(contract).where(eq(contract.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Contract.
 */
export async function createContract(db: any, data: unknown) {
  const parsed = ContractInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(contract).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Contract.
 */
export async function updateContract(db: any, id: string, data: unknown) {
  const parsed = ContractInsertSchema.partial().parse(data);
  await db.update(contract).set({ ...parsed, modified: new Date() }).where(eq(contract.id, id));
  return getContract(db, id);
}

/**
 * Delete a Contract by ID.
 */
export async function deleteContract(db: any, id: string) {
  await db.delete(contract).where(eq(contract.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Contract (set docstatus = 1).
 */
export async function submitContract(db: any, id: string) {
  await db.update(contract).set({ docstatus: 1, modified: new Date() }).where(eq(contract.id, id));
  return getContract(db, id);
}

/**
 * Cancel a Contract (set docstatus = 2).
 */
export async function cancelContract(db: any, id: string) {
  await db.update(contract).set({ docstatus: 2, modified: new Date() }).where(eq(contract.id, id));
  return getContract(db, id);
}
