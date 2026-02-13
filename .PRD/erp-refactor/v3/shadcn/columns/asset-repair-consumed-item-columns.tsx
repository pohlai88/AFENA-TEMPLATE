"use client";

// Column definitions for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetRepairConsumedItem } from "../types/asset-repair-consumed-item.js";

export const assetRepairConsumedItemColumns: ColumnDef<AssetRepairConsumedItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
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
    accessorKey: "consumed_quantity",
    header: "Consumed Quantity",
  },
  {
    accessorKey: "total_value",
    header: "Total Value",
    cell: ({ row }) => {
      const val = row.getValue("total_value") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];