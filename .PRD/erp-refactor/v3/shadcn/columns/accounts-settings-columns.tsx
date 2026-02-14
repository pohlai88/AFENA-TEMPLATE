"use client";

// Column definitions for Accounts Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountsSettings } from "../types/accounts-settings.js";

export const accountsSettingsColumns: ColumnDef<AccountsSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "allow_stale",
    header: "Allow Stale Exchange Rates",
    cell: ({ row }) => row.getValue("allow_stale") ? "Yes" : "No",
  },
  {
    accessorKey: "credit_controller",
    header: "Role allowed to bypass Credit Limit",
  },
];