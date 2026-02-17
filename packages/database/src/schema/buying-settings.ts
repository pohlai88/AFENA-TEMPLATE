import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Buying Settings — procurement module configuration.
 * Source: buying-settings.spec.json (adopted from ERPNext Buying Settings).
 * Singleton config entity for purchasing defaults and behavior.
 */
export const buyingSettings = pgTable(
  'buying_settings',
  {
    ...erpEntityColumns,
    supplierNamingBy: text('supplier_naming_by'),
    suppMasterName: text('supp_master_name'),
    buyingPriceList: text('buying_price_list'),
    poRequired: boolean('po_required').default(false),
    prRequired: boolean('pr_required').default(false),
    maintainSameRate: boolean('maintain_same_rate').default(false),
    allowMultipleSuppliersForSameItem: boolean('allow_multiple_suppliers_for_same_item').default(false),
    roleToOverridePriceListRateValidation: text('role_to_override_price_list_rate_validation'),
    blanketOrderAllowance: integer('blanket_order_allowance'),
    autoCreatePurchaseReceipt: boolean('auto_create_purchase_receipt').default(false),
    billForRejectedQuantityInPurchaseInvoice: boolean('bill_for_rejected_quantity_in_purchase_invoice').default(false),
    backflushRawMaterialsOfSubcontractBasedOn: text('backflush_raw_materials_of_subcontract_based_on'),
    overTransferAllowance: integer('over_transfer_allowance'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('buying_settings_org_singleton').on(table.orgId), // SINGLETON
    index('buying_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('buying_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type BuyingSettings = typeof buyingSettings.$inferSelect;
export type NewBuyingSettings = typeof buyingSettings.$inferInsert;
