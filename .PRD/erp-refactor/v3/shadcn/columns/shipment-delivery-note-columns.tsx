"use client";

// Column definitions for Shipment Delivery Note
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShipmentDeliveryNote } from "../types/shipment-delivery-note.js";

export const shipmentDeliveryNoteColumns: ColumnDef<ShipmentDeliveryNote>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "delivery_note",
    header: "Delivery Note",
  },
  {
    accessorKey: "grand_total",
    header: "Value",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];