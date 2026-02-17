import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Currency Exchange Settings — exchange rate provider config.
 * Source: currency-exchange-settings.spec.json (adopted from ERPNext Currency Exchange Settings).
 * Singleton config entity for API settings for auto-fetch exchange rates.
 */
export const currencyExchangeSettings = pgTable(
  'currency_exchange_settings',
  {
    ...erpEntityColumns,
    disabled: boolean('disabled').default(false),
    serviceProvider: text('service_provider').notNull(),
    apiEndpoint: text('api_endpoint').notNull(),
    useHttp: boolean('use_http').default(false),
    accessKey: text('access_key'),
    url: text('url'),
    help: text('help'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('currency_exchange_settings_org_singleton').on(table.orgId),
    index('currency_exchange_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('currency_exchange_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type CurrencyExchangeSettings = typeof currencyExchangeSettings.$inferSelect;
export type NewCurrencyExchangeSettings = typeof currencyExchangeSettings.$inferInsert;
