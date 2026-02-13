"use client";

// Column definitions for Journal Entry Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { JournalEntryAccount } from "../types/journal-entry-account.js";

export const journalEntryAccountColumns: ColumnDef<JournalEntryAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "party_type",
    header: "Party Type",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
  {
    accessorKey: "debit_in_account_currency",
    header: "Debit",
    cell: ({ row }) => {
      const val = row.getValue("debit_in_account_currency") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "credit_in_account_currency",
    header: "Credit",
    cell: ({ row }) => {
      const val = row.getValue("credit_in_account_currency") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
];