"use client";

// Column definitions for Payment Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentSchedule } from "../types/payment-schedule.js";

export const paymentScheduleColumns: ColumnDef<PaymentSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "payment_term",
    header: "Payment Term",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const val = row.getValue("due_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "invoice_portion",
    header: "Invoice Portion",
  },
  {
    accessorKey: "payment_amount",
    header: "Payment Amount",
    cell: ({ row }) => {
      const val = row.getValue("payment_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];