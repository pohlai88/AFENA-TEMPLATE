"use client";

// Column definitions for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PromotionalSchemeProductDiscount } from "../types/promotional-scheme-product-discount.js";

export const promotionalSchemeProductDiscountColumns: ColumnDef<PromotionalSchemeProductDiscount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "min_qty",
    header: "Min Qty",
  },
  {
    accessorKey: "max_qty",
    header: "Max Qty",
  },
  {
    accessorKey: "min_amount",
    header: "Min Amount",
    cell: ({ row }) => {
      const val = row.getValue("min_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "max_amount",
    header: "Max Amount",
    cell: ({ row }) => {
      const val = row.getValue("max_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "free_item",
    header: "Item Code",
  },
  {
    accessorKey: "free_qty",
    header: "Qty",
  },
];