"use client";

// Column definitions for Bank Clearance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankClearance } from "../types/bank-clearance.js";

export const bankClearanceColumns: ColumnDef<BankClearance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "include_reconciled_entries",
    header: "Include Reconciled Entries",
    cell: ({ row }) => row.getValue("include_reconciled_entries") ? "Yes" : "No",
  },
];