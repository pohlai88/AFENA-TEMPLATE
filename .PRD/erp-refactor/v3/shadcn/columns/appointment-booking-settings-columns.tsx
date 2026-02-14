"use client";

// Column definitions for Appointment Booking Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AppointmentBookingSettings } from "../types/appointment-booking-settings.js";

export const appointmentBookingSettingsColumns: ColumnDef<AppointmentBookingSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "number_of_agents",
    header: "Number of Concurrent Appointments",
  },
  {
    accessorKey: "holiday_list",
    header: "Holiday List",
  },
];