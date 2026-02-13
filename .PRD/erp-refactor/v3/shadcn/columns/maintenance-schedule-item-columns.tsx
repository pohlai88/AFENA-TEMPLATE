"use client";

// Column definitions for Maintenance Schedule Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceScheduleItem } from "../types/maintenance-schedule-item.js";

export const maintenanceScheduleItemColumns: ColumnDef<MaintenanceScheduleItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const val = row.getValue("start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "periodicity",
    header: "Periodicity",
  },
  {
    accessorKey: "no_of_visits",
    header: "No of Visits",
  },
];