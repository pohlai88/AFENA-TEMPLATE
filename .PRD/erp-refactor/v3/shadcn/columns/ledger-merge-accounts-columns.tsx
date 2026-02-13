"use client";

// Column definitions for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerMergeAccounts } from "../types/ledger-merge-accounts.js";

export const ledgerMergeAccountsColumns: ColumnDef<LedgerMergeAccounts>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "merged",
    header: "Merged",
    cell: ({ row }) => row.getValue("merged") ? "Yes" : "No",
  },
];