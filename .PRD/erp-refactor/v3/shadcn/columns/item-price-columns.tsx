"use client";

// Column definitions for Item Price
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemPrice } from "../types/item-price.js";

export const itemPriceColumns: ColumnDef<ItemPrice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "price_list",
    header: "Price List",
  },
  {
    accessorKey: "price_list_rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("price_list_rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
];