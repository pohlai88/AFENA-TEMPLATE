"use client";

// Column definitions for Asset
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Asset } from "../types/asset.js";
import { Badge } from "@/components/ui/badge";

export const assetColumns: ColumnDef<Asset>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset_name",
    header: "Asset Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "asset_category",
    header: "Asset Category",
  },
  {
    accessorKey: "status",
    header: "Status",
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