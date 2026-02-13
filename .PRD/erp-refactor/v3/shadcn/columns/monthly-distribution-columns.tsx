"use client";

// Column definitions for Monthly Distribution
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MonthlyDistribution } from "../types/monthly-distribution.js";

export const monthlyDistributionColumns: ColumnDef<MonthlyDistribution>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "distribution_id",
    header: "Distribution Name",
  },
  {
    accessorKey: "fiscal_year",
    header: "Fiscal Year",
  },
];