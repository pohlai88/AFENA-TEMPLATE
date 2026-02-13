"use client";

// Column definitions for Workstation Cost
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkstationCost } from "../types/workstation-cost.js";

export const workstationCostColumns: ColumnDef<WorkstationCost>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operating_component",
    header: "Operating Component",
  },
  {
    accessorKey: "operating_cost",
    header: "Operating Cost",
    cell: ({ row }) => {
      const val = row.getValue("operating_cost") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];