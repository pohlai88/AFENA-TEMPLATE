"use client";

// Column definitions for Asset Shift Factor
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetShiftFactor } from "../types/asset-shift-factor.js";

export const assetShiftFactorColumns: ColumnDef<AssetShiftFactor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "shift_name",
    header: "Shift Name",
  },
  {
    accessorKey: "shift_factor",
    header: "Shift Factor",
  },
  {
    accessorKey: "default",
    header: "Default",
    cell: ({ row }) => row.getValue("default") ? "Yes" : "No",
  },
];