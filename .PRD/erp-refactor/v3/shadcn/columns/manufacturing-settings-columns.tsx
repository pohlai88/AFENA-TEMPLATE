"use client";

// Column definitions for Manufacturing Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ManufacturingSettings } from "../types/manufacturing-settings.js";

export const manufacturingSettingsColumns: ColumnDef<ManufacturingSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "allow_production_on_holidays",
    header: "Allow Production on Holidays",
    cell: ({ row }) => row.getValue("allow_production_on_holidays") ? "Yes" : "No",
  },
];