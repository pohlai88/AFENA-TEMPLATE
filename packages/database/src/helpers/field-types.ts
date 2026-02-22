import { sql } from 'drizzle-orm';
import {
  bigint,
  jsonb,
  numeric,
  text,
  uuid
} from 'drizzle-orm/pg-core';

// ── Money ────────────────────────────────────────────────

/** 
 * Bigint minor units (cents/sen). Safe for high-value finance, no float rounding.
 * Uses bigint to prevent overflow on large transactions.
 * Mode 'number' for JS number type (safe up to Number.MAX_SAFE_INTEGER).
 * Use mode 'bigint' for true bigint JS type if handling very large values.
 */
export const moneyMinor = (name: string) =>
  bigint(name, { mode: 'number' }).notNull().default(0);

/** ISO 4217 currency code. */
export const currencyCode = (name: string) =>
  text(name).notNull().default('MYR');

/** ISO 4217 currency code — NO DEFAULT. Currency must be explicit at write time. */
export const currencyCodeStrict = (name: string) => text(name).notNull();

/** Exchange rate to base currency. */
export const fxRate = (name: string) =>
  numeric(name, { precision: 20, scale: 10 }).default('1');

/** Converted amount in base currency minor units. */
export const baseAmountMinor = (name: string) =>
  bigint(name, { mode: 'number' }).notNull().default(0);

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
