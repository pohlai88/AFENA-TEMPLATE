import { desc, sql } from 'drizzle-orm';
import { boolean, check, decimal, index, integer, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Stock Settings — inventory/stock module configuration.
 * Source: stock-settings.spec.json (adopted from ERPNext Stock Settings).
 * Singleton config entity for stock management defaults and behavior.
 */
export const stockSettings = pgTable(
  'stock_settings',
  {
    ...erpEntityColumns,
    itemNamingBy: text('item_naming_by'),
    itemGroup: text('item_group'),
    stockUom: text('stock_uom'),
    allowNegativeStock: boolean('allow_negative_stock').default(false),
    defaultWarehouse: text('default_warehouse'),
    setQtyInTransactionsBasedOnSerialNoBatchNo: boolean('set_qty_in_transactions_based_on_serial_no_batch_no').default(false),
    automaticallySetSerialNosBasedOnFifo: boolean('automatically_set_serial_nos_based_on_fifo').default(false),
    validateStockOnSave: boolean('validate_stock_on_save').default(false),
    autoInsertPriceListRateIfMissing: boolean('auto_insert_price_list_rate_if_missing').default(false),
    allowItemsNotInBom: boolean('allow_items_not_in_bom').default(false),
    showBarcodeField: boolean('show_barcode_field').default(false),
    convertItemDescToCleanHtml: boolean('convert_item_desc_to_clean_html').default(false),
    autoIndent: boolean('auto_indent').default(false),
    raiseStockRequestWhenStockReachesReorderLevel: boolean('raise_stock_request_when_stock_reaches_reorder_level').default(false),
    notifyByEmailOnCreationOfAutomaticMaterialRequest: boolean('notify_by_email_on_creation_of_automatic_material_request').default(false),
    raisePoRequestWhenStockReachesReorderLevel: boolean('raise_po_request_when_stock_reaches_reorder_level').default(false),
    freezeStocksOlderThan: integer('freeze_stocks_older_than'),
    roleAllowedToCreateEditFrozenStock: text('role_allowed_to_create_edit_frozen_stock'),
    actionIfQtyAfterTransactionIsZero: text('action_if_qty_after_transaction_is_zero'),
    actionIfAccumulatedQtyIsZero: text('action_if_accumulated_qty_is_zero'),
    sampleRetentionWarehouse: text('sample_retention_warehouse'),
    defaultValidDays: integer('default_valid_days'),
    cleanupEmailNotificationsSentDaysAgo: integer('cleanup_email_notifications_sent_days_ago'),
    enableStockEntryBatchAutoCreation: boolean('enable_stock_entry_batch_auto_creation').default(false),
    disableSerialNoBatchSelector: boolean('disable_serial_no_batch_selector').default(false),
    doNotUpdateSerialBatchOnCreationOfAutoBundle: boolean('do_not_update_serial_batch_on_creation_of_auto_bundle').default(false),
    valuation: text('valuation'),
    rmCostAsPerBom: boolean('rm_cost_as_per_bom').default(false),
    exactCostRevaluationBasedOnVouchers: boolean('exact_cost_revaluation_based_on_vouchers').default(false),
    allowToEditRateInStockEntry: boolean('allow_to_edit_rate_in_stock_entry').default(false),
    allowOverDeliveryBilling: boolean('allow_over_delivery_billing').default(false),
    overDeliveryReceiptAllowance: decimal('over_delivery_receipt_allowance', { precision: 18, scale: 2 }),
    roleAllowedToOverDeliverReceive: text('role_allowed_to_over_deliver_receive'),
    enableBatchWiseStockBalances: boolean('enable_batch_wise_stock_balances').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('stock_settings_org_singleton').on(table.orgId), // SINGLETON
    index('stock_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('stock_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type StockSettings = typeof stockSettings.$inferSelect;
export type NewStockSettings = typeof stockSettings.$inferInsert;
