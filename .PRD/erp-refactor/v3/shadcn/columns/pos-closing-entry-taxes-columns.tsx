"use client";

// Column definitions for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosClosingEntryTaxes } from "../types/pos-closing-entry-taxes.js";

export const posClosingEntryTaxesColumns: ColumnDef<PosClosingEntryTaxes>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_head",
    header: "Account Head",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];