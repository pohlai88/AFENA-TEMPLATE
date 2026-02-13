"use client";

// Column definitions for UOM Conversion Factor
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UomConversionFactor } from "../types/uom-conversion-factor.js";

export const uomConversionFactorColumns: ColumnDef<UomConversionFactor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "from_uom",
    header: "From",
  },
  {
    accessorKey: "to_uom",
    header: "To",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];