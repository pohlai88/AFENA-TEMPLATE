/**
 * Financial Instrument Queries — Drizzle-based read operations
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { financialInstruments } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type FinancialInstrumentReadModel = {
  id: string;
  instrumentNo: string;
  name: string;
  instrumentType: string;
  classification: string;
  businessModel: string;
  faceValueMinor: number;
  carryingAmountMinor: number;
  fairValueMinor: number | null;
  currencyCode: string;
  effectiveInterestRate: string | null;
  statedRate: string | null;
  originationDate: string;
  maturityDate: string | null;
  eclStage: string;
  eclAmountMinor: number;
  fairValueLevel: string | null;
};

export async function getFinancialInstrument(
  db: DbSession,
  ctx: DomainContext,
  instrumentId: string,
): Promise<FinancialInstrumentReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(financialInstruments)
      .where(
        and(eq(financialInstruments.orgId, ctx.orgId), eq(financialInstruments.id, instrumentId), eq(financialInstruments.isDeleted, false)),
      )
      .limit(1),
  );

  const row = rows[0];
  if (!row) throw new Error(`Financial instrument ${instrumentId} not found`);

  return {
    id: row.id,
    instrumentNo: row.instrumentNo,
    name: row.name,
    instrumentType: row.instrumentType,
    classification: row.classification,
    businessModel: row.businessModel,
    faceValueMinor: Number(row.faceValueMinor),
    carryingAmountMinor: Number(row.carryingAmountMinor),
    fairValueMinor: row.fairValueMinor ? Number(row.fairValueMinor) : null,
    currencyCode: row.currencyCode,
    effectiveInterestRate: row.effectiveInterestRate,
    statedRate: row.statedRate,
    originationDate: String(row.originationDate),
    maturityDate: row.maturityDate ? String(row.maturityDate) : null,
    eclStage: row.eclStage ?? 'stage-1',
    eclAmountMinor: Number(row.eclAmountMinor),
    fairValueLevel: row.fairValueLevel,
  };
}
