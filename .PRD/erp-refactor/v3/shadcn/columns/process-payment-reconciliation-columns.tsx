"use client";

// Column definitions for Process Payment Reconciliation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessPaymentReconciliation } from "../types/process-payment-reconciliation.js";
import { Badge } from "@/components/ui/badge";

export const processPaymentReconciliationColumns: ColumnDef<ProcessPaymentReconciliation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "party_type",
    header: "Party Type",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
  {
    accessorKey: "receivable_payable_account",
    header: "Receivable/Payable Account",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];