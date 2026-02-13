"use client";

// Column definitions for Tax Withholding Rate
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxWithholdingRate } from "../types/tax-withholding-rate.js";

export const taxWithholdingRateColumns: ColumnDef<TaxWithholdingRate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "tax_withholding_group",
    header: "Tax Withholding Group",
  },
  {
    accessorKey: "tax_withholding_rate",
    header: "Tax Withholding Rate",
  },
  {
    accessorKey: "cumulative_threshold",
    header: "Cumulative Threshold",
  },
  {
    accessorKey: "single_threshold",
    header: "Transaction Threshold",
  },
];