"use client";

// Column definitions for Asset Repair
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetRepair } from "../types/asset-repair.js";
import { Badge } from "@/components/ui/badge";

export const assetRepairColumns: ColumnDef<AssetRepair>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "downtime",
    header: "Downtime",
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