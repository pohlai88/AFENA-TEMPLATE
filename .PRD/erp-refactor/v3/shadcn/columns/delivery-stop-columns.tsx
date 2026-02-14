"use client";

// Column definitions for Delivery Stop
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryStop } from "../types/delivery-stop.js";

export const deliveryStopColumns: ColumnDef<DeliveryStop>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "address",
    header: "Address Name",
  },
  {
    accessorKey: "locked",
    header: "Locked",
    cell: ({ row }) => row.getValue("locked") ? "Yes" : "No",
  },
  {
    accessorKey: "delivery_note",
    header: "Delivery Note",
  },
  {
    accessorKey: "estimated_arrival",
    header: "Estimated Arrival",
    cell: ({ row }) => {
      const val = row.getValue("estimated_arrival") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];