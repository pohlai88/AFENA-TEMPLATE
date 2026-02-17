import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const LinkToTransactionParams = z.object({
  documentId: z.string(),
  transactionType: z.enum([
    'invoice',
    'payment',
    'purchase_order',
    'sales_order',
    'journal_entry',
    'contract',
    'other',
  ]),
  transactionId: z.string(),
  linkType: z.enum(['supporting', 'primary', 'reference']),
});

export interface DocumentLink {
  linkId: string;
  documentId: string;
  transactionType: string;
  transactionId: string;
  linkType: string;
  createdBy: string;
  createdAt: Date;
}

export async function linkToTransaction(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof LinkToTransactionParams>,
): Promise<Result<DocumentLink>> {
  const validated = LinkToTransactionParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create document-transaction link
  return ok({
    linkId: `link-${Date.now()}`,
    documentId: validated.data.documentId,
    transactionType: validated.data.transactionType,
    transactionId: validated.data.transactionId,
    linkType: validated.data.linkType,
    createdBy: userId,
    createdAt: new Date(),
  });
}

const GetTransactionDocumentsParams = z.object({
  transactionType: z.enum([
    'invoice',
    'payment',
    'purchase_order',
    'sales_order',
    'journal_entry',
    'contract',
    'other',
  ]),
  transactionId: z.string(),
  linkType: z.enum(['supporting', 'primary', 'reference']).optional(),
});

export interface TransactionDocuments {
  transactionType: string;
  transactionId: string;
  documents: Array<{
    documentId: string;
    fileName: string;
    mimeType: string;
    linkType: string;
    linkedAt: Date;
  }>;
  totalCount: number;
}

export async function getTransactionDocuments(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetTransactionDocumentsParams>,
): Promise<Result<TransactionDocuments>> {
  const validated = GetTransactionDocumentsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Retrieve all documents linked to transaction
  return ok({
    transactionType: validated.data.transactionType,
    transactionId: validated.data.transactionId,
    documents: [
      {
        documentId: 'doc-001',
        fileName: 'invoice.pdf',
        mimeType: 'application/pdf',
        linkType: 'primary',
        linkedAt: new Date(),
      },
    ],
    totalCount: 1,
  });
}

const UnlinkFromTransactionParams = z.object({
  linkId: z.string(),
});

export interface UnlinkResult {
  linkId: string;
  unlinked: boolean;
}

export async function unlinkFromTransaction(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof UnlinkFromTransactionParams>,
): Promise<Result<UnlinkResult>> {
  const validated = UnlinkFromTransactionParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Remove document-transaction link
  return ok({
    linkId: validated.data.linkId,
    unlinked: true,
  });
}

const GetDocumentLinksParams = z.object({
  documentId: z.string(),
});

export interface DocumentLinks {
  documentId: string;
  links: Array<{
    linkId: string;
    transactionType: string;
    transactionId: string;
    linkType: string;
    createdAt: Date;
  }>;
  totalCount: number;
}

export async function getDocumentLinks(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetDocumentLinksParams>,
): Promise<Result<DocumentLinks>> {
  const validated = GetDocumentLinksParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get all transaction links for a document
  return ok({
    documentId: validated.data.documentId,
    links: [
      {
        linkId: 'link-001',
        transactionType: 'invoice',
        transactionId: 'inv-12345',
        linkType: 'primary',
        createdAt: new Date(),
      },
    ],
    totalCount: 1,
  });
}
