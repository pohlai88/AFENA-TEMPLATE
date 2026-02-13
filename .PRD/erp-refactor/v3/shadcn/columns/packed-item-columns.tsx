"use client";

// Column definitions for Packed Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PackedItem } from "../types/packed-item.js";

export const packedItemColumns: ColumnDef<PackedItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parent_item",
    header: "Parent Item",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];