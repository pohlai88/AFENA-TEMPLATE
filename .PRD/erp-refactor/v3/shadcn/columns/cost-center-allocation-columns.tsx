"use client";

// Column definitions for Cost Center Allocation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CostCenterAllocation } from "../types/cost-center-allocation.js";
import { Badge } from "@/components/ui/badge";

export const costCenterAllocationColumns: ColumnDef<CostCenterAllocation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "main_cost_center",
    header: "Main Cost Center",
  },
  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      const val = row.getValue("valid_from") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];