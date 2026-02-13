"use client";

// Column definitions for Asset Capitalization Service Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetCapitalizationServiceItem } from "../types/asset-capitalization-service-item.js";

export const assetCapitalizationServiceItemColumns: ColumnDef<AssetCapitalizationServiceItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "expense_account",
    header: "Expense Account",
  },
  {
    accessorKey: "qty",
    header: "Qty",
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
];