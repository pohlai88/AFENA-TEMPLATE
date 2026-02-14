// CRUD API handlers for Email Digest Recipient
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { emailDigestRecipient } from '../db/schema.js';
import { EmailDigestRecipientSchema, EmailDigestRecipientInsertSchema } from '../types/email-digest-recipient.js';

export const ROUTE_PREFIX = '/email-digest-recipient';

/**
 * List Email Digest Recipient records.
 */
export async function listEmailDigestRecipient(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(emailDigestRecipient).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Email Digest Recipient by ID.
 */
export async function getEmailDigestRecipient(db: any, id: string) {
  const rows = await db.select().from(emailDigestRecipient).where(eq(emailDigestRecipient.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Email Digest Recipient.
 */
export async function createEmailDigestRecipient(db: any, data: unknown) {
  const parsed = EmailDigestRecipientInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(emailDigestRecipient).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Email Digest Recipient.
 */
export async function updateEmailDigestRecipient(db: any, id: string, data: unknown) {
  const parsed = EmailDigestRecipientInsertSchema.partial().parse(data);
  await db.update(emailDigestRecipient).set({ ...parsed, modified: new Date() }).where(eq(emailDigestRecipient.id, id));
  return getEmailDigestRecipient(db, id);
}

/**
 * Delete a Email Digest Recipient by ID.
 */
export async function deleteEmailDigestRecipient(db: any, id: string) {
  await db.delete(emailDigestRecipient).where(eq(emailDigestRecipient.id, id));
  return { deleted: true, id };
}
