"use client";

// Column definitions for Account Closing Balance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountClosingBalance } from "../types/account-closing-balance.js";

export const accountClosingBalanceColumns: ColumnDef<AccountClosingBalance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "closing_date",
    header: "Closing Date",
    cell: ({ row }) => {
      const val = row.getValue("closing_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "cost_center",
    header: "Cost Center",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];