"use client";

// Column definitions for Subcontracting Order Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingOrderItem } from "../types/subcontracting-order-item.js";

export const subcontractingOrderItemColumns: ColumnDef<SubcontractingOrderItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "bom",
    header: "BOM",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
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