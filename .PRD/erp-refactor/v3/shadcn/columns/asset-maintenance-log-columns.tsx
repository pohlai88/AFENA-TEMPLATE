"use client";

// Column definitions for Asset Maintenance Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMaintenanceLog } from "../types/asset-maintenance-log.js";
import { Badge } from "@/components/ui/badge";

export const assetMaintenanceLogColumns: ColumnDef<AssetMaintenanceLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const val = row.getValue("due_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "completion_date",
    header: "Completion Date",
    cell: ({ row }) => {
      const val = row.getValue("completion_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
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