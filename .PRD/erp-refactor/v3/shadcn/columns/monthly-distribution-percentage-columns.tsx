"use client";

// Column definitions for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MonthlyDistributionPercentage } from "../types/monthly-distribution-percentage.js";

export const monthlyDistributionPercentageColumns: ColumnDef<MonthlyDistributionPercentage>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "month",
    header: "Month",
  },
  {
    accessorKey: "percentage_allocation",
    header: "Percentage Allocation",
  },
];