"use client";

// Column definitions for Payment Entry Deduction
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentEntryDeduction } from "../types/payment-entry-deduction.js";

export const paymentEntryDeductionColumns: ColumnDef<PaymentEntryDeduction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "cost_center",
    header: "Cost Center",
  },
  {
    accessorKey: "amount",
    header: "Amount (Company Currency)",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];