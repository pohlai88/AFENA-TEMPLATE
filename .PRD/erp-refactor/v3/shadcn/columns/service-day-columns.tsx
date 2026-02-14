"use client";

// Column definitions for Service Day
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ServiceDay } from "../types/service-day.js";

export const serviceDayColumns: ColumnDef<ServiceDay>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "workday",
    header: "Workday",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },
];