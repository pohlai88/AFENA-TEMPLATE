"use client";

// Column definitions for Communication Medium Timeslot
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CommunicationMediumTimeslot } from "../types/communication-medium-timeslot.js";

export const communicationMediumTimeslotColumns: ColumnDef<CommunicationMediumTimeslot>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "day_of_week",
    header: "Day of Week",
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
    accessorKey: "employee_group",
    header: "Employee Group",
  },
];