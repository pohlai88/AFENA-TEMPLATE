"use client";

// Column definitions for Purchase Invoice Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseInvoiceItem } from "../types/purchase-invoice-item.js";

export const purchaseInvoiceItemColumns: ColumnDef<PurchaseInvoiceItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item",
  },
  {
    accessorKey: "qty",
    header: "Accepted Qty",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
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