"use client";

// Column definitions for Purchase Receipt Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseReceiptItem } from "../types/purchase-receipt-item.js";

export const purchaseReceiptItemColumns: ColumnDef<PurchaseReceiptItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "qty",
    header: "Accepted Quantity",
  },
  {
    accessorKey: "rejected_qty",
    header: "Rejected Quantity",
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
  {
    accessorKey: "warehouse",
    header: "Accepted Warehouse",
  },
];