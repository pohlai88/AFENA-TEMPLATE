// CRUD API handlers for Closed Document
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { closedDocument } from '../db/schema.js';
import { ClosedDocumentSchema, ClosedDocumentInsertSchema } from '../types/closed-document.js';

export const ROUTE_PREFIX = '/closed-document';

/**
 * List Closed Document records.
 */
export async function listClosedDocument(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(closedDocument).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Closed Document by ID.
 */
export async function getClosedDocument(db: any, id: string) {
  const rows = await db.select().from(closedDocument).where(eq(closedDocument.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Closed Document.
 */
export async function createClosedDocument(db: any, data: unknown) {
  const parsed = ClosedDocumentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(closedDocument).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Closed Document.
 */
export async function updateClosedDocument(db: any, id: string, data: unknown) {
  const parsed = ClosedDocumentInsertSchema.partial().parse(data);
  await db.update(closedDocument).set({ ...parsed, modified: new Date() }).where(eq(closedDocument.id, id));
  return getClosedDocument(db, id);
}

/**
 * Delete a Closed Document by ID.
 */
export async function deleteClosedDocument(db: any, id: string) {
  await db.delete(closedDocument).where(eq(closedDocument.id, id));
  return { deleted: true, id };
}
