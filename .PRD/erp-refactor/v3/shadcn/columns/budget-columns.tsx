"use client";

// Column definitions for Budget
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Budget } from "../types/budget.js";
import { Badge } from "@/components/ui/badge";

export const budgetColumns: ColumnDef<Budget>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "budget_against",
    header: "Budget Against",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "account",
    header: "Account",
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