"use client";

// Column definitions for Fiscal Year
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { FiscalYear } from "../types/fiscal-year.js";

export const fiscalYearColumns: ColumnDef<FiscalYear>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "year",
    header: "Year Name",
  },
  {
    accessorKey: "year_start_date",
    header: "Year Start Date",
    cell: ({ row }) => {
      const val = row.getValue("year_start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "year_end_date",
    header: "Year End Date",
    cell: ({ row }) => {
      const val = row.getValue("year_end_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];