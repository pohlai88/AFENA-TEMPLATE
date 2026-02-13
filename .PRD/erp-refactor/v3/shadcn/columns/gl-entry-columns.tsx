"use client";

// Column definitions for GL Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { GlEntry } from "../types/gl-entry.js";

export const glEntryColumns: ColumnDef<GlEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "transaction_date",
    header: "Transaction Date",
    cell: ({ row }) => {
      const val = row.getValue("transaction_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "cost_center",
    header: "Cost Center",
  },
];