"use client";

// Column definitions for Bank Transaction Payments
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransactionPayments } from "../types/bank-transaction-payments.js";

export const bankTransactionPaymentsColumns: ColumnDef<BankTransactionPayments>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_document",
    header: "Payment Document",
  },
  {
    accessorKey: "payment_entry",
    header: "Payment Entry",
  },
  {
    accessorKey: "allocated_amount",
    header: "Allocated Amount",
    cell: ({ row }) => {
      const val = row.getValue("allocated_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];