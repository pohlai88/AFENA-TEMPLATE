import { z } from 'zod';

import { CanonValidationError } from './errors';

export type Brand<T, B extends string> = T & { readonly __brand: B };

export const CompanyIdSchema = z.string().min(1).brand<'CompanyId'>();
export type CompanyId = z.infer<typeof CompanyIdSchema>;

export const CurrencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, 'CurrencyCode must be ISO 4217 (e.g. MYR, USD)')
  .brand<'CurrencyCode'>();
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export const IsoDateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .brand<'IsoDateTime'>();
export type IsoDateTime = z.infer<typeof IsoDateTimeSchema>;

export const RoleKeySchema = z.string().min(1).brand<'RoleKey'>();
export type RoleKey = z.infer<typeof RoleKeySchema>;

export const IndustryOverlayKeySchema = z.string().min(1).brand<'IndustryOverlayKey'>();
export type IndustryOverlayKey = z.infer<typeof IndustryOverlayKeySchema>;

export const LedgerIdSchema = z.string().min(1).brand<'LedgerId'>();
export type LedgerId = z.infer<typeof LedgerIdSchema>;

export const FiscalPeriodKeySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2]|P\d{2})$/, 'FiscalPeriodKey must be YYYY-MM or YYYY-P## (e.g. 2025-03 or 2025-P03)')
  .brand<'FiscalPeriodKey'>();
export type FiscalPeriodKey = z.infer<typeof FiscalPeriodKeySchema>;

export const SiteIdSchema = z.string().min(1).brand<'SiteId'>();
export type SiteId = z.infer<typeof SiteIdSchema>;

// ── Fiscal period regex (extracted for reuse in is/as helpers) ──────
const FISCAL_PERIOD_KEY_RE = /^\d{4}-(0[1-9]|1[0-2]|P\d{2})$/;

// ── Type guards (zero-cost, enables safe branching) ─────────────────

/**
 * Type guard for CompanyId.
 * @see isOrgId in ids.ts for the UUID-branded equivalent.
 */
export function isCompanyId(value: unknown): value is CompanyId {
  return typeof value === 'string' && value.length > 0;
}

export function isLedgerId(value: unknown): value is LedgerId {
  return typeof value === 'string' && value.length > 0;
}

export function isSiteId(value: unknown): value is SiteId {
  return typeof value === 'string' && value.length > 0;
}

export function isFiscalPeriodKey(value: unknown): value is FiscalPeriodKey {
  return typeof value === 'string' && FISCAL_PERIOD_KEY_RE.test(value);
}

// ── Fast coercion (DB adapters only — cheap check, no Zod) ─────────
// Use as*() at adapter boundaries where values come from trusted DB rows.
// Never use as*() in API routes — use parse*() instead.

/**
 * Brand a string as CompanyId with minimal validation.
 * @throws CanonValidationError if value is empty
 */
export function asCompanyId(value: string): CompanyId {
  if (!isCompanyId(value)) {
    throw new CanonValidationError(
      `Invalid CompanyId: ${value}`,
      'INVALID_BRANDED',
      'CompanyId',
    );
  }
  return value as CompanyId;
}

export function asLedgerId(value: string): LedgerId {
  if (!isLedgerId(value)) {
    throw new CanonValidationError(
      `Invalid LedgerId: ${value}`,
      'INVALID_BRANDED',
      'LedgerId',
    );
  }
  return value as LedgerId;
}

export function asSiteId(value: string): SiteId {
  if (!isSiteId(value)) {
    throw new CanonValidationError(
      `Invalid SiteId: ${value}`,
      'INVALID_BRANDED',
      'SiteId',
    );
  }
  return value as SiteId;
}

export function asFiscalPeriodKey(value: string): FiscalPeriodKey {
  if (!isFiscalPeriodKey(value)) {
    throw new CanonValidationError(
      `Invalid FiscalPeriodKey: ${value}`,
      'INVALID_BRANDED',
      'FiscalPeriodKey',
    );
  }
  return value as FiscalPeriodKey;
}

// ── Full parse (API ingress, unsafe boundaries — Zod validation) ────
// Use parse*() when receiving values from external sources (forms, APIs).

export function parseCompanyId(value: unknown): CompanyId {
  return CompanyIdSchema.parse(value);
}

export function parseLedgerId(value: unknown): LedgerId {
  return LedgerIdSchema.parse(value);
}

export function parseSiteId(value: unknown): SiteId {
  return SiteIdSchema.parse(value);
}

export function parseFiscalPeriodKey(value: unknown): FiscalPeriodKey {
  return FiscalPeriodKeySchema.parse(value);
}
