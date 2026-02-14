"use client";

// Column definitions for Payment Entry Reference
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentEntryReference } from "../types/payment-entry-reference.js";

export const paymentEntryReferenceColumns: ColumnDef<PaymentEntryReference>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_doctype",
    header: "Type",
  },
  {
    accessorKey: "reference_name",
    header: "Name",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const val = row.getValue("due_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "total_amount",
    header: "Grand Total",
    cell: ({ row }) => {
      const val = row.getValue("total_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "outstanding_amount",
    header: "Outstanding",
    cell: ({ row }) => {
      const val = row.getValue("outstanding_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "allocated_amount",
    header: "Allocated",
    cell: ({ row }) => {
      const val = row.getValue("allocated_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];