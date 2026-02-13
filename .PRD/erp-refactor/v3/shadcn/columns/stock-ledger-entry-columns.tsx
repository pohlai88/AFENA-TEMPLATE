"use client";

// Column definitions for Stock Ledger Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockLedgerEntry } from "../types/stock-ledger-entry.js";

export const stockLedgerEntryColumns: ColumnDef<StockLedgerEntry>[] = [
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
    accessorKey: "voucher_no",
    header: "Voucher No",
  },
  {
    accessorKey: "actual_qty",
    header: "Qty Change",
  },
  {
    accessorKey: "incoming_rate",
    header: "Incoming Rate",
    cell: ({ row }) => {
      const val = row.getValue("incoming_rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];