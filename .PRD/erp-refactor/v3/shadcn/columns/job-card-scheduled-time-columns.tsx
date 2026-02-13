"use client";

// Column definitions for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCardScheduledTime } from "../types/job-card-scheduled-time.js";

export const jobCardScheduledTimeColumns: ColumnDef<JobCardScheduledTime>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    header: "Time (In Mins)",
  },
];