"use client";

// Column definitions for Financial Report Row
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { FinancialReportRow } from "../types/financial-report-row.js";

export const financialReportRowColumns: ColumnDef<FinancialReportRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "reference_code",
    header: "Line Reference",
  },
  {
    accessorKey: "display_name",
    header: "Display Name",
  },
  {
    accessorKey: "indentation_level",
    header: "Indent Level",
  },
  {
    accessorKey: "data_source",
    header: "Data Source",
  },
  {
    accessorKey: "balance_type",
    header: "Balance Type",
  },
  {
    accessorKey: "reverse_sign",
    header: "Reverse Sign",
    cell: ({ row }) => row.getValue("reverse_sign") ? "Yes" : "No",
  },
];