"use client";

// Column definitions for Applicable On Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ApplicableOnAccount } from "../types/applicable-on-account.js";

export const applicableOnAccountColumns: ColumnDef<ApplicableOnAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "applicable_on_account",
    header: "Accounts",
  },
  {
    accessorKey: "is_mandatory",
    header: "Is Mandatory",
    cell: ({ row }) => row.getValue("is_mandatory") ? "Yes" : "No",
  },
];