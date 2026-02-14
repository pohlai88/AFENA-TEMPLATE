"use client";

// Column definitions for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { IncomingCallHandlingSchedule } from "../types/incoming-call-handling-schedule.js";

export const incomingCallHandlingScheduleColumns: ColumnDef<IncomingCallHandlingSchedule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "day_of_week",
    header: "Day Of Week",
  },
  {
    accessorKey: "from_time",
    header: "From Time",
  },
  {
    accessorKey: "to_time",
    header: "To Time",
  },
  {
    accessorKey: "agent_group",
    header: "Agent Group",
  },
];