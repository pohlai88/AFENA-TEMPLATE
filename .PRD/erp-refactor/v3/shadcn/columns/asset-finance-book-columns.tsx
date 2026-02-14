"use client";

// Column definitions for Asset Finance Book
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetFinanceBook } from "../types/asset-finance-book.js";

export const assetFinanceBookColumns: ColumnDef<AssetFinanceBook>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "finance_book",
    header: "Finance Book",
  },
  {
    accessorKey: "depreciation_method",
    header: "Depreciation Method",
  },
  {
    accessorKey: "frequency_of_depreciation",
    header: "Frequency of Depreciation (Months)",
  },
  {
    accessorKey: "total_number_of_depreciations",
    header: "Total Number of Depreciations",
  },
  {
    accessorKey: "depreciation_start_date",
    header: "Depreciation Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("depreciation_start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];