"use client";

// Column definitions for Cost Center
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CostCenter } from "../types/cost-center.js";

export const costCenterColumns: ColumnDef<CostCenter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cost_center_name",
    header: "Cost Center Name",
  },
  {
    accessorKey: "cost_center_number",
    header: "Cost Center Number",
  },
  {
    accessorKey: "parent_cost_center",
    header: "Parent Cost Center",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];