"use client";

// Column definitions for UOM Conversion Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { UomConversionDetail } from "../types/uom-conversion-detail.js";

export const uomConversionDetailColumns: ColumnDef<UomConversionDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
  {
    accessorKey: "conversion_factor",
    header: "Conversion Factor",
  },
];