"use client";

// Column definitions for Item Tax
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemTax } from "../types/item-tax.js";

export const itemTaxColumns: ColumnDef<ItemTax>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_tax_template",
    header: "Item Tax Template",
  },
  {
    accessorKey: "tax_category",
    header: "Tax Category",
  },
  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      const val = row.getValue("valid_from") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "minimum_net_rate",
    header: "Minimum Net Rate",
  },
  {
    accessorKey: "maximum_net_rate",
    header: "Maximum Net Rate",
  },
];