"use client";

// Column definitions for Payment Reconciliation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentReconciliation } from "../types/payment-reconciliation.js";

export const paymentReconciliationColumns: ColumnDef<PaymentReconciliation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from_invoice_date",
    header: "From Invoice Date",
    cell: ({ row }) => {
      const val = row.getValue("from_invoice_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_invoice_date",
    header: "To Invoice Date",
    cell: ({ row }) => {
      const val = row.getValue("to_invoice_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "bank_cash_account",
    header: "Bank / Cash Account",
  },
];