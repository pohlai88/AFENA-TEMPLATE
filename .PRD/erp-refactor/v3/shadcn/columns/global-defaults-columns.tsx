"use client";

// Column definitions for Global Defaults
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { GlobalDefaults } from "../types/global-defaults.js";

export const globalDefaultsColumns: ColumnDef<GlobalDefaults>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "default_currency",
    header: "Default Currency",
  },
  {
    accessorKey: "hide_currency_symbol",
    header: "Hide Currency Symbol",
  },
  {
    accessorKey: "disable_rounded_total",
    header: "Disable Rounded Total",
    cell: ({ row }) => row.getValue("disable_rounded_total") ? "Yes" : "No",
  },
  {
    accessorKey: "disable_in_words",
    header: "Disable In Words",
    cell: ({ row }) => row.getValue("disable_in_words") ? "Yes" : "No",
  },
];