import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Selling Settings — sales module configuration.
 * Source: selling-settings.spec.json (adopted from ERPNext Selling Settings).
 * Singleton config entity for sales defaults and behavior.
 */
export const sellingSettings = pgTable(
  'selling_settings',
  {
    ...erpEntityColumns,
    customerNamingBy: text('customer_naming_by'),
    campaignNamingBy: text('campaign_naming_by'),
    custMasterName: text('cust_master_name'),
    quotationValidityDays: integer('quotation_validity_days'),
    soRequired: boolean('so_required').default(false),
    dnRequired: boolean('dn_required').default(false),
    salesUpdateFrequency: text('sales_update_frequency'),
    sellingPriceList: text('selling_price_list'),
    hideCustomerGroup: boolean('hide_customer_group').default(false),
    closeSalesOrderOnDeliveryNote: boolean('close_sales_order_on_delivery_note').default(false),
    allowMultipleSalesOrdersAgainstCustomersPo: boolean('allow_multiple_sales_orders_against_customers_po').default(false),
    validateSellingPrice: boolean('validate_selling_price').default(false),
    maintainSameRate: boolean('maintain_same_rate').default(false),
    maintainSameRateThroughoutSalesOrder: boolean('maintain_same_rate_throughout_sales_order').default(false),
    editable: boolean('editable').default(false),
    allowUserToEditRateInTransactions: boolean('allow_user_to_edit_rate_in_transactions').default(false),
    allowItemToBeAddedMultipleTimes: boolean('allow_item_to_be_added_multiple_times').default(false),
    allowAgainstMultiplePurchaseOrders: boolean('allow_against_multiple_purchase_orders').default(false),
    roleToOverridePriceListRateValidation: text('role_to_override_price_list_rate_validation'),
    autoFillCustomerDetails: boolean('auto_fill_customer_details').default(false),
    enableDiscountAccounting: boolean('enable_discount_accounting').default(false),
    bookDeferredEntriesViaJournalEntry: boolean('book_deferred_entries_via_journal_entry').default(false),
    bookDeferredEntriesBasedOn: text('book_deferred_entries_based_on'),
    addDeliveredQtyInSalesOrder: boolean('add_delivered_qty_in_sales_order').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('selling_settings_org_singleton').on(table.orgId), // SINGLETON
    index('selling_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('selling_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type SellingSettings = typeof sellingSettings.$inferSelect;
export type NewSellingSettings = typeof sellingSettings.$inferInsert;
