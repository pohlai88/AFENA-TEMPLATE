"use client";

// Column definitions for Asset Category Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetCategoryAccount } from "../types/asset-category-account.js";

export const assetCategoryAccountColumns: ColumnDef<AssetCategoryAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company_name",
    header: "Company",
  },
  {
    accessorKey: "fixed_asset_account",
    header: "Fixed Asset Account",
  },
  {
    accessorKey: "accumulated_depreciation_account",
    header: "Accumulated Depreciation Account",
  },
  {
    accessorKey: "depreciation_expense_account",
    header: "Depreciation Expense Account",
  },
  {
    accessorKey: "capital_work_in_progress_account",
    header: "Capital Work In Progress Account",
  },
];