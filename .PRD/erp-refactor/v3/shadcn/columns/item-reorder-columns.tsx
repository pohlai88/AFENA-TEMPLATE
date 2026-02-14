"use client";

// Column definitions for Item Reorder
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemReorder } from "../types/item-reorder.js";

export const itemReorderColumns: ColumnDef<ItemReorder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "warehouse",
    header: "Request for",
  },
  {
    accessorKey: "warehouse_group",
    header: "Check Availability in Warehouse",
  },
  {
    accessorKey: "warehouse_reorder_level",
    header: "Re-order Level",
  },
  {
    accessorKey: "warehouse_reorder_qty",
    header: "Re-order Qty",
  },
  {
    accessorKey: "material_request_type",
    header: "Material Request Type",
  },
];