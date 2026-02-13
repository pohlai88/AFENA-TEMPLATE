"use client";

// Column definitions for Discounted Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DiscountedInvoice } from "../types/discounted-invoice.js";

export const discountedInvoiceColumns: ColumnDef<DiscountedInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_invoice",
    header: "Invoice",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "posting_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
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