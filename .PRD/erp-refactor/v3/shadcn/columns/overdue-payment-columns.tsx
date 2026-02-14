"use client";

// Column definitions for Overdue Payment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OverduePayment } from "../types/overdue-payment.js";

export const overduePaymentColumns: ColumnDef<OverduePayment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_invoice",
    header: "Sales Invoice",
  },
  {
    accessorKey: "dunning_level",
    header: "Dunning Level",
  },
  {
    accessorKey: "overdue_days",
    header: "Overdue Days",
  },
  {
    accessorKey: "outstanding",
    header: "Outstanding",
    cell: ({ row }) => {
      const val = row.getValue("outstanding") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "interest",
    header: "Interest",
    cell: ({ row }) => {
      const val = row.getValue("interest") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];