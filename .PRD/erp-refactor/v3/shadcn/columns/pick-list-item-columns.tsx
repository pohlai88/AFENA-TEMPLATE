"use client";

// Column definitions for Pick List Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PickListItem } from "../types/pick-list-item.js";

export const pickListItemColumns: ColumnDef<PickListItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "stock_qty",
    header: "Qty (in Stock UOM)",
  },
  {
    accessorKey: "picked_qty",
    header: "Picked Qty (in Stock UOM)",
  },
];