"use client";

// Column definitions for Allowed Dimension
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AllowedDimension } from "../types/allowed-dimension.js";

export const allowedDimensionColumns: ColumnDef<AllowedDimension>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dimension_value",
    header: "dimension_value",
  },
];