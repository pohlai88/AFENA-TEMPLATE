"use client";

// Column definitions for Availability Of Slots
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AvailabilityOfSlots } from "../types/availability-of-slots.js";

export const availabilityOfSlotsColumns: ColumnDef<AvailabilityOfSlots>[] = [
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
];