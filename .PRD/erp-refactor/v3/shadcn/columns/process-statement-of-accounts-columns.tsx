"use client";

// Column definitions for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessStatementOfAccounts } from "../types/process-statement-of-accounts.js";

export const processStatementOfAccountsColumns: ColumnDef<ProcessStatementOfAccounts>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "include_ageing",
    header: "Include Ageing Summary",
    cell: ({ row }) => row.getValue("include_ageing") ? "Yes" : "No",
  },
  {
    accessorKey: "enable_auto_email",
    header: "Enable Auto Email",
    cell: ({ row }) => row.getValue("enable_auto_email") ? "Yes" : "No",
  },
];