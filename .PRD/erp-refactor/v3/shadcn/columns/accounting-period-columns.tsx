"use client";

// Column definitions for Accounting Period
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountingPeriod } from "../types/accounting-period.js";

export const accountingPeriodColumns: ColumnDef<AccountingPeriod>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "period_name",
    header: "Period Name",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const val = row.getValue("start_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const val = row.getValue("end_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "disabled",
    header: "Disabled",
    cell: ({ row }) => row.getValue("disabled") ? "Yes" : "No",
  },
];