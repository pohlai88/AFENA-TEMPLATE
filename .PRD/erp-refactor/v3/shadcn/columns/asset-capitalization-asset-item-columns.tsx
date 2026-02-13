"use client";

// Column definitions for Asset Capitalization Asset Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetCapitalizationAssetItem } from "../types/asset-capitalization-asset-item.js";

export const assetCapitalizationAssetItemColumns: ColumnDef<AssetCapitalizationAssetItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "asset_name",
    header: "Asset Name",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "current_asset_value",
    header: "Current Asset Value",
    cell: ({ row }) => {
      const val = row.getValue("current_asset_value") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "asset_value",
    header: "Asset Value",
    cell: ({ row }) => {
      const val = row.getValue("asset_value") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];