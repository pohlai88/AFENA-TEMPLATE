"use client";

// Column definitions for Master Production Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MasterProductionSchedule } from "../types/master-production-schedule.js";

export const masterProductionScheduleColumns: ColumnDef<MasterProductionSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];