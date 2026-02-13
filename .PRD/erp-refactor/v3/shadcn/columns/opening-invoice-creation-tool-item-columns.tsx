"use client";

// Column definitions for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OpeningInvoiceCreationToolItem } from "../types/opening-invoice-creation-tool-item.js";

export const openingInvoiceCreationToolItemColumns: ColumnDef<OpeningInvoiceCreationToolItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
  {
    accessorKey: "posting_date",
    header: "Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
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
    accessorKey: "item_name",
    header: "Item Name",
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