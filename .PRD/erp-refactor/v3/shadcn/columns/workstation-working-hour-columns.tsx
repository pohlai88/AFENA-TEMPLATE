"use client";

// Column definitions for Workstation Working Hour
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkstationWorkingHour } from "../types/workstation-working-hour.js";

export const workstationWorkingHourColumns: ColumnDef<WorkstationWorkingHour>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => row.getValue("enabled") ? "Yes" : "No",
  },
];