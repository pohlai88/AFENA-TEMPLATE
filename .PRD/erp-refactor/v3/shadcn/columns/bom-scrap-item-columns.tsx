"use client";

// Column definitions for BOM Scrap Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomScrapItem } from "../types/bom-scrap-item.js";

export const bomScrapItemColumns: ColumnDef<BomScrapItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "stock_qty",
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