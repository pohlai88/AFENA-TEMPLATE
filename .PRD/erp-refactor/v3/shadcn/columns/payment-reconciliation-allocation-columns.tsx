"use client";

// Column definitions for Payment Reconciliation Allocation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentReconciliationAllocation } from "../types/payment-reconciliation-allocation.js";

export const paymentReconciliationAllocationColumns: ColumnDef<PaymentReconciliationAllocation>[] = [
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
];