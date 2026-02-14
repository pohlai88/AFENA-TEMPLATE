"use client";

// Column definitions for Holiday List
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { HolidayList } from "../types/holiday-list.js";

export const holidayListColumns: ColumnDef<HolidayList>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "total_holidays",
    header: "Total Holidays",
  },
];