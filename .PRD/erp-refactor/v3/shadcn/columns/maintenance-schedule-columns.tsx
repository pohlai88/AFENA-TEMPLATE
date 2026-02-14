"use client";

// Column definitions for Maintenance Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceSchedule } from "../types/maintenance-schedule.js";
import { Badge } from "@/components/ui/badge";

export const maintenanceScheduleColumns: ColumnDef<MaintenanceSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
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