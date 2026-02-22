/**
 * E-Invoice Queries — Drizzle-based read operations
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { eInvoiceSubmissions, eInvoices } from 'afenda-database';
import { and, eq, gte, lte } from 'drizzle-orm';

export type EInvoiceReadModel = {
  id: string;
  invoiceNo: string;
  format: string;
  recipientId: string;
  totalMinor: number;
  currency: string;
  issueDate: string;
  status: 'draft' | 'issued' | 'submitted' | 'cleared' | 'rejected';
  submissionId: string | null;
  clearedAt: string | null;
};

export type EInvoiceSubmissionReadModel = {
  id: string;
  invoiceId: string;
  accessPoint: string;
  submittedAt: string;
  clearanceStatus: string;
  validationErrors: string[] | null;
};

export async function getEInvoice(
  db: DbSession,
  ctx: DomainContext,
  invoiceId: string,
): Promise<EInvoiceReadModel | null> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(eInvoices)
      .where(
        and(
          eq(eInvoices.orgId, ctx.orgId),
          eq(eInvoices.id, invoiceId),
          eq(eInvoices.isDeleted, false),
        ),
      )
      .limit(1),
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    invoiceNo: row.invoiceNo,
    format: row.format,
    recipientId: row.recipientId,
    totalMinor: Number(row.totalMinor),
    currency: row.currencyCode,
    issueDate: row.issueDate,
    status: row.status as EInvoiceReadModel['status'],
    submissionId: null,
    clearedAt: null,
  };
}

export async function listEInvoices(
  db: DbSession,
  ctx: DomainContext,
  filters?: { status?: string; fromDate?: string; toDate?: string },
): Promise<EInvoiceReadModel[]> {
  const conditions = [
    eq(eInvoices.orgId, ctx.orgId),
    eq(eInvoices.isDeleted, false),
  ];

  if (filters?.status) {
    conditions.push(eq(eInvoices.status, filters.status));
  }
  if (filters?.fromDate) {
    conditions.push(gte(eInvoices.issueDate, filters.fromDate));
  }
  if (filters?.toDate) {
    conditions.push(lte(eInvoices.issueDate, filters.toDate));
  }

  const rows = await db.read((tx) =>
    tx
      .select()
      .from(eInvoices)
      .where(and(...conditions)),
  );

  return rows.map((row) => ({
    id: row.id,
    invoiceNo: row.invoiceNo,
    format: row.format,
    recipientId: row.recipientId,
    totalMinor: Number(row.totalMinor),
    currency: row.currencyCode,
    issueDate: row.issueDate,
    status: row.status as EInvoiceReadModel['status'],
    submissionId: null,
    clearedAt: null,
  }));
}

export async function getSubmission(
  db: DbSession,
  ctx: DomainContext,
  submissionId: string,
): Promise<EInvoiceSubmissionReadModel | null> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(eInvoiceSubmissions)
      .where(
        and(
          eq(eInvoiceSubmissions.orgId, ctx.orgId),
          eq(eInvoiceSubmissions.submissionId, submissionId),
        ),
      )
      .limit(1),
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    invoiceId: row.eInvoiceId,
    accessPoint: row.accessPoint,
    submittedAt: row.submittedAt.toISOString(),
    clearanceStatus: row.clearanceStatus,
    validationErrors: row.validationErrors as string[] | null,
  };
}
