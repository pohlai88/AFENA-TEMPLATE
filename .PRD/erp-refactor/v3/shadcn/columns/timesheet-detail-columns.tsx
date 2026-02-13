"use client";

// Column definitions for Timesheet Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TimesheetDetail } from "../types/timesheet-detail.js";

export const timesheetDetailColumns: ColumnDef<TimesheetDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
  {
    accessorKey: "from_time",
    header: "From Time",
    cell: ({ row }) => {
      const val = row.getValue("from_time") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "hours",
    header: "Hrs",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "is_billable",
    header: "Is Billable",
    cell: ({ row }) => row.getValue("is_billable") ? "Yes" : "No",
  },
];