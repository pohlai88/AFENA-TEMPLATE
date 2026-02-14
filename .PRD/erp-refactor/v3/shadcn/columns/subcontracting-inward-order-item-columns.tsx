"use client";

// Column definitions for Subcontracting Inward Order Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingInwardOrderItem } from "../types/subcontracting-inward-order-item.js";

export const subcontractingInwardOrderItemColumns: ColumnDef<SubcontractingInwardOrderItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "bom",
    header: "BOM",
  },
  {
    accessorKey: "delivery_warehouse",
    header: "Delivery Warehouse",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "delivered_qty",
    header: "Delivered Qty",
  },
];