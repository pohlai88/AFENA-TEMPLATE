"use client";

// Column definitions for Prospect
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Prospect } from "../types/prospect.js";

export const prospectColumns: ColumnDef<Prospect>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "annual_revenue",
    header: "Annual Revenue",
    cell: ({ row }) => {
      const val = row.getValue("annual_revenue") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "territory",
    header: "Territory",
  },
];