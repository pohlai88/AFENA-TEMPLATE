"use client";

// Column definitions for Delivery Trip
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryTrip } from "../types/delivery-trip.js";
import { Badge } from "@/components/ui/badge";

export const deliveryTripColumns: ColumnDef<DeliveryTrip>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "driver_name",
    header: "Driver Name",
  },
  {
    accessorKey: "departure_time",
    header: "Departure Time",
    cell: ({ row }) => {
      const val = row.getValue("departure_time") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];