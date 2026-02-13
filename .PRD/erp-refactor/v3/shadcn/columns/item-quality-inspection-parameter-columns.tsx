"use client";

// Column definitions for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemQualityInspectionParameter } from "../types/item-quality-inspection-parameter.js";

export const itemQualityInspectionParameterColumns: ColumnDef<ItemQualityInspectionParameter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "specification",
    header: "Parameter",
  },
  {
    accessorKey: "value",
    header: "Acceptance Criteria Value",
  },
  {
    accessorKey: "numeric",
    header: "Numeric",
    cell: ({ row }) => row.getValue("numeric") ? "Yes" : "No",
  },
  {
    accessorKey: "min_value",
    header: "Minimum Value",
  },
  {
    accessorKey: "max_value",
    header: "Maximum Value",
  },
];