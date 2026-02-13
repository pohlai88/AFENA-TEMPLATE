"use client";

// Column definitions for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetDepreciationSchedule } from "../types/asset-depreciation-schedule.js";
import { Badge } from "@/components/ui/badge";

export const assetDepreciationScheduleColumns: ColumnDef<AssetDepreciationSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset",
    header: "Asset",
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