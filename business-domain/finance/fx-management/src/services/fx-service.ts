import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { computeGainLoss, convertAmount } from '../calculators/fx-convert';
import { buildFxRevalueIntent } from '../commands/fx-revalue-intent';
import type { FxRateReadModel } from '../queries/fx-rate-query';
import { lookupFxRate } from '../queries/fx-rate-query';

import type { FxConversionResult } from '../calculators/fx-convert';

export type FxConvertDocResult = FxConversionResult & {
  rateDate: string;
  rateSource: string;
};

export async function convertDocumentAmount(
  db: DbSession,
  ctx: DomainContext,
  input: { amountMinor: number; fromCurrency: string; toCurrency: string; date: string },
): Promise<DomainResult<FxConvertDocResult>> {
  const rateModel = await lookupFxRate(db, ctx, {
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    date: input.date,
  });

  const conversion = convertAmount(
    input.amountMinor,
    rateModel.rate,
    input.fromCurrency,
    input.toCurrency,
  );

  return {
    kind: 'read',
    data: {
      ...conversion.result,
      rateDate: rateModel.effectiveDate,
      rateSource: rateModel.source,
    },
  };
}

export async function getFxRate(
  db: DbSession,
  ctx: DomainContext,
  input: { fromCurrency: string; toCurrency: string; date: string },
): Promise<DomainResult<FxRateReadModel>> {
  const model = await lookupFxRate(db, ctx, input);
  return { kind: 'read', data: model };
}

export async function revalueFxBalance(
  db: DbSession,
  ctx: DomainContext,
  input: {
    accountId: string;
    originalMinor: number;
    fromCurrency: string;
    toCurrency: string;
    revalDate: string;
    gainLossAccountId: string;
    journalId: string;
  },
): Promise<DomainResult<{ gainLossMinor: number; isGain: boolean }>> {
  const rateModel = await lookupFxRate(db, ctx, {
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    date: input.revalDate,
  });

  const conversion = convertAmount(
    input.originalMinor,
    rateModel.rate,
    input.fromCurrency,
    input.toCurrency,
  );

  const gl = computeGainLoss(input.originalMinor, conversion.result.toMinor);

  if (gl.result.gainLossMinor === 0) {
    return { kind: 'read', data: gl.result };
  }

  const intent = buildFxRevalueIntent(
    {
      accountId: input.accountId,
      originalMinor: input.originalMinor,
      revaluedMinor: conversion.result.toMinor,
      currency: input.toCurrency,
      gainLossAccountId: input.gainLossAccountId,
      journalId: input.journalId,
      effectiveAt: input.revalDate,
    },
    stableCanonicalJson({
      accountId: input.accountId,
      journalId: input.journalId,
      revalDate: input.revalDate,
    }),
  );

  return { kind: 'intent+read', data: gl.result, intents: [intent] };
}
