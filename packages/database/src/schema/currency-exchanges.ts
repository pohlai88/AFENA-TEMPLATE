import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    boolean,
    check,
    index,
    pgTable,
    text,
    timestamp
} from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk } from '../helpers/base-entity';

/**
 * Currency Exchange Rates — tenant-maintained FX rate table.
 *
 * Each row is a point-in-time rate for a currency pair.
 * Historical rates are preserved (no soft-delete; append-only by convention).
 */
export const currencyExchanges = pgTable(
  'currency_exchanges',
  {
    ...baseEntityColumns,
    fromCurrency: text('from_currency').notNull(),
    toCurrency: text('to_currency').notNull(),
    /** Rate stored as text to avoid floating-point precision loss */
    rate: text('rate').notNull(),
    rateDate: timestamp('rate_date', { withTimezone: true }).notNull(),
    source: text('source').notNull().default('manual'), // 'manual' | 'provider'
    isLatest: boolean('is_latest').notNull().default(false),
  },
  (table) => [
    tenantPk(table),
    index('currency_exchanges_pair_date_idx').on(
      table.orgId,
      table.fromCurrency,
      table.toCurrency,
      table.rateDate,
    ),
    index('currency_exchanges_latest_idx')
      .on(table.orgId, table.fromCurrency, table.toCurrency)
      .where(sql`is_latest = true`),
    check('currency_exchanges_org_not_empty', sql`org_id <> ''`),
    check('currency_exchanges_rate_positive', sql`rate::numeric > 0`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ],
);

export type CurrencyExchange = typeof currencyExchanges.$inferSelect;
export type NewCurrencyExchange = typeof currencyExchanges.$inferInsert;
