"use client";

// Column definitions for Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Account } from "../types/account.js";

export const accountColumns: ColumnDef<Account>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "account_name",
    header: "Account Name",
  },
  {
    accessorKey: "account_number",
    header: "Account Number",
  },
];