"use client";

// Column definitions for POS Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosSettings } from "../types/pos-settings.js";

export const posSettingsColumns: ColumnDef<PosSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "invoice_type",
    header: "Invoice Type Created via POS Screen",
  },
  {
    accessorKey: "post_change_gl_entries",
    header: "Create Ledger Entries for Change Amount",
    cell: ({ row }) => row.getValue("post_change_gl_entries") ? "Yes" : "No",
  },
];