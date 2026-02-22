/**
 * Withholding Tax Service
 *
 * Orchestrates WHT operations:
 * - Computes WHT for a payment using rate lookup
 * - Issues WHT certificates
 * - Tracks certificate remittance to tax authorities
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { WhtRateConfig } from '../calculators/wht-engine';
import { computeWht, validateWhtAmounts } from '../calculators/wht-engine';
import { buildIssueCertificateIntent, buildRemitIntent } from '../commands/wht-intent';
import {
  getActiveWhtCodes,
  getCertificatesByPayee,
  getWhtCertificate,
  getWhtCode,
  getWhtRates,
} from '../queries/wht-query';

/* ---------- Read Operations ---------- */

export async function fetchWhtCodes(db: DbSession, ctx: DomainContext): Promise<DomainResult> {
  const codes = await getActiveWhtCodes(db, ctx);
  return { kind: 'read', data: { codes } };
}

export async function fetchWhtRates(
  db: DbSession,
  ctx: DomainContext,
  whtCodeId: string,
): Promise<DomainResult> {
  const code = await getWhtCode(db, ctx, whtCodeId);
  const rates = await getWhtRates(db, ctx, whtCodeId);
  return { kind: 'read', data: { code, rates } };
}

export async function fetchCertificate(
  db: DbSession,
  ctx: DomainContext,
  certificateId: string,
): Promise<DomainResult> {
  const cert = await getWhtCertificate(db, ctx, certificateId);
  return { kind: 'read', data: { certificate: cert } };
}

export async function fetchCertificatesByPayee(
  db: DbSession,
  ctx: DomainContext,
  payeeId: string,
): Promise<DomainResult> {
  const certs = await getCertificatesByPayee(db, ctx, payeeId);
  return { kind: 'read', data: { certificates: certs } };
}

/* ---------- Write Operations ---------- */

/**
 * Compute WHT and issue a certificate for a payment.
 */
export async function issueCertificate(
  db: DbSession,
  ctx: DomainContext,
  input: {
    whtCodeId: string;
    grossAmountMinor: number;
    currencyCode: string;
    paymentDate: string;
    payeeCountry?: string;
    supplierId: string;
    certificateNo: string;
    taxPeriod: string;
  },
): Promise<DomainResult> {
  // 1. Get WHT code and rates
  const code = await getWhtCode(db, ctx, input.whtCodeId);
  const rateRows = await getWhtRates(db, ctx, input.whtCodeId);

  // 2. Convert DB rate rows to computation input
  const rateConfigs: WhtRateConfig[] = rateRows.map((r) => ({
    rateType: r.rateType,
    treatyCountry: r.treatyCountry,
    rate: parseFloat(r.rate),
    effectiveFrom: r.effectiveFrom,
    effectiveTo: r.effectiveTo,
  }));

  // 3. Compute WHT
  const computation = computeWht({
    grossAmountMinor: input.grossAmountMinor,
    currencyCode: input.currencyCode,
    paymentDate: input.paymentDate,
    ...(input.payeeCountry != null ? { payeeCountry: input.payeeCountry } : {}),
    rates: rateConfigs,
  });

  // 4. Validate amounts
  const validation = validateWhtAmounts(
    computation.grossAmountMinor,
    computation.whtAmountMinor,
    computation.netAmountMinor,
  );
  if (!validation.valid) {
    throw new Error(`WHT validation failed: ${validation.message}`);
  }

  // 5. Build intent
  return {
    kind: 'intent+read',
    data: { computation },
    intents: [
      buildIssueCertificateIntent(
        {
          certificateNo: input.certificateNo,
          supplierId: input.supplierId,
          amountMinor: computation.whtAmountMinor,
          whtCode: code.whtCode,
          taxPeriod: input.taxPeriod,
        },
        stableCanonicalJson({
          certificateNo: input.certificateNo,
          whtCode: code.whtCode,
          taxPeriod: input.taxPeriod,
        }),
      ),
    ],
  };
}

/**
 * Remit accumulated WHT to tax authority.
 */
export async function remitToAuthority(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    remittanceId: string;
    taxAuthority: string;
    totalMinor: number;
    taxPeriod: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildRemitIntent({
        remittanceId: input.remittanceId,
        taxAuthority: input.taxAuthority,
        totalMinor: input.totalMinor,
        taxPeriod: input.taxPeriod,
      }),
    ],
  };
}
