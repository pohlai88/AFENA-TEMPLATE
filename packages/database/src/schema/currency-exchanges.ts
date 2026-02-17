import { desc, sql } from 'drizzle-orm';
import { boolean, check, date, decimal, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Currency Exchanges — exchange rates per currency pair per date.
 * Source: currency-exchanges.spec.json (adopted from ERPNext Currency Exchange).
 *
 * FK Strategy: from_currency and to_currency reference currencies(id).
 * Deferred: NO .references() until currencies adopted; add FK in refinement migration.
 */
export const currencyExchanges = pgTable(
  'currency_exchanges',
  {
    ...erpEntityColumns,
    /** Date for which this rate applies */
    date: date('date').notNull(),
    /** From currency (FK deferred: currencies(id)) */
    fromCurrency: uuid('from_currency').notNull(),
    /** To currency (FK deferred: currencies(id)) */
    toCurrency: uuid('to_currency').notNull(),
    /** Exchange rate (from → to) */
    exchangeRate: decimal('exchange_rate', { precision: 18, scale: 6 }).notNull(),
    /** Rate applies to buying transactions */
    forBuying: boolean('for_buying').default(false),
    /** Rate applies to selling transactions */
    forSelling: boolean('for_selling').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('currency_exchanges_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id),
    ),
    index('currency_exchanges_org_date_idx').on(table.orgId, table.date),
    index('currency_exchanges_org_pair_idx').on(
      table.orgId,
      table.fromCurrency,
      table.toCurrency,
    ),
    check('currency_exchanges_org_not_empty', sql`org_id <> ''`),
    check('currency_exchanges_rate_positive', sql`exchange_rate > 0`),
    tenantPolicy(table),
  ],
);

export type CurrencyExchange = typeof currencyExchanges.$inferSelect;
export type NewCurrencyExchange = typeof currencyExchanges.$inferInsert;
