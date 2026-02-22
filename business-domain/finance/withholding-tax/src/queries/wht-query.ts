/**
 * Withholding Tax Queries
 *
 * Read operations against wht_codes, wht_rates, and wht_certificates tables.
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { whtCertificates, whtCodes, whtRates } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

/* ---------- Read Models ---------- */

export interface WhtCodeReadModel {
  id: string;
  orgId: string;
  whtCode: string;
  name: string;
  jurisdiction: string;
  incomeType: string;
  whtPayableAccountId: string;
  whtExpenseAccountId: string;
  isActive: boolean;
}

export interface WhtRateReadModel {
  id: string;
  orgId: string;
  whtCodeId: string;
  rateType: 'domestic' | 'treaty' | 'exempt';
  treatyCountry: string | null;
  rate: string; // numeric from DB as string
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface WhtCertificateReadModel {
  id: string;
  orgId: string;
  certificateNo: string;
  whtCodeId: string;
  paymentId: string;
  payeeId: string;
  grossAmountMinor: number;
  whtAmountMinor: number;
  netAmountMinor: number;
  currencyCode: string;
  appliedRate: string;
  incomeType: string;
  paymentDate: string;
  issuedDate: string;
  remittanceStatus: 'pending' | 'remitted' | 'overdue';
  remittedDate: string | null;
}

/* ---------- Queries ---------- */

export async function getWhtCode(
  db: DbSession,
  ctx: DomainContext,
  codeId: string,
): Promise<WhtCodeReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(whtCodes)
      .where(and(eq(whtCodes.orgId, ctx.orgId), eq(whtCodes.id, codeId), eq(whtCodes.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`WHT code ${codeId} not found`);
  return rows[0] as WhtCodeReadModel;
}

export async function getActiveWhtCodes(
  db: DbSession,
  ctx: DomainContext,
): Promise<WhtCodeReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(whtCodes)
      .where(and(eq(whtCodes.orgId, ctx.orgId), eq(whtCodes.isActive, true), eq(whtCodes.isDeleted, false))),
  );
  return rows as WhtCodeReadModel[];
}

export async function getWhtRates(
  db: DbSession,
  ctx: DomainContext,
  whtCodeId: string,
): Promise<WhtRateReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(whtRates)
      .where(and(eq(whtRates.orgId, ctx.orgId), eq(whtRates.whtCodeId, whtCodeId), eq(whtRates.isDeleted, false))),
  );
  return rows as WhtRateReadModel[];
}

export async function getWhtCertificate(
  db: DbSession,
  ctx: DomainContext,
  certificateId: string,
): Promise<WhtCertificateReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(whtCertificates)
      .where(and(eq(whtCertificates.orgId, ctx.orgId), eq(whtCertificates.id, certificateId), eq(whtCertificates.isDeleted, false))),
  );
  if (rows.length === 0) throw new Error(`WHT certificate ${certificateId} not found`);
  return rows[0] as WhtCertificateReadModel;
}

export async function getCertificatesByPayee(
  db: DbSession,
  ctx: DomainContext,
  payeeId: string,
): Promise<WhtCertificateReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(whtCertificates)
      .where(and(eq(whtCertificates.orgId, ctx.orgId), eq(whtCertificates.payeeId, payeeId), eq(whtCertificates.isDeleted, false))),
  );
  return rows as WhtCertificateReadModel[];
}
