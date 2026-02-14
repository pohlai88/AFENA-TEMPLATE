"use client";

// Column definitions for Vehicle
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Vehicle } from "../types/vehicle.js";

export const vehicleColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "last_odometer",
    header: "Odometer Value (Last)",
  },
  {
    accessorKey: "vehicle_value",
    header: "Vehicle Value",
    cell: ({ row }) => {
      const val = row.getValue("vehicle_value") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "fuel_type",
    header: "Fuel Type",
  },
  {
    accessorKey: "uom",
    header: "Fuel UOM",
  },
];