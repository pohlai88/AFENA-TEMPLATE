"use client";

// Column definitions for Cost Center Allocation Percentage
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CostCenterAllocationPercentage } from "../types/cost-center-allocation-percentage.js";

export const costCenterAllocationPercentageColumns: ColumnDef<CostCenterAllocationPercentage>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cost_center",
    header: "Cost Center",
  },
  {
    accessorKey: "percentage",
    header: "Percentage (%)",
  },
];