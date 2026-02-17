import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { currencyExchangeSettings } from './currency-exchange-settings';

/**
 * Currency Exchange Settings Details — provider-specific settings.
 * Source: currency-exchange-settings-details.spec.json (adopted from ERPNext Currency Exchange Settings Details).
 * Line entity for key-value configuration details.
 */
export const currencyExchangeSettingsDetails = pgTable(
  'currency_exchange_settings_details',
  {
    ...erpEntityColumns,
    parent: uuid('parent').notNull().references(() => currencyExchangeSettings.id),
    key: text('key').notNull(),
    value: text('value').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('currency_exchange_settings_details_org_parent_idx').on(table.orgId, table.parent),
    index('currency_exchange_settings_details_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('currency_exchange_settings_details_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type CurrencyExchangeSettingsDetail = typeof currencyExchangeSettingsDetails.$inferSelect;
export type NewCurrencyExchangeSettingsDetail = typeof currencyExchangeSettingsDetails.$inferInsert;
