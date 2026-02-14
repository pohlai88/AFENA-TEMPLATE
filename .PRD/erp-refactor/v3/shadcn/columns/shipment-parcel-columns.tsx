"use client";

// Column definitions for Shipment Parcel
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ShipmentParcel } from "../types/shipment-parcel.js";

export const shipmentParcelColumns: ColumnDef<ShipmentParcel>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "length",
    header: "Length (cm)",
  },
  {
    accessorKey: "width",
    header: "Width (cm)",
  },
  {
    accessorKey: "height",
    header: "Height (cm)",
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)",
  },
  {
    accessorKey: "count",
    header: "Count",
  },
];