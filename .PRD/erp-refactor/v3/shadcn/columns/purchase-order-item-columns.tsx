"use client";

// Column definitions for Purchase Order Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseOrderItem } from "../types/purchase-order-item.js";

export const purchaseOrderItemColumns: ColumnDef<PurchaseOrderItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "schedule_date",
    header: "Required By",
    cell: ({ row }) => {
      const val = row.getValue("schedule_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "uom",
    header: "UOM",
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
    header: "Target Warehouse",
  },
];