"use client";

// Column definitions for POS Invoice Reference
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosInvoiceReference } from "../types/pos-invoice-reference.js";

export const posInvoiceReferenceColumns: ColumnDef<PosInvoiceReference>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "pos_invoice",
    header: "POS Invoice",
  },
  {
    accessorKey: "posting_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "grand_total",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];