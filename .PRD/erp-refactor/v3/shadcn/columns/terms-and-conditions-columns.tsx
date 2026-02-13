"use client";

// Column definitions for Terms and Conditions
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TermsAndConditions } from "../types/terms-and-conditions.js";

export const termsAndConditionsColumns: ColumnDef<TermsAndConditions>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "selling",
    header: "Selling",
    cell: ({ row }) => row.getValue("selling") ? "Yes" : "No",
  },
  {
    accessorKey: "buying",
    header: "Buying",
    cell: ({ row }) => row.getValue("buying") ? "Yes" : "No",
  },
];