"use client";

// Column definitions for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessPaymentReconciliationLog } from "../types/process-payment-reconciliation-log.js";

export const processPaymentReconciliationLogColumns: ColumnDef<ProcessPaymentReconciliationLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "process_pr",
    header: "Parent Document",
  },
  {
    accessorKey: "total_allocations",
    header: "Total Allocations",
  },
  {
    accessorKey: "reconciled_entries",
    header: "Reconciled Entries",
  },
];