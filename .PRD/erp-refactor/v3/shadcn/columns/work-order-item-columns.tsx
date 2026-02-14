"use client";

// Column definitions for Work Order Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkOrderItem } from "../types/work-order-item.js";

export const workOrderItemColumns: ColumnDef<WorkOrderItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "source_warehouse",
    header: "Source Warehouse",
  },
  {
    accessorKey: "required_qty",
    header: "Required Qty",
  },
  {
    accessorKey: "transferred_qty",
    header: "Transferred Qty",
  },
  {
    accessorKey: "consumed_qty",
    header: "Consumed Qty",
  },
  {
    accessorKey: "returned_qty",
    header: "Returned Qty ",
  },
];