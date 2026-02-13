"use client";

// Column definitions for Appointment Booking Slots
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AppointmentBookingSlots } from "../types/appointment-booking-slots.js";

export const appointmentBookingSlotsColumns: ColumnDef<AppointmentBookingSlots>[] = [
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
    header: "From Time ",
  },
  {
    accessorKey: "to_time",
    header: "To Time",
  },
];