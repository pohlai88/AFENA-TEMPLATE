"use client";

// Column definitions for Downtime Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DowntimeEntry } from "../types/downtime-entry.js";

export const downtimeEntryColumns: ColumnDef<DowntimeEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operator",
    header: "Operator",
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
];