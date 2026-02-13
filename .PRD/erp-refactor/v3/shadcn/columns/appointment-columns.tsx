"use client";

// Column definitions for Appointment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment } from "../types/appointment.js";

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "scheduled_time",
    header: "Scheduled Time",
    cell: ({ row }) => {
      const val = row.getValue("scheduled_time") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "customer_name",
    header: "Name",
  },
];