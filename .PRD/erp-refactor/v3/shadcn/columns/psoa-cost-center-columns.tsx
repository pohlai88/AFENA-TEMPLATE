"use client";

// Column definitions for PSOA Cost Center
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PsoaCostCenter } from "../types/psoa-cost-center.js";

export const psoaCostCenterColumns: ColumnDef<PsoaCostCenter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cost_center_name",
    header: "Cost Center",
  },
];