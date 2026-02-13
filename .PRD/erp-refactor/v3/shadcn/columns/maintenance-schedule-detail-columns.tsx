"use client";

// Column definitions for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceScheduleDetail } from "../types/maintenance-schedule-detail.js";

export const maintenanceScheduleDetailColumns: ColumnDef<MaintenanceScheduleDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "scheduled_date",
    header: "Scheduled Date",
    cell: ({ row }) => {
      const val = row.getValue("scheduled_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "actual_date",
    header: "Actual Date",
    cell: ({ row }) => {
      const val = row.getValue("actual_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "sales_person",
    header: "Sales Person",
  },
  {
    accessorKey: "completion_status",
    header: "Completion Status",
  },
  {
    accessorKey: "serial_no",
    header: "Serial No",
  },
];