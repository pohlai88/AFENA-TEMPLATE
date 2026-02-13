"use client";

// Column definitions for Sales Invoice Advance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesInvoiceAdvance } from "../types/sales-invoice-advance.js";

export const salesInvoiceAdvanceColumns: ColumnDef<SalesInvoiceAdvance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "advance_amount",
    header: "Advance amount",
    cell: ({ row }) => {
      const val = row.getValue("advance_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "allocated_amount",
    header: "Allocated amount",
    cell: ({ row }) => {
      const val = row.getValue("allocated_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "difference_posting_date",
    header: "Difference Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("difference_posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];