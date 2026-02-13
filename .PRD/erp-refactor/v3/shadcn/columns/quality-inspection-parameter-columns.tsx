"use client";

// Column definitions for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityInspectionParameter } from "../types/quality-inspection-parameter.js";

export const qualityInspectionParameterColumns: ColumnDef<QualityInspectionParameter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "parameter",
    header: "Parameter",
  },
  {
    accessorKey: "parameter_group",
    header: "Parameter Group",
  },
];