"use client";

// Column definitions for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PromotionalSchemePriceDiscount } from "../types/promotional-scheme-price-discount.js";

export const promotionalSchemePriceDiscountColumns: ColumnDef<PromotionalSchemePriceDiscount>[] = [
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
    accessorKey: "rate_or_discount",
    header: "Discount Type",
  },
];