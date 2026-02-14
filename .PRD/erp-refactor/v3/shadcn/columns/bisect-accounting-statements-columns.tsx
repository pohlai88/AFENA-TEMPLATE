"use client";

// Column definitions for Bisect Accounting Statements
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BisectAccountingStatements } from "../types/bisect-accounting-statements.js";

export const bisectAccountingStatementsColumns: ColumnDef<BisectAccountingStatements>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "algorithm",
    header: "Algorithm",
  },
  {
    accessorKey: "current_node",
    header: "Current Node",
  },
];