"use client";

// Column definitions for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountingDimensionDetail } from "../types/accounting-dimension-detail.js";

export const accountingDimensionDetailColumns: ColumnDef<AccountingDimensionDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "default_dimension",
    header: "Default Dimension",
  },
  {
    accessorKey: "mandatory_for_bs",
    header: "Mandatory For Balance Sheet",
    cell: ({ row }) => row.getValue("mandatory_for_bs") ? "Yes" : "No",
  },
  {
    accessorKey: "mandatory_for_pl",
    header: "Mandatory For Profit and Loss Account",
    cell: ({ row }) => row.getValue("mandatory_for_pl") ? "Yes" : "No",
  },
];