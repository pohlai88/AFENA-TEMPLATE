"use client";

// Column definitions for Asset Maintenance Task
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMaintenanceTask } from "../types/asset-maintenance-task.js";

export const assetMaintenanceTaskColumns: ColumnDef<AssetMaintenanceTask>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "maintenance_task",
    header: "Maintenance Task",
  },
  {
    accessorKey: "maintenance_status",
    header: "Maintenance Status",
  },
  {
    accessorKey: "periodicity",
    header: "Periodicity",
  },
  {
    accessorKey: "assign_to",
    header: "Assign To",
  },
  {
    accessorKey: "next_due_date",
    header: "Next Due Date",
    cell: ({ row }) => {
      const val = row.getValue("next_due_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "last_completion_date",
    header: "Last Completion Date",
    cell: ({ row }) => {
      const val = row.getValue("last_completion_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];