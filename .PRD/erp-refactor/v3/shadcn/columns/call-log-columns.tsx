"use client";

// Column definitions for Call Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CallLog } from "../types/call-log.js";

export const callLogColumns: ColumnDef<CallLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from",
    header: "From",
  },
  {
    accessorKey: "to",
    header: "To",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
];