import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const shipments = pgTable(
  'shipments',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    shipmentNumber: text('shipment_number'),
    carrier: text('carrier'),
    trackingNumber: text('tracking_number'),
    shipDate: date('ship_date'),
    expectedDeliveryDate: date('expected_delivery_date'),
    origin: text('origin'),
    destination: text('destination'),
    shipmentLines: jsonb('shipment_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('shipments_org_id_idx').on(table.orgId, table.id),
    index('shipments_org_created_idx').on(table.orgId, table.createdAt),
    check('shipments_org_not_empty', sql`org_id <> ''`),
    check('shipments_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
