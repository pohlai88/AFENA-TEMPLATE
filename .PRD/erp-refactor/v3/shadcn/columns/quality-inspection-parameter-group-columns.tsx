"use client";

// Column definitions for Quality Inspection Parameter Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityInspectionParameterGroup } from "../types/quality-inspection-parameter-group.js";

export const qualityInspectionParameterGroupColumns: ColumnDef<QualityInspectionParameterGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "group_name",
    header: "Parameter Group Name",
  },
];