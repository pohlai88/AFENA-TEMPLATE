"use client";

// Column definitions for Holiday
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Holiday } from "../types/holiday.js";

export const holidayColumns: ColumnDef<Holiday>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "holiday_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("holiday_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "is_half_day",
    header: "Is Half Day",
    cell: ({ row }) => row.getValue("is_half_day") ? "Yes" : "No",
  },
];