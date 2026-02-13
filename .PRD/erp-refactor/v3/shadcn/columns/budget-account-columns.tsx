"use client";

// Column definitions for Budget Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BudgetAccount } from "../types/budget-account.js";

export const budgetAccountColumns: ColumnDef<BudgetAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "budget_amount",
    header: "Budget Amount",
    cell: ({ row }) => {
      const val = row.getValue("budget_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];