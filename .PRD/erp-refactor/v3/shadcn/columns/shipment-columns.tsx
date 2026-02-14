"use client";

// Column definitions for Shipment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Shipment } from "../types/shipment.js";
import { Badge } from "@/components/ui/badge";

export const shipmentColumns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "pickup",
    header: "Pickup From",
  },
  {
    accessorKey: "delivery_to",
    header: "Delivery To",
  },
  {
    accessorKey: "pickup_date",
    header: "Pickup Date",
    cell: ({ row }) => {
      const val = row.getValue("pickup_date") as string;
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