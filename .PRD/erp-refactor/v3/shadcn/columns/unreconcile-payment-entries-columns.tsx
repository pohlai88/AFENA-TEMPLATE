"use client";

// Column definitions for Unreconcile Payment Entries
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UnreconcilePaymentEntries } from "../types/unreconcile-payment-entries.js";

export const unreconcilePaymentEntriesColumns: ColumnDef<UnreconcilePaymentEntries>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_doctype",
    header: "Reference Type",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
  {
    accessorKey: "allocated_amount",
    header: "Allocated Amount",
    cell: ({ row }) => {
      const val = row.getValue("allocated_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "unlinked",
    header: "Unlinked",
    cell: ({ row }) => row.getValue("unlinked") ? "Yes" : "No",
  },
];