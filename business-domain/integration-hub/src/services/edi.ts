import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const SendEDIDocumentParams = z.object({ partnerId: z.string(), documentType: z.string(), payload: z.any() });
export interface EDIDocument { transactionId: string; partnerId: string; documentType: string; sentAt: Date; status: 'sent' | 'acknowledged' }
export async function sendEDIDocument(db: DbInstance, orgId: string, params: z.infer<typeof SendEDIDocumentParams>): Promise<Result<EDIDocument>> {
  const validated = SendEDIDocumentParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ transactionId: 'edi-tx-1', partnerId: validated.data.partnerId, documentType: validated.data.documentType, sentAt: new Date(), status: 'sent' });
}

const ReceiveEDIDocumentParams = z.object({ payload: z.any() });
export interface EDIReceipt { receiptId: string; documentType: string; receivedAt: Date; validationStatus: 'valid' | 'invalid' }
export async function receiveEDIDocument(db: DbInstance, orgId: string, params: z.infer<typeof ReceiveEDIDocumentParams>): Promise<Result<EDIReceipt>> {
  const validated = ReceiveEDIDocumentParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ receiptId: 'rcpt-1', documentType: '850-PO', receivedAt: new Date(), validationStatus: 'valid' });
}
