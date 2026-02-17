/**
 * Communications
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const SupplierMessageSchema = z.object({
  messageId: z.string(),
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  sentAt: z.string(),
  read: z.boolean(),
  priority: z.enum(['low', 'normal', 'high']),
});

export type SupplierMessage = z.infer<typeof SupplierMessageSchema>;

export const SharedDocumentSchema = z.object({
  documentId: z.string(),
  name: z.string(),
  supplierId: z.string(),
  type: z.enum(['spec', 'drawing', 'coa', 'contract', 'other']),
  url: z.string(),
  sharedBy: z.string(),
  sharedAt: z.string(),
  expiresAt: z.string().optional(),
});

export type SharedDocument = z.infer<typeof SharedDocumentSchema>;

export async function sendMessage(
  db: Database,
  orgId: string,
  params: {
    messageId: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    priority?: 'low' | 'normal' | 'high';
  },
): Promise<Result<SupplierMessage>> {
  const validation = z.object({
    messageId: z.string().min(1),
    from: z.string().min(1),
    to: z.string().min(1),
    subject: z.string().min(1),
    body: z.string().min(1),
    priority: z.enum(['low', 'normal', 'high']).optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({
    ...params,
    priority: params.priority || 'normal',
    sentAt: new Date().toISOString(),
    read: false,
  });
}

export async function shareDocument(
  db: Database,
  orgId: string,
  params: {
    documentId: string;
    name: string;
    supplierId: string;
    type: 'spec' | 'drawing' | 'coa' | 'contract' | 'other';
    url: string;
    sharedBy: string;
    expiresAt?: string;
  },
): Promise<Result<SharedDocument>> {
  const validation = z.object({
    documentId: z.string().min(1),
    name: z.string().min(1),
    supplierId: z.string().min(1),
    type: z.enum(['spec', 'drawing', 'coa', 'contract', 'other']),
    url: z.string().url(),
    sharedBy: z.string().min(1),
    expiresAt: z.string().datetime().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({ ...params, sharedAt: new Date().toISOString() });
}
