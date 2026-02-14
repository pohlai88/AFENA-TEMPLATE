"use client";

// Column definitions for Sales Invoice Payment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesInvoicePayment } from "../types/sales-invoice-payment.js";

export const salesInvoicePaymentColumns: ColumnDef<SalesInvoicePayment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];