"use client";

// Column definitions for Quick Stock Balance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QuickStockBalance } from "../types/quick-stock-balance.js";

export const quickStockBalanceColumns: ColumnDef<QuickStockBalance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "item",
    header: "Item Code",
  },
];