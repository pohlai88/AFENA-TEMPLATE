"use client";

// Column definitions for Stock Closing Balance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockClosingBalance } from "../types/stock-closing-balance.js";

export const stockClosingBalanceColumns: ColumnDef<StockClosingBalance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "posting_date",
    header: "Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "actual_qty",
    header: "Qty Change",
  },
];