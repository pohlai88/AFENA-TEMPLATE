// CRUD API handlers for Email Digest
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { emailDigest } from '../db/schema.js';
import { EmailDigestSchema, EmailDigestInsertSchema } from '../types/email-digest.js';

export const ROUTE_PREFIX = '/email-digest';

/**
 * List Email Digest records.
 */
export async function listEmailDigest(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(emailDigest).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Email Digest by ID.
 */
export async function getEmailDigest(db: any, id: string) {
  const rows = await db.select().from(emailDigest).where(eq(emailDigest.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Email Digest.
 */
export async function createEmailDigest(db: any, data: unknown) {
  const parsed = EmailDigestInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(emailDigest).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Email Digest.
 */
export async function updateEmailDigest(db: any, id: string, data: unknown) {
  const parsed = EmailDigestInsertSchema.partial().parse(data);
  await db.update(emailDigest).set({ ...parsed, modified: new Date() }).where(eq(emailDigest.id, id));
  return getEmailDigest(db, id);
}

/**
 * Delete a Email Digest by ID.
 */
export async function deleteEmailDigest(db: any, id: string) {
  await db.delete(emailDigest).where(eq(emailDigest.id, id));
  return { deleted: true, id };
}
