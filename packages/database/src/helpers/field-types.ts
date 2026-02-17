import { sql } from 'drizzle-orm';
import {
  date,
  integer,
  jsonb,
  numeric,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

// ── Money ────────────────────────────────────────────────

/** Integer minor units (cents/sen). Safe, fast, no float rounding. */
export const moneyMinor = (name: string) =>
  integer(name).notNull().default(0);

/** ISO 4217 currency code. */
export const currencyCode = (name: string) =>
  text(name).notNull().default('MYR');

/** Exchange rate to base currency. */
export const fxRate = (name: string) =>
  numeric(name, { precision: 20, scale: 10 }).default('1');

/** Converted amount in base currency minor units. */
export const baseAmountMinor = (name: string) =>
  integer(name).notNull().default(0);

/**
 * Full money document columns for financial entities.
 * Expands to: {prefix}_minor, currency_code, fx_rate, fx_source, fx_as_of, base_{prefix}_minor
 */
export function moneyDocumentColumns(prefix: string) {
  return {
    [`${prefix}Minor`]: moneyMinor(`${prefix}_minor`),
    currencyCode: currencyCode('currency_code'),
    fxRate: fxRate('fx_rate'),
    fxSource: text('fx_source').notNull().default('manual'),
    fxAsOf: date('fx_as_of'),
    [`base${prefix.charAt(0).toUpperCase()}${prefix.slice(1)}Minor`]: baseAmountMinor(
      `base_${prefix}_minor`,
    ),
  } as const;
}

// ── Quantity ──────────────────────────────────────────────

/** Manufacturing/chemical precision quantity. */
export const qty = (name: string) =>
  numeric(name, { precision: 18, scale: 6 }).notNull().default('0');

/** FK to uom table. */
export const uomRef = (name: string) => uuid(name);

// ── Status / Enum ────────────────────────────────────────

/** Text column with CHECK constraint values generated from canon enum. */
export const statusColumn = (name: string) =>
  text(name).notNull();

// ── Contact / Entity References ──────────────────────────

/** Email with basic format (CHECK added at table level). */
export const emailColumn = (name: string) => text(name);

/** Phone (no CHECK — international formats vary). */
export const phoneColumn = (name: string) => text(name);

/** Structured address. */
export const addressJsonb = (name: string) => jsonb(name);

/** Tag arrays. */
export const tagsArray = (name: string) =>
  text(name)
    .array()
    .notNull()
    .default(sql`'{}'::text[]`);

/** Document number (INV-00001). */
export const docNumber = (name: string) => text(name).notNull();

/** FK to companies table. */
export const companyRef = () => uuid('company_id');

/** FK to sites table. */
export const siteRef = () => uuid('site_id');

/** FK to contacts table. */
export const contactRef = (name: string) => uuid(name);
