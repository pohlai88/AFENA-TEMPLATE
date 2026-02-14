"use client";

// Column definitions for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemWiseTaxDetail } from "../types/item-wise-tax-detail.js";

export const itemWiseTaxDetailColumns: ColumnDef<ItemWiseTaxDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_row",
    header: "Item Row",
  },
  {
    accessorKey: "tax_row",
    header: "Tax Row",
  },
  {
    accessorKey: "rate",
    header: "Tax Rate",
  },
  {
    accessorKey: "amount",
    header: "Tax Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "taxable_amount",
    header: "Taxable Amount",
    cell: ({ row }) => {
      const val = row.getValue("taxable_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];