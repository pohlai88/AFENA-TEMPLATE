"use client";

// Column definitions for Service Level Priority
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceLevelPriority } from "../types/service-level-priority.js";

export const serviceLevelPriorityColumns: ColumnDef<ServiceLevelPriority>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "default_priority",
    header: "Default Priority",
    cell: ({ row }) => row.getValue("default_priority") ? "Yes" : "No",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "response_time",
    header: "First Response Time",
  },
];