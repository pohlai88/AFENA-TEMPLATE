"use client";

// Column definitions for Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Item } from "../types/item.js";

export const itemColumns: ColumnDef<Item>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_group",
    header: "Item Group",
  },
  {
    accessorKey: "stock_uom",
    header: "Default Unit of Measure",
  },
  {
    accessorKey: "is_stock_item",
    header: "Maintain Stock",
    cell: ({ row }) => row.getValue("is_stock_item") ? "Yes" : "No",
  },
];