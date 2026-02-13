"use client";

// Column definitions for Plaid Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PlaidSettings } from "../types/plaid-settings.js";

export const plaidSettingsColumns: ColumnDef<PlaidSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plaid_client_id",
    header: "Plaid Client ID",
  },
  {
    accessorKey: "plaid_secret",
    header: "Plaid Secret",
  },
  {
    accessorKey: "plaid_env",
    header: "Plaid Environment",
  },
];