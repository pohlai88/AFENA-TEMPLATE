import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Manufacturing Settings — production module configuration.
 * Source: manufacturing-settings.spec.json (adopted from ERPNext Manufacturing Settings).
 * Singleton config entity for manufacturing defaults and behavior.
 */
export const manufacturingSettings = pgTable(
  'manufacturing_settings',
  {
    ...erpEntityColumns,
    allowProductionOnHolidays: boolean('allow_production_on_holidays').default(false),
    allowOverlappingWorkOrders: boolean('allow_overlapping_work_orders').default(false),
    capacityPlanningForWorkOrder: boolean('capacity_planning_for_work_order').default(false),
    defaultWipWarehouse: text('default_wip_warehouse'),
    defaultFgWarehouse: text('default_fg_warehouse'),
    defaultScrapWarehouse: text('default_scrap_warehouse'),
    updateBomCostAutomatically: boolean('update_bom_cost_automatically').default(false),
    makeSerialNoAndBatchFromWorkOrder: boolean('make_serial_no_and_batch_from_work_order').default(false),
    materialConsumption: boolean('material_consumption').default(false),
    materialTransferForManufacture: text('material_transfer_for_manufacture'),
    backflushRawMaterialsBasedOn: text('backflush_raw_materials_based_on'),
    overProductionAllowancePercentage: integer('over_production_allowance_percentage'),
    disableCapacityPlanning: boolean('disable_capacity_planning').default(false),
    allowMultipleWorkOrders: boolean('allow_multiple_work_orders').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('manufacturing_settings_org_singleton').on(table.orgId), // SINGLETON
    index('manufacturing_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('manufacturing_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ManufacturingSettings = typeof manufacturingSettings.$inferSelect;
export type NewManufacturingSettings = typeof manufacturingSettings.$inferInsert;
