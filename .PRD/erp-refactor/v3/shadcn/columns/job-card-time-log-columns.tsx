"use client";

// Column definitions for Job Card Time Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCardTimeLog } from "../types/job-card-time-log.js";

export const jobCardTimeLogColumns: ColumnDef<JobCardTimeLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "employee",
    header: "Employee",
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
    accessorKey: "to_time",
    header: "To Time",
    cell: ({ row }) => {
      const val = row.getValue("to_time") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "time_in_mins",
    header: "Time In Mins",
  },
  {
    accessorKey: "completed_qty",
    header: "Completed Qty",
  },
  {
    accessorKey: "operation",
    header: "Sub Operation",
  },
];