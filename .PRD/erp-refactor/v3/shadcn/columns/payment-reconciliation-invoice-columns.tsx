"use client";

// Column definitions for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentReconciliationInvoice } from "../types/payment-reconciliation-invoice.js";

export const paymentReconciliationInvoiceColumns: ColumnDef<PaymentReconciliationInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "invoice_type",
    header: "Invoice Type",
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Number",
  },
  {
    accessorKey: "invoice_date",
    header: "Invoice Date",
    cell: ({ row }) => {
      const val = row.getValue("invoice_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "outstanding_amount",
    header: "Outstanding Amount",
    cell: ({ row }) => {
      const val = row.getValue("outstanding_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];