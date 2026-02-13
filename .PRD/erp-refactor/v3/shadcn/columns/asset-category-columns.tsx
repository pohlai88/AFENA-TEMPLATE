"use client";

// Column definitions for Asset Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetCategory } from "../types/asset-category.js";

export const assetCategoryColumns: ColumnDef<AssetCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset_category_name",
    header: "Asset Category Name",
  },
];