"use client";

// Column definitions for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessPaymentReconciliationLogAllocations } from "../types/process-payment-reconciliation-log-allocations.js";

export const processPaymentReconciliationLogAllocationsColumns: ColumnDef<ProcessPaymentReconciliationLogAllocations>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Number",
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
    accessorKey: "difference_amount",
    header: "Difference Amount",
    cell: ({ row }) => {
      const val = row.getValue("difference_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "reconciled",
    header: "Reconciled",
    cell: ({ row }) => row.getValue("reconciled") ? "Yes" : "No",
  },
];