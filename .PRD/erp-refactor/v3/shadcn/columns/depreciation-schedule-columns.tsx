"use client";

// Column definitions for Depreciation Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DepreciationSchedule } from "../types/depreciation-schedule.js";

export const depreciationScheduleColumns: ColumnDef<DepreciationSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "schedule_date",
    header: "Schedule Date",
    cell: ({ row }) => {
      const val = row.getValue("schedule_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "depreciation_amount",
    header: "Depreciation Amount",
    cell: ({ row }) => {
      const val = row.getValue("depreciation_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "accumulated_depreciation_amount",
    header: "Accumulated Depreciation Amount",
    cell: ({ row }) => {
      const val = row.getValue("accumulated_depreciation_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "journal_entry",
    header: "Journal Entry",
  },
];