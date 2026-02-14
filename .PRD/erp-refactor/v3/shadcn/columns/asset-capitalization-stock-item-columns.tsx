"use client";

// Column definitions for Asset Capitalization Stock Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetCapitalizationStockItem } from "../types/asset-capitalization-stock-item.js";

export const assetCapitalizationStockItemColumns: ColumnDef<AssetCapitalizationStockItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "stock_qty",
    header: "Quantity",
  },
  {
    accessorKey: "valuation_rate",
    header: "Valuation Rate",
    cell: ({ row }) => {
      const val = row.getValue("valuation_rate") as number;
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
    accessorKey: "stock_uom",
    header: "Stock UOM",
  },
];