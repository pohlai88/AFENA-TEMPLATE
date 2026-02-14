"use client";

// Column definitions for Job Card Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JobCardOperation } from "../types/job-card-operation.js";

export const jobCardOperationColumns: ColumnDef<JobCardOperation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sub_operation",
    header: "Operation",
  },
  {
    accessorKey: "completed_qty",
    header: "Completed Qty",
  },
  {
    accessorKey: "completed_time",
    header: "Completed Time",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];