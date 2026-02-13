"use client";

// Column definitions for Asset Value Adjustment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetValueAdjustment } from "../types/asset-value-adjustment.js";
import { Badge } from "@/components/ui/badge";

export const assetValueAdjustmentColumns: ColumnDef<AssetValueAdjustment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "finance_book",
    header: "Finance Book",
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
    accessorKey: "new_asset_value",
    header: "New Asset Value",
    cell: ({ row }) => {
      const val = row.getValue("new_asset_value") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];