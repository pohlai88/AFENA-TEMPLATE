"use client";

// Column definitions for Stock Entry Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockEntryDetail } from "../types/stock-entry-detail.js";

export const stockEntryDetailColumns: ColumnDef<StockEntryDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "s_warehouse",
    header: "Source Warehouse",
  },
  {
    accessorKey: "t_warehouse",
    header: "Target Warehouse",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "basic_rate",
    header: "Basic Rate (as per Stock UOM)",
    cell: ({ row }) => {
      const val = row.getValue("basic_rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];